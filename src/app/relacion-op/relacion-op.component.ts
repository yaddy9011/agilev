import { Component, OnInit } from '@angular/core';
import { CrudRopService } from '../services/crud-rop.service';
import { Gobjetivo } from '../clases/gobjetivos';
import { CrudGoService } from '../services/crud-go.service';
import { CrudGpService } from '../services/crud-gp.service';
import { Gpractica } from '../clases/gpracticas';
@Component({
  selector: 'app-relacion-op',
  templateUrl: './relacion-op.component.html',
  styleUrls: ['./relacion-op.component.css']
})
export class RelacionOpComponent implements OnInit {

  Rop = [];
  Objs: Gobjetivo[];
  Practicas: Gpractica[];

  constructor(private CrudRopService: CrudRopService, private CrudGpService: CrudGpService, private ObjCrudService: CrudGoService) {
    this.getRop();
    this.getAllObj();
    this.getAllPracticas();
  }

  getRop() {
    this.CrudRopService.GetRop()
      .subscribe(rop => {
        var array_new = [];
        for (let elemento of rop) {
          const DataNew = {
            _id: elemento._id,
            n_obj: elemento.n_obj,
            n_prac: elemento.n_prac,
            n_c: elemento.nivel_contribucion,
            text_prac: elemento.prac.descripcion,
            text_obj: elemento.n_obj + " " +  elemento.obj.descrip
          };
          array_new.push(DataNew);
        }
        this.Rop=array_new;
      });
  }

  getAllObj() {
    this.ObjCrudService.getObjetivos()
      .subscribe(res => {
        this.Objs = res;
      });
  }

  getAllPracticas() {
    this.CrudGpService.GetPracticas()
      .subscribe(res => {
        this.Practicas = res;
      });
  }

  onEditorPreparing(e: any): void {
    if (e.dataField == "n_obj") {
      if (e.row.isNewRow) {
        e.editorOptions.disabled = e.row.inserted;
      } else {
        e.editorOptions.disabled = !e.row.inserted;
      }
    }
  }

  InsertRow(e) {

    var newData = {
      n_obj: e.data.n_obj,
      n_prac: e.data.n_prac,
      nivel_contribucion: e.data.n_c
    };

    this.CrudRopService.InsertRop(newData)
      .subscribe(res => {
        this.getRop();
      });
  }

  UpdateRow(e) {

    var n_obj = e.oldData.n_obj;
    if (e.newData.n_obj) n_obj = e.newData.n_obj;

    var n_prac = e.oldData.n_prac;
    if (e.newData.n_prac) n_prac = e.newData.n_prac;

    var n_c = e.oldData.n_c;
    if (e.newData.n_c) n_c = e.newData.n_c;

    var newAct = {
      _id: e.key,
      n_obj: n_obj,
      n_prac: n_prac,
      nivel_contribucion: n_c
    };

    this.CrudRopService.UpdateRop(newAct)
      .subscribe(res => {
      });

  }

  DeleteRow(e) {
    this.CrudRopService.DeleteRop(e.key)
      .subscribe(res => {
      });
  }

  ngOnInit() {
  }

}
