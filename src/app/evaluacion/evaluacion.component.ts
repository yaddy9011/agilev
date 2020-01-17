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
import { WorkLine } from '../clases/workline';
import { DialogOverviewExampleDialog } from '../evaluacion/dialog.component';

// si todas las prácticas asociadas al objetivo tienen un nivel
// muy alto de aplicación (5) el objetivo debería estar 100% ágilizado

// Si todas las prácticas asociadas al objetivo tienen un nivel muy bajo de
// aplicación NO debería salir un porcentaje muy alto de agilidad del objetivo.

// Si todas las prácticas asociadas al objetivo tuvieran la misma contribución para ese objetivo
// el porcentaje de agilidad del objetivo debería reducirse al promedio de porcentaje de aplicación
// de las prácticas asociadas a él.

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
  NewWl: WorkLine[];
  idst: string;
  popupVisible = false;
  selectvalue = null;

  constructor(private authService: AuthService, private router: Router, private taskService: TasksService, public dialog: MatDialog) {
    this.idst = localStorage.getItem("ACCESS_IDS");
    this.GetEvalByUSR();
    //this.GetWorkLines();
  }

  ngOnInit() {
  }

  GenerarEvaluacion(e) {
    // this.popupVisible = true;
    this.InsertEval(e);
  }

  InsertEval(e) {

    //console.log(this.selectvalue);
    let DataEval = {
      id: this.idst,
      workLine: "5e14e3353e702d0d2c2c26e5"
      // workLine:this.selectvalue
    }

    this.authService.GuardarEvaluacion(DataEval).subscribe(res => {
      console.log(res);
    });
    location.reload();
  }

  listValueChanged(e) {
    this.selectvalue = e.value;
  }

  GetEvalByUSR() {
    this.taskService.getEvalByObj(this.idst)
      .subscribe(evals => {
        this.newarrs = evals;
      });
  }

  VerEval(id) {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '1000px',
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

  GetWorkLines() {
    this.taskService.getWorkLines()
      .subscribe(wl => {
        this.NewWl = wl;
      });
  }
  

}