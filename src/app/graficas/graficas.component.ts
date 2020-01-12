import { Component, OnInit } from '@angular/core';
import { EvalResulService } from '../services/eval-resul.service';
import { TasksService } from '../services/tasks.service';
import { Evaluacion } from '../evaluacion/eval.class';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {

  DatosObj = [];
  arrROP = [];
  AgilidadTotal = 0;

  constructor(private EvalResulService: EvalResulService, private taskService: TasksService, private route: ActivatedRoute) {
   // console.log(this.route.snapshot.paramMap.get('id_eval'));
    var id_eval = this.route.snapshot.paramMap.get('id_eval');
    var p = new Evaluacion(taskService, id_eval, EvalResulService);
    p.getObjetivosByUSR();

    this.EvalResulService.routeDataA().subscribe(data => {
      //data.sort((a, b) => Number(a.total_Eva.substring(0, 1)) - Number(b.total_Eva.substring(0, 1)));
      //this.DatosObj = data;
      for (let elemento of data) {
        const Data = {
          n_obj: elemento.n_obj,
          total_Eva: Number(elemento.total_Eva.substring(0, 2))
        };
        this.DatosObj.push(Data);
      }
      console.log(this.DatosObj);
    });

    this.EvalResulService.routeDataB().subscribe(data => {
      this.arrROP = data;
    });

    this.EvalResulService.routeDataC().subscribe(data => {
      this.AgilidadTotal = data;
    });

  }
  ngOnInit() { }
}
