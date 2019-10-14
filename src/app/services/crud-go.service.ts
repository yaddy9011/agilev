import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppGlobals } from '../app.global';
import { Gobjetivo } from '../clases/gobjetivos';

@Injectable({
  providedIn: 'root'
})

export class CrudGoService {
  domain: string
  constructor(private http: HttpClient, public _global: AppGlobals) {
    this.domain = this._global.domain
  }

  getObjetivos() {
    return this.http.get<Gobjetivo[]>(`${this.domain}/api/gobjetivos`)
      .pipe(map(res => res));
  }

  insertObj(inserObj) {
    return this.http.post<Gobjetivo>(`${this.domain}/gobjetivos`, inserObj)
      .pipe(map(res => res));
  }


  deleteObjetivos(id) {
    return this.http.delete<Gobjetivo>(`${this.domain}/api/gobjetivos/${id}`)
      .pipe(map(res => res));
  }

  updateObjetivos(ActObj) {
    return this.http.put<Gobjetivo>(`${this.domain}/api/gobjetivos/${ActObj._id}`, ActObj)
      .pipe(map(res => res));
  }

}
