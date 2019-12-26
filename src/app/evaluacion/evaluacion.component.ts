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
          prac_v[i]=arraData;
        }
      });

      console.log(prac_v);
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
        var ArrayMaxSum: number[] = [];

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
            const CadenaFinal = {
              n_obj: n_obj,
              n_prac: elemento.n_prac,
              n_c: elemento.nivel_contribucion,
              n_a: elemento.na,
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

          ArrayMaxSum.push(rsum);
          TotalAgilidadObjetivos = TotalAgilidadObjetivos + rsum;
          this.DatosObj.push(datosnew);
        }

        var Newmax = Math.max.apply(null, ArrayMaxSum);
        this.AgilidadTotal = Math.round(((TotalAgilidadObjetivos / this.DatosObj.length) / Newmax) * 100);
        // console.log(this.arrROP);
        //console.log(this.DatosObj);
      });
  }

  BuscarRelacionOP(n_obj: number) {
    var t = [];
    for (var i = 0; i < this.Rop.length; i++) {
      var ob = this.Rop[i].n_obj;
      if (ob == n_obj) {
        var nc = this.Rop[i].nivel_contribucion;
        var pa = this.Rop[i].n_prac;
        let arrdp = this.BuscarNA(pa);
        const datosnew = {
          n_obj: ob,
          n_prac: pa,
          nivel_contribucion: nc,
          na: arrdp.nivelapli,
          textprac: arrdp.textprac
        };
        t.push(datosnew);
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
    var arraySums: number[] = [];
    let SumaObjetivos: number = 0;
    let ResulTotal: number = 0;
    for (var j = 0; j < this.ArrayRelacion.length; j++) {
      var nc = Number(this.ArrayRelacion[j].nivel_contribucion);
      var na = Number(this.ArrayRelacion[j].na);
      var Mul = nc * na;
      arraySums.push(Mul);
      SumaObjetivos = SumaObjetivos + Mul;
    }
    var max = Math.max.apply(null, arraySums);
    var porcentaje = (Number((SumaObjetivos / this.ArrayRelacion.length) / max)) * 100;
    ResulTotal = Math.round(porcentaje);
    return ResulTotal;
  }

}