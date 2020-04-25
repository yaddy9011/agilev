import { Component, OnInit, ViewChild } from '@angular/core';
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
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { ViewportScroller } from '@angular/common';
import { DxDataGridComponent } from "devextreme-angular";

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

  // @ViewChild('gridObj', { static: false }) public GridObj: GridComponent;
  @ViewChild('clientGrid', { static: false }) clientGrid: DxDataGridComponent;
  @ViewChild('GridPrac', { static: false }) GridPrac: DxDataGridComponent;


  idArr = [];
  idPracDesa = [];
  ShowROP = [];
  toggle = [];
  ArrNC = [];
  ArrPP = [];
  ArrWND = [];
  panelOpenState = true;
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
  checkANA = false;
  checkedPriorizar = false;
  DisablePriorizacion = false;
  checkedObjetivosNI = false;
  id_usr = "";
  showDragIcons: boolean;
  DataRop = [];
  DatasourseRop = [];
  popupVisible = false;
  selectOptions: Object;
  isNCVisible: boolean = false;
  _nobj;

  constructor(

    private taskService: TasksService,
    private CrudRopService: CrudRopService,
    private viewportScroller: ViewportScroller,
    private EvalResulService: EvalResulService) {

    this.nameusr = localStorage.getItem("ACCESS_name");
    this.id_usr = localStorage.getItem("ACCESS_IDS");
    this.GetDiagnosticLive();
    this.getPracticas(this.id_usr, this.checked);
    this.showDragIcons = true;
    this.onReorderObj = this.onReorderObj.bind(this);
    this.onReorderPrac = this.onReorderPrac.bind(this);
  }

  getObjetivos(id_usr, diagnosticObjs) {
    var NewShowROP = [];
    var ShopRop = [];
    NewShowROP = this.ShowROP;
    this.taskService.getobj(id_usr)
      .subscribe(obj => {
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
          if (NewShowROP.length > 0) {
            ShopRop[index] = NewShowROP[index];
          } else {
            ShopRop[index] = false;
          }
          return arraData;
        });
        this.ShowROP = ShopRop;
        // para ordenamiento de objetivos 
        var map2 = objss.filter(function (task) {
          return task.NoInteresa == true;
        });
        if (map2.length >= 1) {
          var map1 = objss.filter(function (task) {
            return task.NoInteresa == false;
          });
          map1.sort((a, b) => a.pos - b.pos);
          const array3 = map1.concat(map2);
          this.objs = array3;
        } else {
          this.objs = objss;
          this.objs.sort((a, b) => a.pos - b.pos);
        }
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

          var tg = this.toggle.filter(function (task) {
            return task == true;
          });

          if (tg.length > 0) {
            this.ArrNC[i] = this.ArrNC[i];
            this.toggle[i] = this.toggle[i];
          } else {
            this.toggle[i] = false;
            this.ArrNC[i] = 0;
          }

          this.ArrPP[i] = arraData.n_prac;
          arrdatanew.push(arraData);

        }

        this.Practicas = arrdatanew;

        this.orderNA();
        this.OrderAplicables();
        this.OrdenamientoPracticas(this.Practicas);

        // var NOaplicables = arrdatanew.filter(function (task) {
        //   return task.aplicable == true;
        // });
        // if (NOaplicables.length >= 1) {
        //   var Aplicables = arrdatanew.filter(function (task) {
        //     return task.aplicable == false;
        //   });
        //   Aplicables.sort((a, b) => a.pos - b.pos);
        //   var NiveApliMuyAlto = Aplicables.filter(function (task) {
        //     return task.nivelapli == 5;
        //   });
        //   var NiveApliNOMuyAltos = Aplicables.filter(function (task) {
        //     return task.nivelapli < 5;
        //   });
        //   if (NiveApliMuyAlto.length >= 1) {
        //     const array3 = NiveApliNOMuyAltos.concat(NiveApliMuyAlto);
        //     const array4 = array3.concat(NOaplicables);
        //     this.Practicas = array4;
        //   } else {
        //     const array3 = Aplicables.concat(NOaplicables);
        //     this.Practicas = array3;
        //   }
        // } else {
        //   var NiveApliMuyAlto = arrdatanew.filter(function (task) {
        //     return task.nivelapli == 5;
        //   });
        //   var NiveApliNOMuyAltos = arrdatanew.filter(function (task) {
        //     return task.nivelapli < 5;
        //   });
        //   if (NiveApliMuyAlto.length >= 1) {
        //     NiveApliNOMuyAltos.sort((a, b) => a.pos - b.pos);
        //     const arrarNAfinal = NiveApliNOMuyAltos.concat(NiveApliMuyAlto);
        //     this.Practicas = arrarNAfinal;
        //   } else {
        //     this.Practicas = arrdatanew;
        //     this.Practicas.sort((a, b) => a.pos - b.pos);
        //   }
        // }

        var arwnd = [];
        var nass = this.Practicas.map(function (num, k) {
          if (num.nivelapli == 0) {
            arwnd[k] = true;
          } else {
            arwnd[k] = false;
          }
          return num.nivelapli;
        });
        this.idArr = nass;
        this.ArrWND = arwnd;
        console.log(this.Practicas.length)
        //console.log(this.ArrWND);
      });
  }


  OrdenamientoPracticas(ArrPrac) {
    var NOaplicables = ArrPrac.filter(function (task) {
      return task.aplicable == true;
    });
    if (NOaplicables.length >= 1) {
      var Aplicables = ArrPrac.filter(function (task) {
        return task.aplicable == false;
      });
      Aplicables.sort((a, b) => a.pos - b.pos);
      var NiveApliMuyAlto = Aplicables.filter(function (task) {
        return task.nivelapli == 5;
      });
      var NiveApliNOMuyAltos = Aplicables.filter(function (task) {
        return task.nivelapli < 5;
      });
      if (NiveApliMuyAlto.length >= 1) {
        const array3 = NiveApliNOMuyAltos.concat(NiveApliMuyAlto);
        const array4 = array3.concat(NOaplicables);
        this.Practicas = array4;
      } else {
        const array3 = Aplicables.concat(NOaplicables);
        this.Practicas = array3;
      }
    } else {
      var NiveApliMuyAlto = ArrPrac.filter(function (task) {
        return task.nivelapli == 5;
      });
      var NiveApliNOMuyAltos = ArrPrac.filter(function (task) {
        return task.nivelapli < 5;
      });
      if (NiveApliMuyAlto.length >= 1) {
        NiveApliNOMuyAltos.sort((a, b) => a.pos - b.pos);
        const arrarNAfinal = NiveApliNOMuyAltos.concat(NiveApliMuyAlto);
        this.Practicas = arrarNAfinal;
      } else {
        this.Practicas = ArrPrac;
        this.Practicas.sort((a, b) => a.pos - b.pos);
      }
    }
  }


  GetDiagnosticLive() {
    var p = new Diagnostico(this.taskService, "5e52bc768e4e3736a866f5e7", this.EvalResulService);
    p.GetDataEva(true);
    this.EvalResulService.routeDataA().subscribe(data => {
      let newDiag = data.sort((a, b) => a.n_obj - b.n_obj);
      this.getObjetivos(this.id_usr, newDiag);
    });

    this.EvalResulService.routeDataB().subscribe(data => {
      this.DataRop = data;
    });

  }

  ngOnInit() {

    this.selectOptions = { type: 'Multiple' };

  }

  updateStatusObj(obj: obj, pnew: number) {

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

  onChangeNA(deviceValue, desaf) {
    for (var i = 0; i < this.Practicas.length; i++) {
      // console.log(this.Practicas[i].n_prac + " na : " + this.idArr[i]);
      this.Practicas[i].nivelapli = this.idArr[i];

      if (this.idArr[i] == 0) {
        this.ArrWND[i] = true;
      } else {
        this.ArrWND[i] = false;
      }
      //this.Practicas[i].desafio = this.idPracDesa[i];
      this.updateStatuspracticas(this.Practicas[i], i);
    }

    this.GetDiagnosticLive();


    // if (desaf == false) {
    //   this.GetDiagnosticLive();
    // }

    if (deviceValue == 5) {
      this.getPracticas(this.id_usr, this.checked);
    }



  }

  onChangeAplicable(e) {
    var ActPractica = {
      _id: e.currentTarget.value,
      aplicable: e.currentTarget.checked
    };
    this.taskService.updateAplicable(ActPractica)
      .subscribe(res => {
        this.getPracticas(this.id_usr, this.checked);
      });
  }

  onChangeNotasPracticas(e, id) {
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
        this.GetDiagnosticLive();
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

  EventshowROP(e, i, no) {
    this._nobj = no;
    this.viewportScroller.scrollToAnchor("SlideTo");
    var sr = this.ShowROP.filter(function (task) {
      return task == true;
    });
    if (sr.length >= 1) {
      if (this.ShowROP[i] == false) {
        var x = this.ShowROP.map(function (num) {
          return num = false;
        });
        this.ShowROP = x;
      } else {

        this.ShowROP[i] = !this.ShowROP[i];
      }
    } else {
      this.ShowROP[i] = !this.ShowROP[i];
    }

    //this.ShowROP[i] = !this.ShowROP[i];

    if (this.ShowROP[i] == true) {
      this.isNCVisible = true;

      this.RelacionOP(no);

      // this.CrudRopService.GetRop()
      //   .subscribe(rop => {
      //     var arrdatanew = [];
      //     var arrPPnew = [];
      //     var ncarr = [];
      //     arrdatanew = this.toggle;
      //     arrPPnew = this.ArrPP;
      //     rop.forEach(function (value) {
      //       if (value.n_obj == no) {
      //         let toIndex = value.n_prac.valueOf();
      //         // console.log(toIndex);
      //         // console.log(value.n_prac);
      //         const b = arrPPnew.findIndex((item) => item === toIndex);
      //         arrdatanew[b] = true;
      //         ncarr[b] = value.nivel_contribucion;
      //       }
      //     });

      //     for (let j in this.ArrNC) {
      //       let nc_title = "";
      //       switch (ncarr[j]) {
      //         case 0:
      //           nc_title = "Muy Bajo";
      //           break;
      //         case 0.25:
      //           nc_title = "Bajo";
      //           break;
      //         case 0.50:
      //           nc_title = "Medio";
      //           break;
      //         case 0.75:
      //           nc_title = "Alto";
      //           break;
      //         case 1:
      //           nc_title = "Muy Alto";
      //           break;
      //       }
      //       this.ArrNC[j] = nc_title;
      //     }

      //     this.toggle = arrdatanew;
      //     //this.Grid.refresh();
      //     // this.GridPrac.onRowPrepared;
      //     this.GridPrac.instance.refresh();
      //   });


    } else {
      this.isNCVisible = false;
      var dobles = this.toggle.map(function (num) {
        return num = false;
      });
      this.toggle = dobles;
      this.GridPrac.instance.refresh();
      this.viewportScroller.scrollToAnchor("objPanel");
    }
  }

  RelacionOP(no) {
    this.CrudRopService.GetRop()
      .subscribe(rop => {
        var arrdatanew = [];
        var arrPPnew = [];
        var ncarr = [];

        var dobles = this.toggle.map(function (num) {
          return num = false;
        });
        this.toggle = dobles;

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
        this.GridPrac.instance.refresh();
      });
  }

  onReorderObj(e) {

    var visibleRows = e.component.getVisibleRows(),
      toIndex = this.objs.indexOf(visibleRows[e.toIndex].data),
      fromIndex = this.objs.indexOf(e.itemData);
    this.objs.splice(fromIndex, 1);
    this.objs.splice(toIndex, 0, e.itemData);

    for (var i = 0; i < this.objs.length; i++) {
      this.updateStatusObj(this.objs[i], i);
    }


    this.GetDiagnosticLive();
    //this.clientGrid.instance.refresh();


    //   var objss = this.objs.map(function (task, index, array) {
    //     return task.pos;
    //   });
    //  console.log(objss);


  }

  onReorderPrac(e) {
    var visibleRows = e.component.getVisibleRows(),
      toIndex = this.Practicas.indexOf(visibleRows[e.toIndex].data),
      fromIndex = this.Practicas.indexOf(e.itemData);
    this.Practicas.splice(fromIndex, 1);
    this.Practicas.splice(toIndex, 0, e.itemData);
    this.idArr.splice(fromIndex, 1);
    this.idArr.splice(toIndex, 0, e.itemData.nivelapli);
    for (var i = 0; i < this.Practicas.length; i++) {
      this.updateStatuspracticas(this.Practicas[i], i);
    }

    // this.OrdenamientoPracticas(this.Practicas);

    this.getPracticas(this.id_usr, false);

    var sr = this.ShowROP.filter(function (task) {
      return task == true;
    });
    if (sr.length > 0) {
      this.RelacionOP(this._nobj);
    }
    // var nass = this.Practicas.map(function (num) {
    //   return num.nivelapli;
    // });
    // this.idArr = nass;
    // this.GridPrac.instance.refresh();
  }

  DetalleObjetivo(e, n) {
    this.popupVisible = true;
    console.log(n);
    console.log(this.objs[n].n_obj);
    let n_ob = this.objs[n].n_obj;
    var arrPPnew = [];
    this.DataRop.forEach(function (value) {
      if (value.n_obj == n_ob) {
        arrPPnew.push(value);
      }
    });
    this.DatasourseRop = arrPPnew;
  }

  OcultarObjNI(e) {
    var arrObj = [];
    arrObj = this.objs
    if (this.checkedObjetivosNI == true) {
      var arrFilter = arrObj.filter((task) => task.NoInteresa == false);
      this.objs = arrFilter;
    } else {
      this.GetDiagnosticLive()
    }
  }

  eventAltoNA(e) {
    this.getPracticas(this.id_usr, false);
  }

  orderNA() {
    var arrPrac = [];
    arrPrac = this.Practicas;
    if (this.checkANA == true) {
      var arrFilter;
      arrFilter = arrPrac.filter((task) => task.nivelapli < 5);
      this.Practicas = arrFilter;
    } else {
      this.Practicas = arrPrac
    }
  }

  OrderAplicables() {
    var arrPrac = [];
    arrPrac = this.Practicas;
    if (this.checked == true) {
      var aplicables = arrPrac.filter(function (task) {
        return task.aplicable == false;
      });
      this.Practicas = aplicables;
    } else {
      this.Practicas = arrPrac;
    }
  }

  eventAplicables(e) {
    this.getPracticas(this.id_usr, false);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  onRowPrepared(e) {
    if (e.data) {
      const x = this.ArrPP.findIndex((item) => item === e.data.n_prac);
      if (this.toggle[x] == true) {
        e.rowElement.style.backgroundColor = "#81F79F";
      }
    }
  }


}

