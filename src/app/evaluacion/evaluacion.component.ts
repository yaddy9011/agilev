import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TasksService } from '../services/tasks.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Eval } from '../clases/evaluacionbyobj';
import { obj } from '../clases/obj';

export interface DialogData {
  animal: string;
  name: string;
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

  animal: string;
  name: string;
  newarrs: Eval[];
  Arrayobj: obj[];
  dataSource;
  columnsToDisplay = ['_id', 'fecha_creacion'];
  idst: string;

  constructor(private authService: AuthService, private taskService: TasksService, public dialog: MatDialog) {
    this.idst = localStorage.getItem("ACCESS_IDS");
    this.GetEvalByObj();
    console.log(this.newarrs);
    this.GetObjetivosbyUsr();
  }

  ngOnInit() { }

  GenerarEvaluacion() {
    this.authService.GuardarEvaluacion(this.idst).subscribe(res => { console.log(res); });
  }

  GetEvalByObj() {
    this.taskService.getEvalByObj(this.idst)
      .subscribe(evals => {
        console.log(evals);
        this.newarrs = evals;
        this.dataSource = this.newarrs;
      });
  }

  GetRop() {
    this.taskService.getrop(this.idst)
      .subscribe(rop => {
        console.log(rop);
      });
  }

  GetObjetivosbyUsr() {

    this.taskService.getobj(this.idst)
      .subscribe(ob => {
        console.log(ob);
        this.Arrayobj = ob;
      });
  }


  remove(id) {
    console.log(id);

    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px', 
      data: { name: id, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });

  }

}


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})

export class DialogOverviewExampleDialog {

  constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}