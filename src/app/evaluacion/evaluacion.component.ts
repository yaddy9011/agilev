import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TasksService } from '../services/tasks.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Eval } from '../clases/evaluacionbyobj';
import { obj } from '../clases/obj';
import { Practica } from '../clases/practica';
import { Rop } from '../clases/rop';

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
  }

  GetEvalByUSR() {
    this.taskService.getEvalByObj(this.idst)
      .subscribe(evals => {
        this.newarrs = evals;
      });
  }
  remove(id) {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '600px',
      data: { idEval: this.newarrs[id]._id }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
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
  ArrayPrac: Practica[];
  Arrayobj: obj[];
  objs: obj[];
  Rop: Rop[];
  public ArrayRelacion: Rop[];
  DatosObj = [];
  arrROP = [];

  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private taskService: TasksService) {
    this.idst = localStorage.getItem("ACCESS_IDS");
    this._idEval = data.idEval;
    this.getObjetivosByUSR();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getPracticasbyEval() {
    var prac_v = []
    this.taskService.getPracticasbyEval(this._idEval)
      .subscribe(pa => {
        for (var i = 0; i < pa.length; i++) {
          const arraData = {
            _id: pa[i]._id,
            n_prac: Number(Object.values(pa[i].id_prac)[4]),
            textprac: Object.values(pa[i].id_prac)[0],
            nivelapli: pa[i].nivelapli,
            id_usr: pa[i].id_usr,
            id_eval: pa[i].id_eval,
            id_prac: pa[i].id_prac
          };
          prac_v.push(arraData);
        }
      });
    this.ArrayPrac = prac_v;
  }

  getObjetivosByUSR() {
    var ids = [];
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
          ids.push(arraData);
        }
        this.objs = ids;
        this.getPracticasbyEval();
        this.getEvaluacionPorcentajes();
      });
  }
  // creo que se puede solucionar mandando arrays por metodos checar
  getEvaluacionPorcentajes() {
    this.taskService.getrop()
      .subscribe(v => {
        var y = [];
        for (let elemento of v) {
          y.push(elemento);
        }
        this.Rop = y;
        for (var i = 0; i < this.objs.length; i++) {
          var rsum = 0;
          var n_obj = this.objs[i].n_obj;
          var var_obj = this.objs[i].objetivo;
          var xnum = this.objs[i].num;
          this.BuscarRelacionOP(n_obj);
          rsum = Number(this.SumarTotales());
          var CEval = n_obj + " " + var_obj + " : " + rsum;
          for (let elemento of this.ArrayRelacion) {

            const CadenaFinal = {
              grup_ob: n_obj,
              n_prac: elemento.n_prac,
              n_c: elemento.nivel_contribucion,
              n_a: elemento.na
            };

            this.arrROP.push(CadenaFinal);
          }

          const datosnew = {
            n_obj: n_obj,
            objetivo: var_obj,
            num: xnum,
            total_Eva: rsum
          };
          this.DatosObj.push(datosnew);
        }
        console.log(this.arrROP);
        console.log(this.DatosObj);
      });
  }

  BuscarRelacionOP(n_obj: number) {
    var t = [];
    for (var i = 0; i < this.Rop.length; i++) {
      var ob = this.Rop[i].n_obj;
      if (ob == n_obj) {
        var nc = this.Rop[i].nivel_contribucion;
        var pa = this.Rop[i].n_prac;
        var na = this.BuscarNA(pa);
        const datosnew = {
          n_obj: ob,
          n_prac: pa,
          nivel_contribucion: nc,
          na: na
        };
        t.push(datosnew);
        console.log(ob);
        console.log(pa);
        console.log(nc);
        console.log(na);
        console.log("---");
      }
    }
    this.ArrayRelacion = t;
  }

  BuscarNA(prac: Number) {

    var res: Number;
    for (var i = 0; i < this.ArrayPrac.length; i++) {
      if (prac == Number(this.ArrayPrac[i].n_prac)) {
        res = Number(this.ArrayPrac[i].nivelapli);
      }
    }
    return res;
  }

  SumarTotales() {
    let SumaObjetivos: number = 0;
    for (var j = 0; j < this.ArrayRelacion.length; j++) {
      //  console.log("objetivo " + this.ArrayRelacion[j].n_obj);
      // console.log("practica " + this.ArrayRelacion[j].n_prac);
      var nc = Number(this.ArrayRelacion[j].nivel_contribucion);
      var na = Number(this.ArrayRelacion[j].na);
      // console.log("nivel contribucion " + nc);
      // console.log("nivel aplicacion " + na);
      var Mul = nc * na;
      // console.log("multiplicacion " + Mul);
      SumaObjetivos = SumaObjetivos + Mul;
    }
    return SumaObjetivos;
  }
}