import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppGlobals } from '../app.global';
import { Rop} from '../clases/rop';

@Injectable({
  providedIn: 'root'
})
export class CrudRopService {
  domain: string
  constructor(private http: HttpClient, public _global: AppGlobals) {
    this.domain = this._global.domain;
  }

  GetRop() {
    return this.http.get<Rop[]>(`${this.domain}/api/GetRop`)
      .pipe(map(res => res));
  }

  InsertRop(NewPractica) {
    return this.http.post<Rop>(`${this.domain}/api/InsertRop`, NewPractica)
      .pipe(map(res => res));
  }

  DeleteRop(id) {
    return this.http.delete<Rop>(`${this.domain}/api/DeleteRop/${id}`)
      .pipe(map(res => res));
  }

  UpdateRop(ActPrac) {
    return this.http.put<Rop>(`${this.domain}/api/UpdateRop/${ActPrac._id}`, ActPrac)
      .pipe(map(res => res));
  }


}
