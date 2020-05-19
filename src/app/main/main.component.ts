import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TasksService } from '../services/tasks.service';
import { obj } from '../clases/obj';
import { Practica } from '../clases/practica';
import { UserI } from '../clases/user';
import { CrudRopService } from '../services/crud-rop.service';
import { EvalResulService } from '../services/eval-resul.service';
import { Diagnostico } from '../clases/diagnotico';
import { RowDDService, SelectionService } from '@syncfusion/ej2-angular-grids';
import { ViewportScroller } from '@angular/common';
import notify from 'devextreme/ui/notify';
import { MatTable } from '@angular/material/table';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class MainComponent implements OnInit {


  @ViewChild('table', { static: true }) table: MatTable<obj>;
  @ViewChild('tableprac', { static: true }) tableprac: MatTable<Practica>;


  panelOpenState = true;
  panelOpenStateObj = true;
  userName = '';
  objs: obj[];
  Subobjs: obj[];
  public DiagnosticObj: [];
  title: string;
  nameusr: string;
  Practicas: Practica[];
  ArrayPracticas: Practica[];
  SubPracticas: Practica[];
  checked = false;
  checkANA = false;
  checkedObjetivosNI = false;
  id_usr = "";
  DataRop = [];
  DatasourseRop = [];
  popupVisible = false;
  _nobj = 0;
  _nprac = 0;
  popupPracticaDescription = false;
  ArrRPO = [];
  visiblegridop = false;
  visibledescriptionprac = false;
  DataRdp = [];
  visiblegriddp = false;
  panelOpenStatePrac = false;
  dragDisabled = true;
  hiddenNC: Boolean = true;
  positionFilter = new FormControl();
  optionsNa: string[];
  optionsDesa: string[];
  displayedColumns: string[];
  displayedColumnsPrac: string[];

  filterbyAplicable: boolean;
  FILTRO_: boolean;
  FILTRO_NA: boolean;
  FILTRO_DE: boolean;
  FILTRO_NOAP: boolean;
  filterbyNA;
  filterbyDE;
  filterbyNOAP;
  DisablePriorizacion = false;
  DisablePriorizacionobj = false;

  DisableNC = false;


  InputStringnprac: string;
  InputStringTextPrac: string;
  InputStringMetodo: string;
  InputStringNotasPrac: string;
  selectaplicableval = 1;
  selectdesafioval = -1;
  selectnaval = -1;

  InputStringnobj: string;
  InputStringTextObj: string;
  InputStringDiagObj: string;
  InputStringNotasObj: string;
  selectNoInteresa = 1;

  TextP: string;



  constructor(

    public taskService: TasksService,
    private CrudRopService: CrudRopService,
    private viewportScroller: ViewportScroller,
    private EvalResulService: EvalResulService) {

    this.optionsNa = ['No Definido ', ' Muy Bajo', 'Bajo', 'Medio', 'Alto', 'Muy alto'];
    this.optionsDesa = [' Muy Bajo', 'Bajo', 'Medio', 'Alto', 'Muy alto'];
    this.displayedColumns = ['n_obj', 'objetivo', 'pd', 'notas', 'NoInteresa'];
    this.showColumn();
    this.nameusr = localStorage.getItem("ACCESS_name");
    this.id_usr = localStorage.getItem("ACCESS_IDS");
    this.someMethod();
    this.getPracticas(this.id_usr, this.checked);
  }

  ngOnInit() {
    this.GetDiagnosticLive();
  }

  // METODOS PARA OBJETIVOS

  GetDiagnosticLive() {
    var p = new Diagnostico(this.taskService, "5e52bc768e4e3736a866f5e7", this.EvalResulService);
    p.GetDataEva(true);
    this.EvalResulService.routeDataA().subscribe(data => {
      this.DiagnosticObj = data;
      this.getObjetivos(this.id_usr);
    });

    this.EvalResulService.routeDataB().subscribe(data => {
      this.DataRop = data;
    });
  }

  someMethod() {
    // var p = new Diagnostico(this.taskService, "5e52bc768e4e3736a866f5e7", this.EvalResulService);
    // p.GetDataEva(true);


    // this.EvalResulService.routeDataA().subscribe({
    //   next: value => { console.log(value); },
    //   error: err => { },
    //   complete: () => {
    //     console.log("ok");
    //   }
    // });
    // this.EvalResulService.routeDataA().subscribe(
    //   value => console.log(value),
    //   error => console.log("Error: ", error),
    //   () => console.log("ok"));


    // this.EvalResulService.routeDataA()
    //   .subscribe((num: any) => {
    //     console.log(num);
    //   }, (err) => {
    //     console.log(err);
    //   }, () => { 
    //     console.log("ok");
    //   });


    // this.EvalResulService.routeDataA().subscribe(data => {
    //   this.DiagnosticObj = data;
    // }).add(() => {

    // });


  }

  getObjetivos(id_usr) {
    var showre;
    var Numnobj = this._nobj

    if (this._nobj > 0) {
      showre = true;
    } else {
      showre = false;
    }

    var arrOBJDIAGnew = [];
    arrOBJDIAGnew = this.DiagnosticObj;
    this.taskService.getobj(id_usr)
      .subscribe(obj => {
        var objss = obj.map(function (task, index, array) {
          let pd = 0;
          if (arrOBJDIAGnew) {
            const fd = arrOBJDIAGnew.find((item) => item.n_obj === obj[index].n_obj);
            if (fd) {
              pd = fd.pd;
            }
          } else {
            pd = 0;
          }

          var SwrFinal;
          if (showre == true) {
            if (Numnobj == obj[index].n_obj) {
              SwrFinal = true;
            } else {
              SwrFinal = false;
            }
          } else {
            SwrFinal = false
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
            pd: pd + "%",
            showro: SwrFinal
          };

          return arraData;
        });
        this.objs = objss;
        this.Subobjs = this.objs;
        this.objs.sort((a, b) => a.pos - b.pos);

      });

  }

  reorderobj(objss) {
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

  ChangeCheckNoInteresa(e) {
    var actObj = {
      _id: e.currentTarget.value,
      NoInteresa: e.currentTarget.checked
    };
    var ch = e.currentTarget.checked;
    var id = e.currentTarget.value;
    this.taskService.updateNoInteresa(actObj)
      .subscribe(res => {
        const v = this.objs.findIndex((item) => item._id === id);
        this.objs[v].NoInteresa = ch;
        if (this.FILTRO_NOAP == true) {
          var filter = this.objs.filter(x => x.NoInteresa == this.filterbyNOAP);
          this.objs = filter;
        } else {
          this.GetDiagnosticLive();
          if (ch == true) {
            let array = this.objs.concat(this.objs.splice(v, 1));
            this.objs = array;
            this.Subobjs = this.objs;
            this.ActualizarOrderRow();
            notify("La objetivo  OBJ" + this.objs[v].n_obj + " se ha movido hacia final de la lista.", "success", 3000);
          }
        }
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

  EventshowROP(e, no, SHOWROP) {
    SHOWROP = !SHOWROP;
    var r_srow_new = this.objs.map(function (p, j) { return p.showro = false; });
    if (SHOWROP === true) {
      this.DisableNC = true;
      var prac = this.Practicas.map(function (num) {
        num.colorRPP = false;
        num.spp = false;
        return num;
      });
      this._nprac = 0;
      this._nobj = no;
      this.panelOpenStatePrac = !this.panelOpenStatePrac;
      this.viewportScroller.scrollToAnchor("SlideTo");
      const index = this.objs.findIndex(element => element.n_obj == no);
      this.objs[index].showro = true;
      this.hiddenNC = false;
      this.RelacionOP(no);
    } else {
      this.DisableNC = false;
      this._nobj = 0;
      this.hiddenNC = true;
      var prac = this.Practicas.map(function (num) {
        num.colorROP = false;
        num.nivel_contribucion = "";
        return num;
      });
      this.Practicas = prac
    }
    this.showColumn();
  }

  dropObjetivos(event: CdkDragDrop<[]>) {
    this.dragDisabled = true;
    const previousIndex = this.objs.findIndex((d) => d === event.item.data);
    moveItemInArray(this.objs, previousIndex, event.currentIndex);
    this.table.renderRows();
    this.ActualizarOrderRow();
  }

  DetalleObjetivo(e, n_ob) {
    this.popupVisible = true;
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
    this.objs = this.Subobjs;
    arrObj = this.objs
    this.FILTRO_NOAP = false;
    this.selectNoInteresa = 1;
    this.LimpiarFiltrosStringObjetivos(1);
    if (this.checkedObjetivosNI == true) {
      var arrFilter = arrObj.filter((task) => task.NoInteresa == false);
      this.objs = arrFilter;
    } else {
      this.getObjetivos(this.id_usr);
    }
  }

  ActualizarOrderRow() {
    var newo = [];
    for (var i = 0; i < this.objs.length; i++) {
      this.updateStatusObj(this.objs[i], i);
      newo[i] = this.objs[i];
    }
  }

  FilterNoInteresa(e) {
    var objetivos = [];
    objetivos = this.Subobjs;
    var nointeress;
    this.LimpiarFiltrosStringObjetivos(1);
    if (Number(e) == 1) {
      this.FILTRO_NOAP = false;
      this.getObjetivos(this.id_usr);
    } else {

      switch (Number(e)) {
        case 2: {
          this.FILTRO_NOAP = true;
          nointeress = true;
          break;
        }
        case 3: {
          this.FILTRO_NOAP = true;
          nointeress = false;
          break;
        }
      }

      this.filterbyNOAP = nointeress;
      var filter = objetivos.filter(x => x.NoInteresa == nointeress);
      this.objs = filter;
    }


  }

  FilterTypeTextObj(filterValue: string, colum: number) {
    var objetivos = [];
    objetivos = this.Subobjs;
    if (filterValue === "undefined" || filterValue === "") {
      // this.GetDiagnosticLive();
      this.objs = this.Subobjs;
      this.LimpiarFiltrosStringObjetivos(1);
    } else {
      this.DisablePriorizacionobj = true;
      if (colum == 1) {
        var filresul = objetivos.filter(x => x.n_obj == parseInt(filterValue));
        this.objs = filresul;
        this.LimpiarFiltrosStringObjetivos(2);
      } else {
        var columnaname;
        columnaname = "";
        switch (colum) {
          case 2: {
            this.LimpiarFiltrosStringObjetivos(3);
            columnaname = "objetivo";
            break;
          }
          case 3: {
            this.LimpiarFiltrosStringObjetivos(4);
            columnaname = "pd";
            break;
          }
          case 4: {
            this.LimpiarFiltrosStringObjetivos(5);
            columnaname = "notas";
            break;
          }
        }
        var data = objetivos.filter(x => x[columnaname].toLowerCase().includes(filterValue.toLowerCase()));
        this.objs = data;
      }
    }
  }

  LimpiarFiltrosStringObjetivos(n) {
    switch (n) {
      case 1: {
        this.InputStringnobj = '';
        this.InputStringTextObj = '';
        this.InputStringDiagObj = '';
        this.InputStringNotasObj = '';
        break;
      }
      case 2: {
        this.InputStringTextObj = '';
        this.InputStringDiagObj = '';
        this.InputStringNotasObj = '';
        this.selectNoInteresa = 1;
        break;
      }
      case 3: {
        this.InputStringnobj = '';
        this.InputStringDiagObj = '';
        this.InputStringNotasObj = '';
        this.selectNoInteresa = 1;
        break;
      }
      case 4: {
        this.InputStringnobj = '';
        this.InputStringTextObj = '';
        this.InputStringNotasPrac = '';
        this.selectNoInteresa = 1;
        break;
      }
      case 5: {
        this.InputStringnobj = '';
        this.InputStringTextObj = '';
        this.InputStringDiagObj = '';
        this.selectNoInteresa = 1;
        break;
      }
    }
  }

  // METODOS PARA PRÁCTICAS

  RelacionOP(no) {
    this.CrudRopService.GetRop()
      .subscribe(rop => {
        var arrPPnew = [];
        arrPPnew = this.Practicas;
        rop.forEach(function (value) {
          if (value.n_obj == no) {
            let p = value.n_prac.valueOf();
            const b = arrPPnew.findIndex((item) => item.n_prac === p);

            if (b > -1) {
              arrPPnew[b].colorROP = true;
              let nc_title = "";
              switch (value.nivel_contribucion) {
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
              arrPPnew[b].nivel_contribucion = nc_title;
            }


          }
        });
        this.Practicas = arrPPnew;
      });
  }

  getPracticas(id_usr, ap) {
    this.taskService.getPracticas(id_usr, ap)
      .subscribe(prac => {
        this.ArrayPracticas = prac;
        this.ArrayPracticas.sort((a, b) => a.pos - b.pos);
        var arrdatanew = [];

        //Asignar datos actualizados de practicas

        for (var i = 0; i < this.ArrayPracticas.length; i++) {

          //PARA EL WARNING DEL NA
          var showwarningna;
          if (prac[i].nivelapli == 0) {
            showwarningna = true;
          } else {
            showwarningna = false;
          }
          var showpp = false;

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
            desafio: prac[i].desafio,
            sw: showwarningna,
            colorROP: false,
            colorRPP: false,
            nivel_contribucion: "",
            spp: showpp
          };
          arrdatanew.push(arraData);
        }

        this.Practicas = arrdatanew;
        this.Practicas.sort((a, b) => a.pos - b.pos);
        this.SubPracticas = this.Practicas;

        // para ordenamiento

        this.orderNA();
        this.OrderAplicables();


        if (this._nobj > 0) {
          this.RelacionOP(this._nobj);
        }

        // //Para Recolorear al momento de hacer llamado a GET RPP

        if (this._nprac > 0) {
          const index = this.Practicas.findIndex(element => element.n_prac == this._nprac);
          if (index > -1) {
            this.Practicas[index].spp = true;
            this.rpp(this._nprac);
          }
        }



        // this.OrdenamientoPracticas(this.Practicas);

        //Para Recolorear al momento de hacer llamado a GET ROP



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

  onChangeNA(deviceValue, desaf, _id, e, n_prac) {

    var ActPractica = {
      _id: _id,
      na: Number(deviceValue)
    };

    this.taskService.updateNA(ActPractica)
      .subscribe(res => {
        const index = this.Practicas.findIndex(element => element.n_prac == n_prac);
        var showwarningna;
        if (deviceValue == 0) {
          showwarningna = true;
        } else {
          showwarningna = false;
        }
        this.Practicas[index].sw = showwarningna;
        this.Practicas[index].nivelapli = Number(deviceValue);

        if (this.FILTRO_NA == true) {
          var filter = this.Practicas.filter(x => x.nivelapli == this.filterbyNA);
          this.Practicas = filter;
        } else {
          if (Number(deviceValue) == 5) {
            let array = this.Practicas.concat(this.Practicas.splice(index, 1));
            this.Practicas = array;
            this.reOrderPrac();
            this.orderNA();
            this.OrderAplicables();
            notify("La práctica " + this.Practicas[index].num + " se ha movido hacia final de la lista.", "success", 3000);
          }

        }
        this.tableprac.renderRows();
        this.GetDiagnosticLive();
      });
  }

  onChangeDesafio(deviceValue, _id, n_prac) {

    var ActPractica = {
      _id: _id,
      desafio: Number(deviceValue)
    };

    this.taskService.updateDesafio(ActPractica)
      .subscribe(res => {

        const index = this.Practicas.findIndex(element => element._id == _id);
        this.Practicas[index].desafio = Number(deviceValue);

        if (this.FILTRO_DE == true) {
          var filter = this.Practicas.filter(x => x.desafio == this.filterbyDE);
          this.Practicas = filter;
        }

      });
  }

  onChangeAplicable(e, num) {

    var ActPractica = {
      _id: e.currentTarget.value,
      aplicable: e.currentTarget.checked
    };

    var id = e.currentTarget.value;
    var aplicable = e.currentTarget.checked

    this.taskService.updateAplicable(ActPractica)
      .subscribe(res => {
        const v = this.Practicas.findIndex((item) => item._id === id);
        this.Practicas[v].aplicable = aplicable;

        if (this.FILTRO_) {
          var filter = this.Practicas.filter(x => x.aplicable == this.filterbyAplicable);
          this.Practicas = filter;
        } else {
          if (aplicable == true) {
            let array = this.Practicas.concat(this.Practicas.splice(v, 1));
            this.Practicas = array;
            notify("La práctica " + num + " se ha movido hacia final de la lista.", "success", 3000);
            this.orderNA();
            this.OrderAplicables();
            this.reOrderPrac();
          }
          this.SubPracticas = this.Practicas;
        }
        this.GetDiagnosticLive();
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

  dropPracticas(event: CdkDragDrop<[]>) {
    this.dragDisabled = true;
    const previousIndex = this.Practicas.findIndex((d) => d === event.item.data);
    moveItemInArray(this.Practicas, previousIndex, event.currentIndex);
    this.tableprac.renderRows();
    this.reOrderPrac();
  }

  reOrderPrac() {
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
    this.taskService.updatePracticanew(newp, "ok")
      .subscribe(res => {
        console.log("ok termine");
      });
  }

  eventAltoNA(e) {
    this.selectaplicableval = 1;
    this.selectdesafioval = -1;
    this.selectnaval = -1;
    this.FILTRO_DE = false;
    this.FILTRO_NA = false;
    this.FILTRO_ = false;
    this.LimpiarFiltrosString(1);
    this.getPracticas(this.id_usr, false);
    this.DisablePriorizacion = false;
  }

  eventAplicables(e) {
    this.selectaplicableval = 1;
    this.selectdesafioval = -1;
    this.selectnaval = -1;
    this.FILTRO_DE = false;
    this.FILTRO_NA = false;
    this.FILTRO_ = false;
    this.LimpiarFiltrosString(1);
    this.getPracticas(this.id_usr, false);
    this.DisablePriorizacion = false;
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

  DetallePractica(e, p, textpr) {
    this.popupPracticaDescription = true;
    this.visibledescriptionprac = true;
    this.visiblegridop = false;
    this.visiblegriddp = false;
    this.TextP = "PRA " + p + ": " + textpr + " ";
    this.taskService.getDescriptionPracticas(p)
      .subscribe(res => {
        var xmlString = res[0].description,
          results = document.getElementById("results")
        results.innerHTML = xmlString;
      });
  }

  DetallePracticaObj(e, p, textpr) {
    this.popupPracticaDescription = true;
    this.visibledescriptionprac = false;
    this.visiblegriddp = false;
    this.TextP = "PRA " + p + ": " + textpr + " ";

    this.CrudRopService.GetRop()
      .subscribe(rop => {
        this.visiblegridop = true;
        var n_prac = p;
        var rlo = rop.filter(function (task) {
          return task.n_prac == n_prac;
        });
        this.ArrRPO = rlo;
      });
  }

  DetallePracticaDesafios(e, p, textpr) {
    this.popupPracticaDescription = true;
    this.visiblegriddp = true;
    this.visibledescriptionprac = false;
    this.visiblegridop = false;
    this.TextP = "PRA " + p + ": " + textpr + " ";

    this.taskService.getRdp(p)
      .subscribe(rdp => {
        this.DataRdp = rdp;
      });
  }

  ShowRpp(e, i, SHOWRPP, n_prac) {
    SHOWRPP = !SHOWRPP;
    if (SHOWRPP == true) {

      this.hiddenNC = true;
      this.showColumn();
      var prac = this.Practicas.map(function (num) {
        num.colorROP = false;
        num.nivel_contribucion = "";
        return num;
      });

      if (this._nobj) {
        const y = this.objs.findIndex(element => element.n_obj == this._nobj);
        this.objs[y].showro = false;
        this._nobj = 0;
      }

      this._nprac = n_prac;
      var r_spp_new = this.Practicas.map(function (p, j) { p.spp = false; return p });
      const index = this.Practicas.findIndex(element => element.n_prac == n_prac);
      this.Practicas = r_spp_new;
      this.Practicas[index].spp = true;
      this.rpp(n_prac);
    } else {
      this._nprac = 0;
      var prac = this.Practicas.map(function (num) {
        num.colorRPP = false;
        num.spp = false;
        return num;
      });
      this.Practicas = prac;
    }
  }

  rpp(n_prac) {
    var practicas = [];
    practicas = this.Practicas;
    this.taskService.getRpp(n_prac)
      .subscribe(rpp => {
        var r_pp_final = practicas.map(function (p, j) {
          var indexP2 = rpp.find((item) => item.n_prac_2 === p.n_prac);
          if (indexP2) { p.colorRPP = true; }
          else { p.colorRPP = false; }
          return p;
        });
        this.Practicas = r_pp_final;
      });
  }

  public getColor(crop: boolean, crpp: boolean, cspp: boolean): string {
    var color;
    if (crop == true) {
      color = "#bfefbb";
    } else if (crpp == true) {
      color = "#FFFF99";
    } else if (cspp == true) {
      color = "#d1ebf7";
    } else {
      color = "white";
    }
    return color;
    // var color;
    // if (crop == true) {
    //   color = "#81F79F";
    // } else if (crpp == true) {
    //   color = "#F3F781";
    // } else {
    //   color = "white";
    // }
    // return crop == true ? "#81F79F" : "white";
  }

  showColumn() {
    if (this.hiddenNC == false) {
      this.displayedColumnsPrac.push('nc');
    } else {
      this.displayedColumnsPrac = ['n_prac', 'textprac', 'metodologia', 'desafio', 'na', 'notas', 'aplicable'];
    }
  }

  //Filtros Practicas

  FilterDesafio(e: number) {
    this.selectaplicableval = 1;
    this.selectnaval = -1;
    this.LimpiarFiltrosString(1);
    var practicass = [];
    practicass = this.SubPracticas;
    var desaf = e;
    if (desaf == -1) {
      this.DisablePriorizacion = false;
      this.getPracticas(this.id_usr, false);
      this.FILTRO_DE = false;
    } else {
      this.DisablePriorizacion = true;
      this.FILTRO_DE = true;
      this.filterbyDE = desaf;
      var filter = practicass.filter(x => x.desafio == desaf);
      this.Practicas = filter;
    }
  }

  FilterNA(e: number) {
    this.LimpiarFiltrosString(1);
    this.selectaplicableval = 1;
    this.selectdesafioval = -1;
    var practicass = [];
    practicass = this.SubPracticas;
    var na = e;
    if (na == -1) {
      this.getPracticas(this.id_usr, false);
      this.DisablePriorizacion = false;
      this.FILTRO_NA = false;
    } else {
      this.DisablePriorizacion = true;
      this.FILTRO_NA = true;
      this.filterbyNA = na;
      var filter = practicass.filter(x => x.nivelapli == na);
      this.Practicas = filter;
    }
  }

  FilterAplicable(e: Number) {
    var apli: Number = Number(e);
    this.selectdesafioval = -1;
    this.selectnaval = -1;
    this.LimpiarFiltrosString(1);
    if (apli == 1) {
      this.DisablePriorizacion = false;
      this.FILTRO_ = false;
      this.getPracticas(this.id_usr, false);
    } else {
      this.DisablePriorizacion = true;
      var practicass = [];
      practicass = this.SubPracticas;

      switch (apli) {
        case 2: {
          this.FILTRO_ = true;
          this.filterbyAplicable = true;
          break;
        }
        case 3: {
          this.FILTRO_ = true;
          this.filterbyAplicable = false;
          break;
        }
      }
      var filter = practicass.filter(x => x.aplicable == this.filterbyAplicable);
      this.Practicas = filter;
    }
  }

  FilterTypeText(filterValue: string, colum: number) {
    var columnaname;
    var practicass = [];
    this.selectaplicableval = 1;
    this.selectdesafioval = -1;
    this.selectnaval = -1;
    this.FILTRO_DE = false;
    this.FILTRO_NA = false;
    this.FILTRO_ = false;
    if (filterValue === "undefined" || filterValue === "") {
      this.getPracticas(this.id_usr, false);
      this.DisablePriorizacion = false;
      this.LimpiarFiltrosString(1);
    } else {
      this.DisablePriorizacion = true;
      practicass = this.SubPracticas;
      columnaname = "";
      var data;
      if (colum == 1) {
        columnaname = "num";
        data = practicass.filter(x => x.n_prac == parseInt(filterValue));
        this.LimpiarFiltrosString(2);
      } else {
        switch (colum) {
          case 2: {
            columnaname = "textprac";
            this.LimpiarFiltrosString(3);
            break;
          }
          case 3: {
            columnaname = "metodologia";
            this.LimpiarFiltrosString(4);
            break;
          }
          case 4: {
            columnaname = "notas";
            this.LimpiarFiltrosString(5);
            break;
          }
        }
        data = practicass.filter(x => x[columnaname].toLowerCase().includes(filterValue.toLowerCase()));
      }




      this.Practicas = data;

    }

  }

  LimpiarFiltrosString(n) {

    switch (n) {
      case 1: {
        this.InputStringnprac = '';
        this.InputStringTextPrac = '';
        this.InputStringMetodo = '';
        this.InputStringNotasPrac = '';
        break;
      }
      case 2: {
        this.InputStringTextPrac = '';
        this.InputStringMetodo = '';
        this.InputStringNotasPrac = '';
        break;
      }
      case 3: {
        this.InputStringnprac = '';
        this.InputStringMetodo = '';
        this.InputStringNotasPrac = '';
        break;
      }
      case 4: {
        this.InputStringnprac = '';
        this.InputStringTextPrac = '';
        this.InputStringNotasPrac = '';
        break;
      }
      case 5: {
        this.InputStringnprac = '';
        this.InputStringTextPrac = '';
        this.InputStringMetodo = '';
        break;
      }
    }









  }

  //METODO PARA SCROLL 

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  doneClick() {
    this.popupPracticaDescription = false;
  }

  doneObj() {
    this.popupVisible = false;
  }


}

