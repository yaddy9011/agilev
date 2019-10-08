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
  arr: string[];
  list: obj[];



  constructor(private taskService: TasksService) {

    this.idst = localStorage.getItem("ACCESS_IDS");
    this.nameusr = localStorage.getItem("ACCESS_name");
    var ok = localStorage.getItem("ACCESS_IDS");

    this.taskService.getobj(ok)
      .subscribe(obj => {
        this.newarrs = obj;
        this.newarrs.sort((a, b) => a.pos - b.pos);
        //this.objs = this.newarrs;
        var ids = [];
        for (var i = 0; i < this.newarrs.length; i++) {
          const arraData = {
            _id: obj[i]._id,
            objetivo: Object.values(obj[i].id_obj)[1],
            id_usr: obj[i].id_usr,
            id_obj: Object.values(obj[i].id_obj)[0],
            pos: obj[i].pos
          };
          ids.push(arraData);
        }
        this.objs = ids;
        console.log(ids);

      });

  }

  ngOnInit() {

  }

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
      id_obj: obj.id_obj,
      pos: pnew
    };

    this.taskService.updateTask(newTask)
      .subscribe(res => {
        //task.isDone = !task.isDone;
      })
  }

}





// this.taskService.getobj(ok)
// .subscribe(obj => {
//   this.newarrs = obj;
//   this.newarrs.sort((a, b) => a.pos - b.pos);
//   this.objs = this.newarrs;

//   for (var i = 0; i < obj.length; i++) {
//     var hotel = obj[i].id_obj;

//     var arraData = {
//       _id: obj[i]._id,
//       objetivo: obj[i].objetivo,
//       id_usr: obj[i].id_usr,
//       id_obj:Object.values(hotel)[1],
//       pos: obj[i].pos
//     };

//     console.log(Object.values(hotel)[1]);

//   }


// });