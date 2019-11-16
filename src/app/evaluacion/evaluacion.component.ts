import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TasksService } from '../services/tasks.service';
@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css']
})

export class EvaluacionComponent implements OnInit {
  idst: string;
  constructor(private authService: AuthService, private taskService: TasksService) {
    this.idst = localStorage.getItem("ACCESS_IDS");
    this.GetEvalByObj()
  }

  ngOnInit() { }

  GenerarEvaluacion() {
    this.authService.GuardarEvaluacion(this.idst).subscribe(res => { console.log(res); });
  }

  GetEvalByObj() {
    this.taskService.getEvalByObj(this.idst)
      .subscribe(evals => {
        console.log(evals);
      });
  }
}

