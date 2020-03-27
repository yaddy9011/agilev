import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../services/tasks.service';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';

@Component({
  selector: 'app-diagnostico-areas',
  templateUrl: './diagnostico-areas.component.html',
  styleUrls: ['./diagnostico-areas.component.css']
})

export class DiagnosticoAreasComponent implements OnInit {

  id_usr: String;
  _idEval: String;
  DataAreas = [];
  DataRpa = [];
  tasksDataSourceStorage: any;

  constructor(private route: ActivatedRoute, private taskService: TasksService) {

    this.tasksDataSourceStorage = [];
    this._idEval = this.route.snapshot.paramMap.get('id_eval');
    this.id_usr = localStorage.getItem("ACCESS_IDS");
    this.GenerarDiagnosticoareas();
  }

  GenerarDiagnosticoareas() {
    const Data = {
      id_eval: this._idEval,
      id_usr: this.id_usr
    };

    this.taskService.GetDiagnosticAreas(Data)
      .subscribe(diags => {

        let levels = diags.map((ev, i) => {

          let na = ev.nivelapli;
          let na_title = "";
          let na_new = 0;

          switch (na) {
            case 0:
              na_title = "No Aplica";
              na_new = 0;
              break;
            case 1:
              na_title = "Muy Bajo";
              na_new = 20;
              break;
            case 2:
              na_title = "Bajo";
              na_new = 40;
              break;
            case 3:
              na_title = "Medio";
              na_new = 60;
              break;
            case 4:
              na_title = "Alto";
              na_new = 80;
              break;
            case 5:
              na_title = "Muy Alto";
              na_new = 100;
              break;
          }

          const arraData = {
            _id: ev._id,
            n_prac: Number(ev.n_prac),
            Descrip_prac: ev.Datos_practicas.descripcion,
            n_area: Number(ev.rpa.n_area),
            name_area: ev.area.name,
            na_t: na_title,
            na: na_new,
          };
          return arraData;
        });


        let arrSuma = levels.reduce((contador, objeto) => {
          contador[objeto.n_area] = (contador[objeto.n_area] || 0) + objeto.na;
          return contador;
        }, {});


        const TotalRpa = levels.reduce((contador, objeto) => {
          contador[objeto.n_area] = (contador[objeto.n_area] || 0) + 1;
          return contador;
        }, {});


        let areas = levels.filter((valorActual, indiceActual, arreglo) => {
          return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.n_area) === JSON.stringify(valorActual.n_area)) === indiceActual
        });

        let mapAreas = areas.map((mo, i) => {
          let PorcentajeDiagnostic = Math.round(Number(arrSuma[mo.n_area] / TotalRpa[mo.n_area]));
          const Data = {
            n_area: mo.n_area,
            title_area: mo.name_area,
            tnaa: arrSuma[mo.n_area],
            trpa: TotalRpa[mo.n_area],
            da: PorcentajeDiagnostic
          };
          return Data;
        });

        this.DataAreas = mapAreas;
        this.DataRpa = levels;
        console.log(mapAreas);

      });

  }

  getPracticas(key) {
    let item = this.tasksDataSourceStorage.find((i) => i.key === key);
    if (!item) {
      item = {
        key: key,
        dataSourceInstance: new DataSource({
          store: new ArrayStore({
            data: this.DataRpa,
            key: "_id"
          }),
          filter: ["n_area", "=", key]
        })
      };
      this.tasksDataSourceStorage.push(item)
    }
    return item.dataSourceInstance;
  }

  ngOnInit() {
  }

}
