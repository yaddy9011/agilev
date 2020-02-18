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

  constructor(private EvalResulService: EvalResulService, private taskService: TasksService, private route: ActivatedRoute) {

    this.tasksDataSourceStorage = [];
    var id_eval = this.route.snapshot.paramMap.get('id_eval');
    var p = new Diagnostico(taskService, id_eval, EvalResulService);
    p.GetDataEva();


    this.EvalResulService.routeDataA().subscribe(data => {
      this.DatosObj = data;
    });

    this.EvalResulService.routeDataB().subscribe(data => {
      this.DataRop = data;
    });

    this.EvalResulService.routeDataC().subscribe(data => {
      this.AgilidadTotal = data;
    });

    console.log(this.DatosObj);
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

  ngOnInit() {
  }

}
