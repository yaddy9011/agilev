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

  idArr = [];
  panelOpenState = false;
  userName = '';
  newarrs: obj[];
  // objs: Array<obj>;
  objs: obj[];
  title: string;
  idst: string;
  nameusr: string;
  arr: string[];
  list: obj[];
  Practicas: Practica[];
  ArrayPracticas: Practica[];
  listPractica: Practica[];
  checked = false;
  ok = "";

  constructor(private taskService: TasksService) {

    this.idst = localStorage.getItem("ACCESS_IDS");
    this.nameusr = localStorage.getItem("ACCESS_name");
    this.ok = localStorage.getItem("ACCESS_IDS");

    this.taskService.getobj(this.ok)
      .subscribe(obj => {
        this.newarrs = obj;
        this.newarrs.sort((a, b) => a.pos - b.pos);

        var ids = [];
        for (var i = 0; i < this.newarrs.length; i++) {
          const arraData = {
            _id: obj[i]._id,
            objetivo: Object.values(obj[i].id_obj)[1],
            id_usr: obj[i].id_usr,
            id_obj: Object.values(obj[i].id_obj)[0],
            pos: obj[i].pos,
            num: Object.values(obj[i].id_obj)[2],
            NoInteresa: obj[i].NoInteresa,
            notas: obj[i].notas
          };
          ids.push(arraData);
        }
        this.objs = ids;
      });

    //this.onReorder = this.onReorder.bind(this);

    this.getPracticas(this.ok, this.checked);

  }

  getPracticas(ok, ap) {

    this.taskService.getPracticas(ok, ap)
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
            nivelapli: prac[i].nivelapli,
            aplicable: prac[i].aplicable,
            metodologia: Object.values(prac[i].id_prac)[2],
            notas: prac[i].notas
          };
          this.idArr[i] = arraData.nivelapli;
          arrdatanew.push(arraData);
        }
        this.Practicas = arrdatanew;
      });

  }

  ngOnInit() { }

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

    if (this.checked == true) {
      alert("Para priorizar es necesario tener las 42 prácticas,no ocultes las prácticas no aplicables");
    } else {
      moveItemInArray(this.Practicas, event.previousIndex, event.currentIndex);
      for (var i = 0; i < this.Practicas.length; i++) {
        this.idArr[i] = this.Practicas[i].nivelapli;
        this.updateStatuspracticas(this.Practicas[i], i);
      }
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
      });
  }

  onChange(deviceValue) {
    for (var i = 0; i < this.Practicas.length; i++) {
      this.Practicas[i].nivelapli = this.idArr[i];
      this.updateStatuspracticas(this.Practicas[i], i);
    }
  }

  FieldsChange(e) {
    var ActPractica = {
      _id: e.currentTarget.value,
      aplicable: e.currentTarget.checked
    };
    this.taskService.updateAplicable(ActPractica)
      .subscribe(res => {
        this.getPracticas(this.ok, this.checked);
      });
  }

  doSomething(e, id) {
    var actNotas = {
      _id: id,
      notas: e.target.value
    };
    this.taskService.updateNotas(actNotas)
      .subscribe(res => {
      });
  }

  ChangeCheckNoInteresa(e) {
    var actObj = {
      _id: e.currentTarget.value,
      NoInteresa: e.currentTarget.checked
    };
    this.taskService.updateNoInteresa(actObj)
      .subscribe(res => {
      });
  }

  ChangeNotasObj(e, id) {
    var actNotas = {
      _id: id,
      notas: e.target.value
    };

    this.taskService.updateNotasObj(actNotas)
      .subscribe(res => {
      });
  }


  eventAplicables(e) {
    this.getPracticas(this.ok, e.checked);
  }


  // onReorder(e) {

  //   var visibleRows = e.component.getVisibleRows(),
  //     newOrderIndex = visibleRows[e.toIndex].data.rowIndex;

  //   console.log(visibleRows);

  //   console.log(visibleRows[e.toIndex]);
  //   console.log(e);

  //   console.log(e.fromIndex);
  //   console.log(e.toIndex);

  //   moveItemInArray(visibleRows, e.fromIndex, e.toIndex);
  //   console.log(visibleRows);

  //   for (var i = 0; i < visibleRows.length; i++) {

  //     var newTask = {
  //       _id: visibleRows[i].data._id,
  //       objetivo: visibleRows[i].data.objetivo,
  //       id_usr: visibleRows[i].data.id_usr,
  //       id_obj: visibleRows[i].data.id_obj,
  //       pos:i
  //     };

  //     this.taskService.updateTask(newTask)
  //       .subscribe(res => {

  //       });
  //   }

  //   this.taskService.getobj(this.ok)
  //     .subscribe(obj => {
  //       this.newarrs = obj;
  //       this.newarrs.sort((a, b) => a.pos - b.pos);

  //       var ids = [];
  //       for (var i = 0; i < this.newarrs.length; i++) {
  //         const arraData = {
  //           _id: obj[i]._id,
  //           objetivo: Object.values(obj[i].id_obj)[1],
  //           id_usr: obj[i].id_usr,
  //           id_obj: Object.values(obj[i].id_obj)[0],
  //           pos: obj[i].pos,
  //           num: Object.values(obj[i].id_obj)[2],
  //         };
  //         ids.push(arraData);
  //       }
  //       this.objs = ids;
  //     });

  //   e.component.refresh();

  //   //this.tasksStore.update(e.itemData.ID,{ OrderIndex: newOrderIndex }).then(() => {});


  // }

}

