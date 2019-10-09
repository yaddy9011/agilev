import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Task } from '../clases/Task';
import { Pais } from '../clases/pais';
import { obj } from '../clases/obj';
import { Practica } from '../clases/practica';
import { Sector } from '../clases/Sector';
import { Ambito } from '../clases/Ambito';
import { numero_integrante } from '../clases/num-integrante';

@Injectable({
  providedIn: 'root'
})

export class TasksService {

  domain: string = 'http://localhost:3000';
  //domain: string = 'https://agile-backend.herokuapp.com';

  constructor(private http: HttpClient) {
  }

  getTasks() {
    return this.http.get<Task[]>(`${this.domain}/api/tasks`)
      .pipe(map(res => res));
  }

  getPaises() {
    return this.http.get<Pais[]>(`${this.domain}/api/paises`)
      .pipe(map(res => res));
  }


  getSector() {
    return this.http.get<Sector[]>(`${this.domain}/api/sectores`)
      .pipe(map(res => res));
  }


  getAmbito() {
    return this.http.get<Ambito[]>(`${this.domain}/api/ambitos`)
      .pipe(map(res => res));
  }


  getNumIntegrantes() {
    return this.http.get<numero_integrante[]>(`${this.domain}/api/numerointegrantes`)
      .pipe(map(res => res));
  }


  getobj(id) {
    return this.http.get<obj[]>(`${this.domain}/api/tasks/${id}`)
      .pipe(map(res => res));
  }

  addTask(newTask: Task) {
    return this.http.post<Task>(`${this.domain}/api/tasks`, newTask)
      .pipe(map(res => res));
  }

  deleteTask(id) {
    return this.http.delete<Task>(`${this.domain}/api/tasks/${id}`)
      .pipe(map(res => res));
  }

  updateTask(newTask) {
    return this.http.put<Task>(`${this.domain}/api/tasks/${newTask._id}`, newTask)
      .pipe(map(res => res));
  }

  getPracticas(id) {
    return this.http.get<Practica[]>(`${this.domain}/api/practicas/${id}`)
      .pipe(map(res => res));
  }

  updatePractica(newPractica) {
    return this.http.put<Practica>(`${this.domain}/api/practicas/${newPractica._id}`, newPractica)
      .pipe(map(res => res));
  }

}
