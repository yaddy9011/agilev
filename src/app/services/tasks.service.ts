import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Pais } from '../clases/pais';
import { obj } from '../clases/obj';
import { Practica } from '../clases/practica';
import { Sector } from '../clases/Sector';
import { Ambito } from '../clases/Ambito';
import { numero_integrante } from '../clases/num-integrante';
import { Eval } from '../clases/evaluacionbyobj';
import { Rop } from '../clases/rop';
import { WorkLine } from '../clases/workline';
import { AppGlobals } from '../app.global';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class TasksService {

  domain: string
  constructor(private http: HttpClient, public _global: AppGlobals) {
    this.domain = this._global.domain
  }

  // getTasks() {
  //   return this.http.get<obj[]>(`${this.domain}/api/tasks`)
  //     .pipe(map(res => res));
  // }

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

  getWorkLines() {
    return this.http.get<WorkLine[]>(`${this.domain}/api/worklines`)
      .pipe(map(res => res));
  }


  getobj(id) {
    return this.http.get<obj[]>(`${this.domain}/api/tasks/${id}`)
      .pipe(map(res => res));
  }

  getEvalByObj(id) {
    return this.http.get<Eval[]>(`${this.domain}/api/evaluaciones/${id}`)
      .pipe(map(res => res));
  }

  getrop() {
    return this.http.get<Rop[]>(`${this.domain}/api/rop`)
      .pipe(map(res => res));
  }

  // addTask(newTask: Task) {
  //   return this.http.post<Task>(`${this.domain}/api/tasks`, newTask)
  //     .pipe(map(res => res));
  // }

  // deleteTask(id) {
  //   return this.http.delete<Task>(`${this.domain}/api/tasks/${id}`)
  //     .pipe(map(res => res));
  // }

  updateTask(newTask) {
    return this.http.put<obj>(`${this.domain}/api/tasks/${newTask._id}`, newTask)
      .pipe(map(res => res));
  }

  getPracticas(id,ap) {

    var practica="";
    if (ap == true){
      practica="practicasAplicables"
    } else{
      practica="practicas"
    }

    return this.http.get<Practica[]>(`${this.domain}/api/${practica}/${id}`)
      .pipe(map(res => res));

  }

  getPracticasbyEval(ideval) {
    return this.http.get<Practica[]>(`${this.domain}/api/practicasbyeval/${ideval}`)
      .pipe(map(res => res));
  }

  updatePractica(newPractica) {
    return this.http.put<Practica>(`${this.domain}/api/practicas/${newPractica._id}`, newPractica)
      .pipe(map(res => res));
  }

  updateAplicable(newData) {
    return this.http.put<Practica>(`${this.domain}/api/ActAplicable/${newData._id}`, newData)
      .pipe(map(res => res));
  }

  updateNotas(NewDatanota) {
    return this.http.put<Practica>(`${this.domain}/api/actnotas/${NewDatanota._id}`, NewDatanota)
      .pipe(map(res => res));
  }

  updateNoInteresa(newData) {
    return this.http.put<obj>(`${this.domain}/api/ObjetivosNoInteresan/${newData._id}`, newData)
      .pipe(map(res => res));
  }

  updateNotasObj(NewDatanota) {
    return this.http.put<obj>(`${this.domain}/api/ObjetivosNotas/${NewDatanota._id}`, NewDatanota)
      .pipe(map(res => res));
  }




  DeleteEval(ideval) {
    return this.http.delete<Eval>(`${this.domain}/api/DeleteEvals/${ideval}`)
      .pipe(map(res => res));
  }

  GetDataEval(Data): Observable<any> {
    return this.http.get(`${this.domain}/api/DataEval/${Data.id_eval}/${Data.id_usr}`);
  }

}
