import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TasksService } from '../services/tasks.service';
import { obj } from '../clases/obj';
import { Practica } from '../clases/practica';
import { UserI } from '../clases/user';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CrudRopService } from '../services/crud-rop.service';
import { EvalResulService } from '../services/eval-resul.service';
import { Diagnostico } from '../clases/diagnotico';
import { RowDDService, SelectionService } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [RowDDService,
    SelectionService],
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
  idPracDesa = [];
  ShowROP = [];
  toggle = [];
  ArrNC = [];
  ArrPP = [];
  panelOpenState = false;
  panelOpenStateObj = true;
  userName = '';
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
  checkedPriorizar = false;
  DisablePriorizacion = false;
  
  checkedObjetivosNI = false;
  id_usr = "";
  showNC: boolean = false;

  public selectOptions: Object;

  constructor(

    private taskService: TasksService,
    private CrudRopService: CrudRopService,
    private EvalResulService: EvalResulService) {

    this.nameusr = localStorage.getItem("ACCESS_name");
    this.id_usr = localStorage.getItem("ACCESS_IDS");
    this.GetDiagnosticLive();
    this.getPracticas(this.id_usr, this.checked);

  }

  getObjetivos(id_usr, diagnosticObjs) {
    this.taskService.getobj(id_usr)
      .subscribe(obj => {
        var NewShowROP = [];
        var objss = obj.map(function (task, index, array) {
          const fd = diagnosticObjs.find((item) => item.n_obj === obj[index].n_obj);
          let pd = 0;
          if (fd) {
            pd = fd.pd;
          }
          const arraData = {
            _id: obj[index]._id,
            objetivo: Object.values(obj[index].id_obj)[1],
            id_usr: obj[index].id_usr,
            id_obj: Object.values(obj[index].id_obj)[0],
            pos: obj[index].pos,
            num: Object.values(obj[index].id_obj)[2],
            NoInteresa: obj[index].NoInteresa,
            notas: obj[index].notas,
            n_obj: obj[index].n_obj,
            pd: pd + "%"
          };
          NewShowROP[index] = false;
          return arraData;
        });
        this.ShowROP = NewShowROP;
        this.objs = objss;
        this.objs.sort((a, b) => a.pos - b.pos);
        console.log(this.objs);
      });

  }

  getPracticas(id_usr, ap) {

    this.taskService.getPracticas(id_usr, ap)
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
            notas: prac[i].notas,
            n_prac: prac[i].n_prac,
            desafio: prac[i].desafio
          };

          this.idArr[i] = arraData.nivelapli;
          this.idPracDesa[i] = arraData.desafio;
          this.toggle[i] = false;
          this.ArrNC[i] = 0;
          this.ArrPP[i] = arraData.n_prac;
          arrdatanew.push(arraData);
        }
        this.Practicas = arrdatanew;
      });

  }

  GetDiagnosticLive() {
    var p = new Diagnostico(this.taskService, "5e52bc768e4e3736a866f5e7", this.EvalResulService);
    p.GetDataEva(true);
    this.EvalResulService.routeDataA().subscribe(data => {
      let newDiag = data.sort((a, b) => a.n_obj - b.n_obj);
      this.getObjetivos(this.id_usr, newDiag);
    });
  }

  ngOnInit() {

    this.selectOptions = { type: 'Multiple' };

  }

  drop(event: CdkDragDrop<number[]>) {

    moveItemInArray(this.objs, event.previousIndex, event.currentIndex);
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
      })
  }

  dropPracticas(event: CdkDragDrop<number[]>) {

    if (this.toggle[event.previousIndex] == true) {
      this.toggle[event.previousIndex] = false;
      this.toggle[event.currentIndex] = true;
    }

    if (this.checked == true) {
      alert("Para priorizar es necesario tener las 42 prácticas,no ocultes las prácticas no aplicables");
    } else {
      moveItemInArray(this.Practicas, event.previousIndex, event.currentIndex);
      for (var i = 0; i < this.Practicas.length; i++) {
        this.idArr[i] = this.Practicas[i].nivelapli;
        this.ArrPP[i] = this.Practicas[i].n_prac;
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
      nivelapli: pra.nivelapli,
      desafio: pra.desafio
    };

    this.taskService.updatePractica(newActualizacion)
      .subscribe(res => {
      });
  }

  onChange(deviceValue, desaf) {

    for (var i = 0; i < this.Practicas.length; i++) {
      this.Practicas[i].nivelapli = this.idArr[i];
      this.Practicas[i].desafio = this.idPracDesa[i];
      this.updateStatuspracticas(this.Practicas[i], i);
    }

    if (desaf == false) {
      this.GetDiagnosticLive();
    }

  }

  FieldsChange(e) {
    var ActPractica = {
      _id: e.currentTarget.value,
      aplicable: e.currentTarget.checked
    };
    this.taskService.updateAplicable(ActPractica)
      .subscribe(res => {
        this.getPracticas(this.id_usr, this.checked);
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

  ChangeCheckBloquePriorizacion(e) {
    this.DisablePriorizacion = !this.DisablePriorizacion;
  }

  eventAplicables(e) {
    this.getPracticas(this.id_usr, e.checked);
  }

  EventshowROP(e, i, no) {

    console.log(i);
    console.log(this.ShowROP);

    this.ShowROP[i] = !this.ShowROP[i];
    if (this.ShowROP[i] == true) {

      this.panelOpenState = !this.panelOpenState;
      this.panelOpenStateObj = true;
      this.showNC = !this.showNC;

      this.CrudRopService.GetRop()
        .subscribe(rop => {
          var arrdatanew = [];
          var arrPPnew = [];
          var ncarr = [];

          arrdatanew = this.toggle;
          arrPPnew = this.ArrPP;

          rop.forEach(function (value) {
            if (value.n_obj == no) {
              let toIndex = value.n_prac.valueOf();
              const b = arrPPnew.findIndex((item) => item === toIndex);
              arrdatanew[b] = true;
              ncarr[b] = value.nivel_contribucion;
            }
          });

          for (let j in this.ArrNC) {
            let nc_title = "";
            switch (ncarr[j]) {
              case 0:
                nc_title = "Muy Bajo";
                break;
              case 0.25:
                nc_title = "Bajo";
                break;
              case 0.50:
                nc_title = "Medio";
                break;
              case 0.75:
                nc_title = "Alto";
                break;
              case 1:
                nc_title = "Muy Alto";
                break;
            }

            this.ArrNC[j] = nc_title;
          }
          this.toggle = arrdatanew;
        });

    } else {
      this.panelOpenState = false;
      this.panelOpenStateObj = true;
      this.showNC = false;
      var dobles = this.toggle.map(function (num) {
        return num = false;
      });
      this.toggle = dobles;
    }

  }

  rowDragObj(e) {
    // console.log(e);
  }
  rowDropObj(e) {
    moveItemInArray(this.objs, e.fromIndex, e.dropIndex);
    for (var i = 0; i < this.objs.length; i++) {
      this.updateStatus(this.objs[i], i);
    }
    this.GetDiagnosticLive();
  }

}

