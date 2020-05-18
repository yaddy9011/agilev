import { Component, OnInit } from '@angular/core';
import { Diagnostico } from '../clases/diagnotico';
import { EvalResulService } from '../services/eval-resul.service';
import { TasksService } from '../services/tasks.service';
import { ActivatedRoute } from '@angular/router';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { obj } from '../clases/obj';

@Component({
  selector: 'app-diagnostico-objetivos',
  templateUrl: './diagnostico-objetivos.component.html',
  styleUrls: ['./diagnostico-objetivos.component.css']
})
export class DiagnosticoObjetivosComponent implements OnInit {

  DatosObj: obj[];
  DataRop = [];
  tasksDataSourceStorage: any;
  AgilidadTotal = 0;
  panelOpenState = false;
  id_usr: String;
  _idEval: String;
  DataAreas = [];
  DataRpa = [];
  tasksDataSourceStorageAreas: any;

  constructor(private EvalResulService: EvalResulService, private taskService: TasksService, private route: ActivatedRoute) {

    this.tasksDataSourceStorage = [];
    this.tasksDataSourceStorageAreas = [];
    this.id_usr = localStorage.getItem("ACCESS_IDS");
    this._idEval = this.route.snapshot.paramMap.get('id_eval');

    var p = new Diagnostico(taskService, this._idEval, EvalResulService);
    p.GetDataEva(false);

    this.EvalResulService.routeDataA().subscribe(data => {
      let newlv = data.sort((a, b) => a.n_obj - b.n_obj);
      this.DatosObj = newlv;
    });

    this.EvalResulService.routeDataB().subscribe(data => {
      this.DataRop = data;
    });

    this.EvalResulService.routeDataC().subscribe(data => {
      this.AgilidadTotal = data;
    });

    this.GenerarDiagnosticoareas();

  }

  getPracticas(key) {
    let item = this.tasksDataSourceStorage.find((i) => i.key === key);
    if (!item) {
      item = {
        key: key,
        dataSourceInstance: new DataSource({
          store: new ArrayStore({
            data: this.DataRop,
            key: "_idpe"
          }),
          filter: ["n_obj", "=", key]
        })
      };
      this.tasksDataSourceStorage.push(item)
    }
    return item.dataSourceInstance;
  }

  customizeText(cellInfo) {
    return cellInfo.value + "%";
  }

  customizeTooltip(arg) {
    var datashow = arg.point.data.TexObj;
    return {
      text: arg.argumentText + "<br/>" + datashow + "<br><br>" + arg.value + "%"
    };
  }

  onLegendClick(e) {
    console.log(e);
    let series = e.target;
    if (series.isVisible()) {
      series.hide();
    } else {
      series.hide();
    }
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
            na_c:na,
            aplicable:ev.aplicable
          };
          return arraData;

        });


        let arrSuma = levels.reduce((contador, objeto) => {
          contador[objeto.n_area] = (contador[objeto.n_area] || 0) + objeto.na;
          return contador;
        }, {});


        // var filterNa = levels.filter(function (task) {
        //   return task.na > 0;
        // });
        // console.log(filterNa);


        const TotalRpa = levels.reduce((contador, objeto) => {
          if (objeto.na != 0) {
            contador[objeto.n_area] = (contador[objeto.n_area] || 0) + 1;
          }
          return contador;
        }, {});


        let areas = levels.filter((valorActual, indiceActual, arreglo) => {
          return arreglo.findIndex(valorDelArreglo => JSON.stringify(valorDelArreglo.n_area) === JSON.stringify(valorActual.n_area)) === indiceActual
        });

        let mapAreas = areas.map((mo, i) => {
          let PorcentajeDiagnostic;
          if (TotalRpa[mo.n_area] === undefined) {
            PorcentajeDiagnostic = 0;
          } else {
            PorcentajeDiagnostic = Math.round(Number(arrSuma[mo.n_area] / TotalRpa[mo.n_area]));
          }
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

      });

  }

  getPracticasAreas(key) {
    let item = this.tasksDataSourceStorageAreas.find((i) => i.key === key);
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
      this.tasksDataSourceStorageAreas.push(item)
    }
    return item.dataSourceInstance;
  }

  onRowPreparedOBJ(e) {
    if (e.data) {
      if (e.data.NoInteresa == true) {
        e.rowElement.style.backgroundColor = "#E6E6FA";
      }
    }
  }

  onRowPreparedPrac(e) {
    var color;
    if (e.data) {
      if (e.data.aplicable == true) {
        color = "#EEE8AA";
      } else if (e.data.na == 0) {
        color = "#FFDAB9";
      }
      e.rowElement.style.backgroundColor = color;
    }
  }

  ngOnInit() {
  }

}
