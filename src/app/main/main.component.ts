import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TasksService } from '../services/tasks.service';
import { Task } from '../clases/Task';
import { obj } from '../clases/obj';
import { UserI } from '../clases/user';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class MainComponent implements OnInit {

  panelOpenState = false;
  userName = '';
  tasks: Task[];
  newarrs: obj[];
  objs: obj[];
  title: string;
  idst: string;
  nameusr: string;


  constructor(private taskService: TasksService) {

    this.idst = localStorage.getItem("ACCESS_IDS");
    this.nameusr = localStorage.getItem("ACCESS_name");
    var ok = localStorage.getItem("ACCESS_IDS");
    
    this.taskService.getobj(ok)
      .subscribe(obj => {
        this.newarrs = obj;
        this.newarrs.sort((a, b) => a.pos - b.pos);
        this.objs = this.newarrs;
        console.log(obj);

        //var array = [];
        // for (var i=0; i < this.newarrs.length; i++) {
        //   console.log(i);
        //   console.log(this.newarrs[i].pos);
        //   if (i==this.newarrs[i].pos) {
        //     array[i] = this.newarrs[i];
        //   }
        // }

        //this.tasks = array;
        //console.log(array);

      });

  }

  ngOnInit() {

  }

  // registeredUser() {
  //   //console.log(this.userName);
  //   var num2 = ((document.getElementById("num1") as HTMLInputElement).value);
  //   console.log(num2);
  //   for (let n of this.tasks) {
  //     console.log(n.title);
  //   }
  // }

  drop(event: CdkDragDrop<number[]>) {

    moveItemInArray(this.objs, event.previousIndex, event.currentIndex);
    console.log(this.objs);

    for (var i = 0; i < this.objs.length; i++) {

      
      this.updateStatus(this.objs[i], i);
    }


    // let a: Number = event.previousIndex;
    // let b: Number = event.currentIndex;
    //console.log(this.tasks[event.currentIndex]);
    // console.log(this.tasks[event.previousIndex]);
    // this.updateStatus(this.tasks[event.currentIndex], event.currentIndex);
    // this.updateStatus(this.tasks[event.previousIndex], event.previousIndex);

  }

  updateStatus(obj: obj, pnew: number) {

    var newTask = {
      _id: obj._id,
      objetivo: obj.objetivo,
      id_usr: obj.id_usr,
      pos: pnew
    };
    this.taskService.updateTask(newTask)
      .subscribe(res => {
        //task.isDone = !task.isDone;
      })
  }

}


