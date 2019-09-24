import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Task } from '../clases/Task';
import { obj } from '../clases/obj';

@Injectable({
  providedIn: 'root'
})

export class TasksService {

  domain: string = 'http://localhost:3000';
  // domain: string = 'www.mydomainapi.com/';

  constructor(private http: HttpClient) {
  }

  getTasks() {
    return this.http.get<Task[]>(`${this.domain}/api/tasks`)
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

}
