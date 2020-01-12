import { Component, OnInit } from '@angular/core';
import { CrudGpService } from '../services/crud-gp.service';
import { Gpractica } from '../clases/gpracticas';

@Component({
  selector: 'app-gestion-practicas',
  templateUrl: './gestion-practicas.component.html',
  styleUrls: ['./gestion-practicas.component.css']
})
export class GestionPracticasComponent implements OnInit {

  Practicas: Gpractica[];
  constructor(private CrudGpService: CrudGpService) { 
    this.GetPracticas();
  }
  ngOnInit() {
  }

 GetPracticas() {
    this.CrudGpService.GetPracticas()
      .subscribe(res => {
        this.Practicas = res;
      });
  }

  UpdateRow(e) {
    var des = e.oldData.descripcion;
    if (e.newData.descripcion) des = e.newData.descripcion;

    var cl = e.oldData.Clave;
    if (e.newData.Clave) cl = e.newData.Clave;

    var metodo = e.oldData.metodo_agil;
    if (e.newData.metodo_agil) metodo = e.newData.metodo_agil;

    var ActualizacionPrac = {
      _id: e.key, 
      Clave: cl,
      descripcion: des,
      metodo:metodo,
      n_prac: e.oldData.n_prac
    };

    this.CrudGpService.UpdatePractica(ActualizacionPrac)
      .subscribe(res => {
      });

  }

  onEditorPreparing(e: any): void {
    if (e.dataField == "n_prac") {
      e.editorOptions.disabled = !e.row.inserted;
    }
  }

  DeleteRow(e) {
    this.CrudGpService.DeletePractica(e.key)
      .subscribe(res => {
        this.GetPracticas();
      });
  }

  InsertRow(e) {
    
    var newData = {
      descripcion: e.data.descripcion,
      metodo_agil: e.data.metodo_agil,
      n_prac: this.Practicas.length + 1,
      Clave: e.data.Clave
    };

    this.CrudGpService.InsertPractica(newData)
      .subscribe(res => {
        this.GetPracticas();
      });


  }


}
