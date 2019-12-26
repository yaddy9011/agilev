import { Component, OnInit, ViewChild } from '@angular/core';
import { Gobjetivo } from '../clases/gobjetivos';
import { CrudGoService } from '../services/crud-go.service';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-gestion-objetivos',
  templateUrl: './gestion-objetivos.component.html',
  styleUrls: ['./gestion-objetivos.component.css']
})
export class GestionObjetivosComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  Objs: Gobjetivo[];

  constructor(private ObjCrudService: CrudGoService) {
    this.getAllObj();
  }

  ngOnInit() { }

  public getAllObj() {
    this.ObjCrudService.getObjetivos()
      .subscribe(res => {
        this.Objs = res;
      });
  }

  UpdateRow(e) {
    var des = e.oldData.descrip;
    if (e.newData.descrip) des = e.newData.descrip;
    var clave = e.oldData.clave;
    if (e.newData.clave) clave = e.newData.clave;
    var ActualizacionObj = {
      _id: e.key,
      descrip: des,
      clave: clave,
      _n: e.oldData._n
    };
    this.ObjCrudService.updateObjetivos(ActualizacionObj)
      .subscribe(res => {
      });
    var gridInstance = e.component;
    gridInstance.refresh();

  }

  onEditorPreparing(e: any): void {
    if (e.dataField == "_n") {
      e.editorOptions.disabled = !e.row.inserted;
    }
  }

  DeleteRow(e) {
    this.ObjCrudService.deleteObjetivos(e.key)
      .subscribe(res => {
        this.getAllObj();
      });
    // var gridInstance = e.component;
    // gridInstance.refresh();
    // this.dataGrid.instance.refresh();
  }

  InsertRow(e) {
    var newData = {
      descrip: e.data.descrip,
      clave: e.data.clave,
      _n: this.Objs.length + 1
    };

    this.ObjCrudService.insertObj(newData)
      .subscribe(res => {
        this.getAllObj();
      });
  }




}
