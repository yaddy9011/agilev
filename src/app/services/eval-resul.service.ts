import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvalResulService {

  private subjecta = new Subject<any>();
  private subjectb = new Subject<any>();
  private subjectc = new Subject<any>();
  private subjectob = new Subject<any>();

  constructor() { }

  DataEvalObjetivos(data) {
    this.subjecta.next(data);
  }

  DataEvalPracticas(data) {
    this.subjectb.next(data);
  }

  DataAgilidad(data) {
    this.subjectc.next(data);
  }

  DatasetObjetivos(data) {
    this.subjectob.next(data);
  }

  routeDataA(): Observable<any> {
    return this.subjecta.asObservable();
  }

  routeDataB(): Observable<any> {
    return this.subjectb.asObservable();
  }

  routeDataC(): Observable<any> {
    return this.subjectc.asObservable();
  }

  routeDataOB(): Observable<any> {
    return this.subjectob.asObservable();
  }





}
