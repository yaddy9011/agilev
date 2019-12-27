import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TasksService } from '../services/tasks.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Eval } from '../clases/evaluacionbyobj';
import { obj } from '../clases/obj';
import { Practica } from '../clases/practica';
import { Rop } from '../clases/rop';
import { Router } from '@angular/router';


// si todas las prácticas asociadas al objetivo tienen un nivel 
// muy alto de aplicación (5) el objetivo debería estar 100% ágilizado 


// Si todas las prácticas asociadas al objetivo tienen un nivel muy bajo de 
// aplicación NO debería salir un porcentaje muy alto de agilidad del objetivo. 


// Si todas las prácticas asociadas al objetivo tuvieran la misma contribución para ese objetivo 
// el porcentaje de agilidad del objetivo debería reducirse al promedio de porcentaje de aplicación 
// de las prácticas asociadas a él. 

export interface DialogData {
  idEval: String;
}

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class EvaluacionComponent implements OnInit {

  newarrs: Eval[];
  idst: string;

  constructor(private authService: AuthService, private taskService: TasksService, public dialog: MatDialog) {
    this.idst = localStorage.getItem("ACCESS_IDS");
    this.GetEvalByUSR();
  }

  ngOnInit() { }

  GenerarEvaluacion() {
    this.authService.GuardarEvaluacion(this.idst).subscribe(res => { console.log(res); });
    location.reload();
  }

  GetEvalByUSR() {
    this.taskService.getEvalByObj(this.idst)
      .subscribe(evals => {
        this.newarrs = evals;
      });
  }

  VerEval(id) {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '900px',
      data: { idEval: this.newarrs[id]._id }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  EliminarEval(id) {
    this.taskService.DeleteEval(id)
      .subscribe(evals => {
      });
    location.reload();
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./evaluacion.component.css']
})

export class DialogOverviewExampleDialog {

  idst: string;
  _idEval: String;
  public ArrayPrac = [];
  Arrayobj: obj[];
  objs: obj[];
  Rop: Rop[];
  public ArrayRelacion = [];
  DatosObj = [];
  arrROP = [];
  AgilidadTotal = 0;

  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private taskService: TasksService) {
    this.idst = localStorage.getItem("ACCESS_IDS");
    this._idEval = data.idEval;
    this.getObjetivosByUSR();
  }

  onNoClick(): void {
    this.dialogRef.close();
    location.reload();
  }

  getPracticasbyEval() {
    var prac_v = []
    this.taskService.getPracticasbyEval(this._idEval)
      .subscribe(pa => {
        for (var i = 0; i < pa.length; i++) {
          const arraData = {
            _id: pa[i]._id,
            n_prac: Number(Object.values(pa[i].id_prac)[3]),
            textprac: Object.values(pa[i].id_prac)[1],
            nivelapli: pa[i].nivelapli,
            id_usr: pa[i].id_usr,
            id_eval: pa[i].id_eval,
            id_prac: pa[i].id_prac
          };
          prac_v[i] = arraData;
        }
      });

    // console.log(prac_v);
    this.ArrayPrac = prac_v;
  }

  getObjetivosByUSR() {
    this.getPracticasbyEval();
    var array_new_obj = [];
    this.taskService.getobj(this.idst)
      .subscribe(obj => {
        this.Arrayobj = obj;
        this.Arrayobj.sort((a, b) => a.pos - b.pos);
        for (var i = 0; i < this.Arrayobj.length; i++) {
          const arraData = {
            _id: obj[i]._id,
            objetivo: Object.values(obj[i].id_obj)[1],
            id_usr: obj[i].id_usr,
            id_obj: Object.values(obj[i].id_obj)[0],
            pos: obj[i].pos,
            num: Object.values(obj[i].id_obj)[2],
            n_obj: Object.values(obj[i].id_obj)[3]
          };
          array_new_obj.push(arraData);
        }
        this.objs = array_new_obj;
        this.getEvaluacionPorcentajes();
      });
  }

  getEvaluacionPorcentajes() {
    this.taskService.getrop()
      .subscribe(v => {
        var y = [];
        //var ArrayMaxSum: number[] = [];
        for (let elemento of v) {
          y.push(elemento);
        }
        this.Rop = y;
        let TotalAgilidadObjetivos: number = 0;
        for (var i = 0; i < this.objs.length; i++) {
          var n_obj = this.objs[i].n_obj;
          var var_obj = this.objs[i].objetivo;
          var xnum = this.objs[i].num;
          this.BuscarRelacionOP(n_obj);
          var rsum = this.SumarTotales();
          for (let elemento of this.ArrayRelacion) {

            let n_a;
            switch (elemento.na) {
              case 0: {
                break;
              }
              case 1: {
                n_a = "Muy Bajo";
                break;
              }
              case 2: {
                n_a = "Bajo";
                break;
              }
              case 3: {
                n_a = "Medio";
                break;
              }
              case 4: {
                n_a = "Alto";
                break;
              }
              case 5: {
                n_a = "Muy alto";
                break;
              }
              default: {
                break;
              }
            }


            const CadenaFinal = {
              n_obj: n_obj,
              n_prac: elemento.n_prac,
              n_c: elemento.nivel_contribucion,
              n_a: n_a,
              texp: elemento.textprac
            };
            this.arrROP.push(CadenaFinal);
          }
          const datosnew = {
            n_obj: n_obj,
            objetivo: var_obj,
            num: xnum,
            total_Eva: rsum + " %"
          };

          //ArrayMaxSum.push(rsum);
          TotalAgilidadObjetivos = TotalAgilidadObjetivos + rsum;
          this.DatosObj.push(datosnew);
        }

        // var Newmax = Math.max.apply(null, ArrayMaxSum);
        this.AgilidadTotal = Math.round(TotalAgilidadObjetivos / this.DatosObj.length);
        // console.log(this.arrROP);
        //console.log(this.DatosObj);
      });
  }

  BuscarRelacionOP(n_obj: Number) {
    var t = [];
    for (var i = 0; i < this.Rop.length; i++) {
      var ob = this.Rop[i].n_obj;
      if (ob == n_obj) {
        var nc = this.Rop[i].nivel_contribucion;
        var pa = this.Rop[i].n_prac;
        let arrdp = this.BuscarNA(pa);
        if (arrdp.nivelapli != 0) {
          const datosnew = {
            n_obj: ob,
            n_prac: pa,
            nivel_contribucion: nc,
            na: arrdp.nivelapli,
            textprac: arrdp.textprac
          };
          t.push(datosnew);
        }

        // console.log(ob);
        // console.log(pa);
        // console.log(nc);
        // console.log(arrdp.nivelapli);
        // console.log("---");
      }
    }
    this.ArrayRelacion = t;
  }

  BuscarNA(prac: Number) {
    var res;
    for (var i = 0; i < this.ArrayPrac.length; i++) {
      if (prac == Number(this.ArrayPrac[i].n_prac)) {
        let DatosPrac = {
          nivelapli: Number(this.ArrayPrac[i].nivelapli),
          textprac: this.ArrayPrac[i].textprac
        }
        res = DatosPrac;
      }
    }
    return res;
  }

  SumarTotales() {
    //var arraySums: Number[] = [];
    let SumaNivelAplicacion: number = 0;
    let ResulTotal: number = 0;
    for (var j = 0; j < this.ArrayRelacion.length; j++) {
      // var nc = Number(this.ArrayRelacion[j].nivel_contribucion);
      var na = Number(this.ArrayRelacion[j].na);
      //var Mul = nc * na;
      // arraySums.push(Mul);

      var NewValNa = 0;
      //console.log("naaa" + na);
      switch (na) {
        case 0: {
          break;
        }
        case 1: {
          NewValNa = 0;
          break;
        }
        case 2: {
          NewValNa = 0.25;
          break;
        }
        case 3: {
          NewValNa = 0.50;
          break;
        }
        case 4: {
          NewValNa = 0.75;
          break;
        }
        case 5: {
          NewValNa = 1;
          break;
        }
        default: {
          break;
        }
      }
      //console.log(NewValNa);
      SumaNivelAplicacion = SumaNivelAplicacion + NewValNa;
    }

    // var max = Math.max.apply(null, arraySums);
    // console.log("----");
    // console.log(SumaNivelAplicacion);
    // console.log(this.ArrayRelacion.length / SumaNivelAplicacion);

    let porcentaje: number;
    if (SumaNivelAplicacion == 0) {
      porcentaje = 0;
    } else {
      porcentaje = Number(100 / (this.ArrayRelacion.length / SumaNivelAplicacion));
    }
    ResulTotal = Math.round(porcentaje);
    return ResulTotal;
  }

}