import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { TasksService } from '../services/tasks.service';
import { Task } from '../clases/Task';
import { UserI } from '../clases/user';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})



export class MainComponent implements OnInit {

  userName = '';
  tasks: Task[];
  title: string;
  idst: string;
  nameusr: string;

  constructor(private taskService: TasksService) {


    this.taskService.getTasks()
    .subscribe(tasks => {

      console.log(tasks);
      this.idst= localStorage.getItem("ACCESS_IDS");
      this.nameusr= localStorage.getItem("ACCESS_name");
      this.tasks = tasks;

    
      for (let n of tasks){
        
        console.log(n._id);
      }
    
    
    });

   }

  ngOnInit() {

  }

  registeredUser(){
 
       //console.log(this.userName);
       var   num2= ((document.getElementById("num1") as HTMLInputElement).value);
       console.log(num2);

       for (let n of this.tasks){
        console.log(n.title);
      }
    
    
   }

}


