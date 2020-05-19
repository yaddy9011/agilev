import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {

  isShoweval = false;
  isShowReg = false;
  isShowLog = false;
  isShowLogo = false;
  isShowprac = false;
  isShowGo = false;
  isShowGp = false;
  isShowROP = false;
  resetToken: null;
  idEval: String;
  titlePage: String;
  adminacces: boolean;
  idusr:String;

  constructor(private AuthService: AuthService, 
    private router: Router, 
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.resetToken = params.token;
      this.idEval = params.id_eval;
      this.idusr= params.idusr;
    });

    var z = localStorage.getItem("ACCESS_admin");
    this.adminacces = JSON.parse(z);
    
  }

  ngOnInit() {
    this.navegacion(0);
    // let unit : string = document.getElementById('idz').innerHTML;
    // console.log(unit); para traerme valores de mis etiquetas html
    //this.isShow = !this.isShow;
    // if (x == null) {
    //   this.isShow = !this.isShow;
    //   console.log('x is greater than y.');
    // }
  }

  salir() {
    this.AuthService.logout();
    this.navegacion(1);
  }

  navegacion(y) {
    var pagina = this.router.url;
    var x = localStorage.getItem("ACCESS_IDS");
    switch (pagina) {

      case "/home": case "/": {
        this.titlePage = " AGILEV-ROADMAP";
        if (x == null) {
          this.isShowLogo = !this.isShowLogo;
          this.isShoweval = !this.isShoweval;
          this.isShowprac = !this.isShowprac;
          this.isShowGo = !this.isShowGo;
          this.isShowGp = !this.isShowGp;
          this.isShowROP = !this.isShowROP;
        } else {
          this.isShowReg = !this.isShowReg;
          this.isShowLog = !this.isShowLog;
          if (this.adminacces == false) {
            this.isShowGo = !this.isShowGo;
            this.isShowGp = !this.isShowGp;
            this.isShowROP = !this.isShowROP;
          }
        }
        if (y == 1) {
          location.reload();
        }
        break;
      }
      case "/main": {
        this.titlePage = "ROADMAP";
        this.isShowReg = !this.isShowReg;
        this.isShowLog = !this.isShowLog;

        if (this.adminacces == false) {
          this.isShowGo = !this.isShowGo;
          this.isShowGp = !this.isShowGp;
          this.isShowROP = !this.isShowROP;
        }

        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/login": {
        this.titlePage = "Acceso de usuario";
        this.isShowLog = !this.isShowLog;
        this.isShowLogo = !this.isShowLogo;
        this.isShoweval = !this.isShoweval;
        this.isShowprac = !this.isShowprac;
        this.isShowGo = !this.isShowGo;
        this.isShowGp = !this.isShowGp;
        this.isShowROP = !this.isShowROP;
        break;
      }
      case "/eval": {
        this.titlePage = "Consulta de diagnósticos";
        if (x == null) {
          this.isShowLogo = !this.isShowLogo;
          this.isShoweval = !this.isShoweval;
          this.isShowprac = !this.isShowprac;
          this.isShowGo = !this.isShowGo;
          this.isShowGp = !this.isShowGp;
          this.isShowROP = !this.isShowROP;
        } else {
          this.isShowReg = !this.isShowReg;
          this.isShowLog = !this.isShowLog;
          if (this.adminacces == false) {
            this.isShowGo = !this.isShowGo;
            this.isShowGp = !this.isShowGp;
            this.isShowROP = !this.isShowROP;
          }
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/registro": {
        this.titlePage = "Registro de usuario";
        this.isShowReg = !this.isShowReg;
        this.isShowLogo = !this.isShowLogo;
        this.isShoweval = !this.isShoweval;
        this.isShowprac = !this.isShowprac;
        this.isShowGo = !this.isShowGo;
        this.isShowGp = !this.isShowGp;
        this.isShowROP = !this.isShowROP;
        break;
      }
      case "/Gobjetivos": {
        this.titlePage = "Gestión de objetivos";
        if (x == null) {
          this.isShowLogo = !this.isShowLogo;
          this.isShoweval = !this.isShoweval;
          this.isShowprac = !this.isShowprac;
          this.isShowGo = !this.isShowGo;
          this.isShowGp = !this.isShowGp;
          this.isShowROP = !this.isShowROP;

        } else {
          this.isShowReg = !this.isShowReg;
          this.isShowLog = !this.isShowLog;
          if (this.adminacces == false) {
            this.isShowGo = !this.isShowGo;
            this.isShowGp = !this.isShowGp;
            this.isShowROP = !this.isShowROP;
          }
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/Gpracticas": {
        this.titlePage = "Gestión de prácticas";
        if (x == null) {
          this.isShoweval = !this.isShoweval;
          this.isShowprac = !this.isShowprac;
          this.isShowLogo = !this.isShowLogo;
          this.isShowGo = !this.isShowGo;
          this.isShowGp = !this.isShowGp;
          this.isShowROP = !this.isShowROP;
        } else {
          this.isShowReg = !this.isShowReg;
          this.isShowLog = !this.isShowLog;
          if (this.adminacces == false) {
            this.isShowGo = !this.isShowGo;
            this.isShowGp = !this.isShowGp;
            this.isShowROP = !this.isShowROP;
          }
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/ForgotPassword": {
        this.titlePage = "Restablecimiento de Contraseña";
        if (x == null) {
          this.isShoweval = !this.isShoweval;
          this.isShowprac = !this.isShowprac;
          this.isShowLogo = !this.isShowLogo;
          this.isShowGo = !this.isShowGo;
          this.isShowGp = !this.isShowGp;
          this.isShowROP = !this.isShowROP;

        } else {
          this.isShowReg = !this.isShowReg;
          this.isShowLog = !this.isShowLog;
          if (this.adminacces == false) {
            this.isShowGo = !this.isShowGo;
            this.isShowGp = !this.isShowGp;
            this.isShowROP = !this.isShowROP;
          }
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/RelacionOP": {
        this.titlePage = "Gestión de relación Objetivos-Prácticas";
        if (x == null) {
          this.isShoweval = !this.isShoweval;
          this.isShowprac = !this.isShowprac;
          this.isShowLogo = !this.isShowLogo;
          this.isShowGo = !this.isShowGo;
          this.isShowGp = !this.isShowGp;
          this.isShowROP = !this.isShowROP;

        } else {
          this.isShowReg = !this.isShowReg;
          this.isShowLog = !this.isShowLog;
          if (this.adminacces == false) {
            this.isShowGo = !this.isShowGo;
            this.isShowGp = !this.isShowGp;
            this.isShowROP = !this.isShowROP;
          }
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/response-reset-password/" + this.resetToken: {
        this.titlePage = "Validación de usuario cambio de contraseña";
        this.isShoweval = !this.isShoweval;
        this.isShowprac = !this.isShowprac;
        this.isShowLogo = !this.isShowLogo;
        this.isShowGo = !this.isShowGo;
        this.isShowGp = !this.isShowGp;
        this.isShowROP = !this.isShowROP;
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }

      case "/ValidEmail/" + this.idusr: {
        this.titlePage = "Confirmación de Correo Electronico";
        this.isShoweval = !this.isShoweval;
        this.isShowprac = !this.isShowprac;
        this.isShowLogo = !this.isShowLogo;
        this.isShowGo = !this.isShowGo;
        this.isShowGp = !this.isShowGp;
        this.isShowROP = !this.isShowROP;
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/Diagnostico_objetivos/" + this.idEval: {
        this.titlePage = "Diagnóstico del nivel de agilidad";
        if (x == null) {
          this.isShoweval = !this.isShoweval;
          this.isShowprac = !this.isShowprac;
          this.isShowLogo = !this.isShowLogo;
          this.isShowGo = !this.isShowGo;
          this.isShowGp = !this.isShowGp;
          this.isShowROP = !this.isShowROP;
        } else {
          this.isShowReg = !this.isShowReg;
          this.isShowLog = !this.isShowLog;
          if (this.adminacces == false) {
            this.isShowGo = !this.isShowGo;
            this.isShowGp = !this.isShowGp;
            this.isShowROP = !this.isShowROP;
          }
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/EquipoAgile": {
        this.titlePage = "Equipo Agile Roadmap++";
        if (x == null) {
          this.isShoweval = !this.isShoweval;
          this.isShowprac = !this.isShowprac;
          this.isShowLogo = !this.isShowLogo;
          this.isShowGo = !this.isShowGo;
          this.isShowGp = !this.isShowGp;
          this.isShowROP = !this.isShowROP;

        } else {
          this.isShowReg = !this.isShowReg;
          this.isShowLog = !this.isShowLog;
          if (this.adminacces == false) {
            this.isShowGo = !this.isShowGo;
            this.isShowGp = !this.isShowGp;
            this.isShowROP = !this.isShowROP;
          }
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/InfoPasosRoadmap": {
        this.titlePage = "Pasos Roadmap";
        if (x == null) {
          this.isShoweval = !this.isShoweval;
          this.isShowprac = !this.isShowprac;
          this.isShowLogo = !this.isShowLogo;
          this.isShowGo = !this.isShowGo;
          this.isShowGp = !this.isShowGp;
          this.isShowROP = !this.isShowROP;

        } else {
          this.isShowReg = !this.isShowReg;
          this.isShowLog = !this.isShowLog;
          if (this.adminacces == false) {
            this.isShowGo = !this.isShowGo;
            this.isShowGp = !this.isShowGp;
            this.isShowROP = !this.isShowROP;
          }
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/InfoAcercaDe": {
        this.titlePage = "Roadmap++";
        if (x == null) {
          this.isShoweval = !this.isShoweval;
          this.isShowprac = !this.isShowprac;
          this.isShowLogo = !this.isShowLogo;
          this.isShowGo = !this.isShowGo;
          this.isShowGp = !this.isShowGp;
          this.isShowROP = !this.isShowROP;

        } else {
          this.isShowReg = !this.isShowReg;
          this.isShowLog = !this.isShowLog;
          if (this.adminacces == false) {
            this.isShowGo = !this.isShowGo;
            this.isShowGp = !this.isShowGp;
            this.isShowROP = !this.isShowROP;
          }
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/InfoPracticas": {
        this.titlePage = "Prácticas Roadmap++";
        if (x == null) {
          this.isShoweval = !this.isShoweval;
          this.isShowprac = !this.isShowprac;
          this.isShowLogo = !this.isShowLogo;
          this.isShowGo = !this.isShowGo;
          this.isShowGp = !this.isShowGp;
          this.isShowROP = !this.isShowROP;

        } else {
          this.isShowReg = !this.isShowReg;
          this.isShowLog = !this.isShowLog;
          if (this.adminacces == false) {
            this.isShowGo = !this.isShowGo;
            this.isShowGp = !this.isShowGp;
            this.isShowROP = !this.isShowROP;
          }
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }

    }
  }

}
