import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TasksService } from '../services/tasks.service';
import { obj } from '../clases/obj';
import { Practica } from '../clases/practica';
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

  idArr = []
  //nrSelect = 3
  panelOpenState = false;
  userName = '';
 // tasks: Task[];
  newarrs: obj[];
  objs: obj[];
  title: string;
  idst: string;
  nameusr: string;
  arr: string[];
  list: obj[];
  Practicas: Practica[];
  ArrayPracticas: Practica[];
  listPractica: Practica[];

  constructor(private taskService: TasksService) {

    this.idst = localStorage.getItem("ACCESS_IDS");
    this.nameusr = localStorage.getItem("ACCESS_name");
    var ok = localStorage.getItem("ACCESS_IDS");
    this.taskService.getobj(ok)
      .subscribe(obj => {
        this.newarrs = obj;
        this.newarrs.sort((a, b) => a.pos - b.pos);
        //console.log(this.newarrs);
        //this.objs = this.newarrs;
        var ids = [];
        for (var i = 0; i < this.newarrs.length; i++) {
          const arraData = {
            _id: obj[i]._id,
            objetivo: Object.values(obj[i].id_obj)[1],
            id_usr: obj[i].id_usr,
            id_obj: Object.values(obj[i].id_obj)[0],
            pos: obj[i].pos,
            num: Object.values(obj[i].id_obj)[2],
          };
          ids.push(arraData);
        }
        this.objs = ids; 
      });

    this.taskService.getPracticas(ok)
      .subscribe(prac => {
        this.ArrayPracticas = prac;
        this.ArrayPracticas.sort((a, b) => a.pos - b.pos);
        var arrdatanew = [];
        for (var i = 0; i < this.ArrayPracticas.length; i++) {
          const arraData = {
            _id: prac[i]._id,
            textprac: Object.values(prac[i].id_prac)[1],
            id_usr: prac[i].id_usr,
            id_obj: Object.values(prac[i].id_prac)[0],
            pos: prac[i].pos,
            num: Object.values(prac[i].id_prac)[4],
            nivelapli: prac[i].nivelapli
          };
          this.idArr[i] = arraData.nivelapli;
          arrdatanew.push(arraData);
        }
        this.Practicas = arrdatanew;
      });

  }

  ngOnInit() {

  }

  drop(event: CdkDragDrop<number[]>) {

    moveItemInArray(this.objs, event.previousIndex, event.currentIndex);
    // console.log(this.objs);
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

  dropPracticas(event: CdkDragDrop<number[]>) {

    moveItemInArray(this.Practicas, event.previousIndex, event.currentIndex);

    for (var i = 0; i < this.Practicas.length; i++) {

      this.idArr[i] = this.Practicas[i].nivelapli;

      this.updateStatuspracticas(this.Practicas[i], i);
    }

  }


  updateStatuspracticas(pra: Practica, pnew: number) {

    var newActualizacion = {
      _id: pra._id,
      id_usr: pra.id_usr,
      id_obj: pra.id_prac,
      pos: pnew,
      nivelapli: pra.nivelapli
    };

    this.taskService.updatePractica(newActualizacion)
      .subscribe(res => {
      })
  }

  onChange(deviceValue) {

    //console.log(this.idArr);

    for (var i = 0; i < this.Practicas.length; i++) {
      this.Practicas[i].nivelapli = this.idArr[i];
      this.updateStatuspracticas(this.Practicas[i], i);
    }

    //this.idArr[2]=deviceValue;
    //console.log(deviceValue);
  }

}

