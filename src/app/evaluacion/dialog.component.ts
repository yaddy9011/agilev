
import { Component, OnInit, Inject } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EvalResulService } from '../services/eval-resul.service';
import { Evaluacion } from '../evaluacion/eval.class';

export interface DialogData {
    idEval: String;
}

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-overview-example-dialog.html',
    styleUrls: ['./evaluacion.component.css']
})

export class DialogOverviewExampleDialog {

    _idEval: String;
    DatosObj = [];
    arrROP = [];
    AgilidadTotal = 0;

    constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
        @Inject(MAT_DIALOG_DATA)
        public data: DialogData,
        private taskService: TasksService,
        private EvalResulService: EvalResulService,
        private router: Router) {

        this._idEval = data.idEval;
        var p = new Evaluacion(taskService, this._idEval, EvalResulService);
        p.getObjetivosByUSR();

        this.EvalResulService.routeDataA().subscribe(data => {
            this.DatosObj = data;
        });

        this.EvalResulService.routeDataB().subscribe(data => {
            this.arrROP = data;
            console.log(this.arrROP);
        });

        this.EvalResulService.routeDataC().subscribe(data => {
            this.AgilidadTotal = data;
        });

    }

    getMasterDetailGridDataSource(n_objX: number): any {
        const result = this.arrROP.filter(d => d.n_obj == n_objX);
        return result;
    }

    customizeText(cellInfo) {
        return cellInfo.value + " %";
    }

    onNoClick(): void {
        this.dialogRef.close();
        this.router.navigateByUrl('/eval');
    }
}