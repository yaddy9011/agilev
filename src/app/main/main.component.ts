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
  popupPracticaDescription = false;

  ArrRPO = [];
  visiblegridop = false;
  visibledescriptionprac = false;

  DataRdp = [];
  visiblegriddp = false;
  ArrShowRpp = [];

  ArrRPP = [];

  constructor(

    public taskService: TasksService,
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

          arrdatanew.push(arraData);

        }

        this.Practicas = arrdatanew;



        //para saber si una practica esta marcada para mostrar relación
        var srpp = this.ArrShowRpp.filter(function (task) {
          return task == true;
        });



        //para saber tener una el n_prac_previo indicado o marcado por el usr antes de actualizar

        var n_prac_previo = 0;
        if (srpp.length > 0) {
          const v = this.ArrShowRpp.findIndex((item) => item === true);
          n_prac_previo = this.Practicas[v].n_prac;
          console.log(n_prac_previo);
        }






        // para ordenamiento

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
        var asrpp = [];
        var arpp = [];

        var arppNew = [];
        arppNew = this.ArrRPP;
        var asrppNew = [];
        asrppNew = this.ArrShowRpp;

        var nass = this.Practicas.map(function (num, k) {

          if (srpp.length > 0) {
            asrpp[k] = asrppNew[k];
          } else {
            asrpp[k] = false;
          }

          arpp[k] = false;

          if (num.nivelapli == 0) {
            arwnd[k] = true;
          } else {
            arwnd[k] = false;
          }
          return num.nivelapli;
        });

        this.idArr = nass;
        this.ArrWND = arwnd;
        this.ArrShowRpp = asrpp;
        this.ArrRPP = arpp;

        if (srpp.length > 0) {
          this.rpp(n_prac_previo);
        }


        var sr = this.ShowROP.filter(function (task) {
          return task == true;
        });

        if (sr.length > 0) {
          this.RelacionOP(this._nobj);
        }

        console.log(this.Practicas.length)
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
      });
  }

  // updateStatuspracticas(pra: Practica, pnew: number, vna, dv) {


  //   var newActualizacion = {
  //     _id: pra._id,
  //     id_usr: pra.id_usr,
  //     id_obj: pra.id_prac,
  //     pos: pnew,
  //     nivelapli: pra.nivelapli,
  //     desafio: pra.desafio
  //   };



  //   this.taskService.updatePractica(newActualizacion)
  //     .subscribe(res => {
  //       //console.log(res);
  //       //this.GridPrac.instance.refresh();
  //       // if (vna == 1) {
  //       //   this.GetDiagnosticLive();
  //       // }
  //       // if (dv == 5) {
  //       //   this.getPracticas(this.id_usr, this.checked);
  //       // }
  //     });



  //   // this.taskService.updatePractica(newActualizacion)
  //   //   .subscribe(
  //   //     data => {
  //   //         console.log(data)
  //   //     },
  //   //     err => {
  //   //         console.log(err)
  //   //     },
  //   //     () => {
  //   //         console.log("Complete function triggered.")
  //   //     }
  //   //   );

  // }

  onChangeNA(deviceValue, desaf, _id, e, o) {

    var ActPractica = {
      _id: _id,
      na: deviceValue
    };

    this.taskService.updateNA(ActPractica)
      .subscribe(res => {
        console.log(res);
        var sr = this.ShowROP.filter(function (task) {
          return task == true;
        });
        if (sr.length > 0) {
          this.RelacionOP(this._nobj);
        }
        let toIndex = _id;
        const b = this.Practicas.findIndex((item) => item._id === toIndex);
        if (deviceValue == 0) {
          this.ArrWND[b] = true;
        } else {
          this.ArrWND[b] = false;
        }

        if (deviceValue >= 5 || this.Practicas[o].nivelapli >= 5) {
          this.getPracticas(this.id_usr, this.checked);
        }
        this.GetDiagnosticLive();
      });
  }

  onChangeAplicable(e) {
    var ActPractica = {
      _id: e.currentTarget.value,
      aplicable: e.currentTarget.checked
    };
    this.taskService.updateAplicable(ActPractica)
      .subscribe(res => {
        this.getPracticas(this.id_usr, this.checked);
        var sr = this.ShowROP.filter(function (task) {
          return task == true;
        });
        if (sr.length > 0) {
          this.RelacionOP(this._nobj);
        }
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
    this.ShowROP[i] = !this.ShowROP[i];
    if (this.ShowROP[i] == true) {
      var r_srow_new = this.ShowROP.map(function (p, j) { return p = false; });
      this.ShowROP = r_srow_new;
      this.ShowROP[i] = true;
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
        arrPPnew = this.Practicas;
        rop.forEach(function (value) {
          if (value.n_obj == no) {
            let toIndex = value.n_prac.valueOf();
            const b = arrPPnew.findIndex((item) => item.n_prac === toIndex);
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

    var n_prac_previo = 0;
    var srpp = this.ArrShowRpp.filter(function (task) {
      return task == true;
    });
    if (srpp.length > 0) {
      const v = this.ArrShowRpp.findIndex((item) => item === true);
      n_prac_previo = this.Practicas[v].n_prac;
      console.log(n_prac_previo);
    }
    if (srpp.length > 0) {
      this.rpp(n_prac_previo);
      console.log("entreeee");
    }



    var visibleRows = e.component.getVisibleRows(),
      toIndex = this.Practicas.indexOf(visibleRows[e.toIndex].data),
      fromIndex = this.Practicas.indexOf(e.itemData);
    this.Practicas.splice(fromIndex, 1);
    this.Practicas.splice(toIndex, 0, e.itemData);
    this.idArr.splice(fromIndex, 1);
    this.idArr.splice(toIndex, 0, e.itemData.nivelapli);
    var newp = [];
    for (var i = 0; i < this.Practicas.length; i++) {
      var newActualizacion = {
        _id: this.Practicas[i]._id,
        id_usr: this.Practicas[i].id_usr,
        id_obj: this.Practicas[i].id_prac,
        pos: i,
        nivelapli: this.Practicas[i].nivelapli,
        desafio: this.Practicas[i].desafio
      };
      newp[i] = newActualizacion
    }

    var sr = this.ShowROP.filter(function (task) {
      return task == true;
    });

    if (sr.length > 0) {
      this.RelacionOP(this._nobj);
    }


    var arwnd = [];
    var nass = newp.map(function (num, k) {
      if (num.nivelapli == 0) {
        arwnd[k] = true;
      } else {
        arwnd[k] = false;
      }
      return num.nivelapli;
    });

    this.idArr = nass;
    this.ArrWND = arwnd;


    this.taskService.updatePracticanew(newp, "ok")
      .subscribe(res => {
        console.log("ok termine");
      });


    // for (var i = 0; i < this.Practicas.length; i++) {
    //   this.updateStatuspracticas(this.Practicas[i], i, 0, 0);
    // }

    // async function printFiles(prax, t) {

    //   for await (const p of prax) {

    //     var newActualizacion = {
    //       _id: p._id,
    //       id_usr: p.id_usr,
    //       id_obj: p.id_prac,
    //       pos: p.pos,
    //       nivelapli: p.nivelapli,
    //       desafio: p.desafio
    //     };


    //      t.updatePractica(newActualizacion)
    //       .subscribe(res => {
    //         console.log(res);
    //       });


    //   }
    // }

    // printFiles(this.Practicas, this.taskService);

    // for (const p of this.Practicas) {

    //   var newActualizacion = {
    //     _id: p._id,
    //     id_usr: p.id_usr,
    //     id_obj: p.id_prac,
    //     pos: p.pos,
    //     nivelapli: p.nivelapli,
    //     desafio: p.desafio
    //   };

    //   this.taskService.updatePractica(newActualizacion)
    //     .subscribe(res => { 
    //       console.log(res);
    //     });
    // }





    // const forLoop = async _ => {
    //   console.log('Start')
    //   for (let index = 0; index < this.Practicas.length; index++) {
    //     const numFruit = await this.updateStatuspracticas(this.Practicas[index], index);
    //     console.log(numFruit)
    //   }
    //   console.log('End')
    // }

    // forLoop(0)

    // this.Practicas.forEach(async p => {
    //   const response = await this.updateStatuspracticas(p, p.pos);
    //   console.log(response);
    // });





    // this.getPracticas(this.id_usr, false);



    // var async = require('async');
    // async.eachSeries(this.Practicas, function (rec, callback) {
    //   console.log(rec);
    //   callback(this.updateStatuspracticas(rec,rec.pos));
    //   console.log("ok");
    // }, function (err) {
    //   console.log("funciono");
    // });





    // if (this.onRop(e) == true) {

    //   this.getPracticas(this.id_usr, false);

    //   console.log("ok termine");

    //   var sr = this.ShowROP.filter(function (task) {
    //     return task == true;
    //   });
    //   if (sr.length > 0) {
    //     this.RelacionOP(this._nobj);
    //   }
    // }
  }

  DetalleObjetivo(e, n) {
    this.popupVisible = true;
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
      const x = this.Practicas.findIndex((item) => item.n_prac === e.data.n_prac);
      if (this.toggle[x] == true) {
        e.rowElement.style.backgroundColor = "#81F79F";
      }
      if (this.ArrRPP[x] == true) {
        // console.log(x +" : " + e.data.n_prac);
        e.rowElement.style.backgroundColor = "#F3F781";
      }
    }
  }

  DetallePractica(e, i) {
    this.popupPracticaDescription = true;
    this.visibledescriptionprac = true;
    this.visiblegridop = false;
    this.visiblegriddp = false;
    var n_prac = this.Practicas[i].n_prac;
    this.taskService.getDescriptionPracticas(n_prac)
      .subscribe(res => {
        var xmlString = res[0].description,
          results = document.getElementById("results")
        results.innerHTML = xmlString;
      });
  }

  DetallePracticaObj(e, i) {
    this.popupPracticaDescription = true;
    this.visibledescriptionprac = false;
    this.visiblegriddp = false;
    this.CrudRopService.GetRop()
      .subscribe(rop => {
        this.visiblegridop = true;
        var n_prac = this.Practicas[i].n_prac;
        var rlo = rop.filter(function (task) {
          return task.n_prac == n_prac;
        });
        this.ArrRPO = rlo;
      });
  }

  DetallePracticaDesafios(e, i) {
    var n_prac = this.Practicas[i].n_prac;
    this.popupPracticaDescription = true;
    this.visiblegriddp = true;
    this.visibledescriptionprac = false;
    this.visiblegridop = false;
    this.taskService.getRdp(n_prac)
      .subscribe(rdp => {
        this.DataRdp = rdp;
      });
  }


  ShowRpp(e, i) {
    this.ArrShowRpp[i] = !this.ArrShowRpp[i];
    if (this.ArrShowRpp[i] == true) {
      var r_spp_new = this.ArrShowRpp.map(function (p, j) { return p = false; });
      this.ArrShowRpp = r_spp_new;
      this.ArrShowRpp[i] = true;
      var n_prac = this.Practicas[i].n_prac;
      this.rpp(n_prac);
    } else {
      var sr = this.ArrRPP.filter(function (task) {
        return task == false;
      });
      this.ArrRPP = sr;
      this.GridPrac.instance.refresh();
    }
  }

  rpp(n_prac) {
    var practicas = [];
    practicas = this.Practicas;
    this.taskService.getRpp(n_prac)
      .subscribe(rpp => {
        var r_pp_final = practicas.map(function (p, j) {
          var r;
          var indexP2 = rpp.find((item) => item.n_prac_2 === p.n_prac);
          if (indexP2) { r = true; } else { r = false; }
          // console.log(p.n_prac + " : " + r);
          return r;
        });
        this.ArrRPP = r_pp_final;
        this.GridPrac.instance.refresh();
      });
  }

}

