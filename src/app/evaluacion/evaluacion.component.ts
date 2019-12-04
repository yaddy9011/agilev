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
  dataSource;
  columnsToDisplay = ['_id', 'fecha_creacion'];
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
        this.dataSource = this.newarrs;
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
})

export class DialogOverviewExampleDialog {

  idst: string;
  _idEval: String;
  ArrayPrac: Practica[];
  Arrayobj: obj[];
  objs: obj[];
  Rop: Rop[];

  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private taskService: TasksService) {

    this.idst = localStorage.getItem("ACCESS_IDS");
    this._idEval = data.idEval;
    this.getObjetivosByUSR();
    console.log(this.objs);
    this.getPracticasbyEval();
   
    //this.getEvaluacionPorcentajes();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  GetRop(IdObj) {
    this.taskService.getrop(IdObj)
      .subscribe(rop => {
        this.Rop = rop;
      });
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
        console.log(this.ArrayPrac);

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
      
      });

        this.objs = ids;
        console.log(this.objs);
  }


  getEvaluacionPorcentajes() {

  

    for (var i = 0; i < this.objs.length; i++) {

      var n_obj = this.objs[i].n_obj;

       this.BuscarRelacionOP(n_obj);

    }

  }

  BuscarRelacionOP(n_obj) {

    this.GetRop(n_obj);

    for (var i = 0; i < this.Rop.length; i++) {
      var ob = this.Rop[i].n_obj;
      var nc = this.Rop[i].nivel_contribucion;
      var pa = this.Rop[i].n_prac;

    const prar = this.ArrayPrac.find( ncy => ncy.n_prac === pa);
    console.log(prar.nivelapli);


    }




  }






}