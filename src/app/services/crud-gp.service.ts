import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppGlobals } from '../app.global';
import { Gpractica } from '../clases/gpracticas';

@Injectable({
  providedIn: 'root'
})
export class CrudGpService {
  domain: string
  constructor(private http: HttpClient, public _global: AppGlobals) {
    this.domain = this._global.domain;
  }

  GetPracticas() {
    return this.http.get<Gpractica[]>(`${this.domain}/api/GetPracticas`)
      .pipe(map(res => res));
  }

  InsertPractica(NewPractica) {
    return this.http.post<Gpractica>(`${this.domain}/api/InsertPractica`, NewPractica)
      .pipe(map(res => res));
  }

  DeletePractica(id) {
    return this.http.delete<Gpractica>(`${this.domain}/api/DeletePractica/${id}`)
      .pipe(map(res => res));
  }

  UpdatePractica(ActPrac) {
    return this.http.put<Gpractica>(`${this.domain}/api/UpdatePractica/${ActPrac._id}`, ActPrac)
      .pipe(map(res => res));
  }



}
