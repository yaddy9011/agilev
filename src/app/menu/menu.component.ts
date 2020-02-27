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


  constructor(private AuthService: AuthService, private router: Router, private route: ActivatedRoute) {


    this.route.params.subscribe(params => {
      this.resetToken = params.token;
      this.idEval = params.id_eval;
      console.log(this.idEval);
    });

    //this.idEval =this.route.snapshot.paramMap.get('id_eval')

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

      case "/home": {

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
        }

        if (y == 1) {
          location.reload();
        }

        break;
      }

      case "/main": {

        this.isShowReg = !this.isShowReg;
        this.isShowLog = !this.isShowLog;

        if (y == 1) {
          this.router.navigateByUrl('/home');
        }

        break;

      }

      case "/login": {
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
        if (x == null) {
          this.isShowLogo = !this.isShowLogo;
          this.isShoweval = !this.isShoweval;
          this.isShowprac = !this.isShowprac;
        } else {
          this.isShowReg = !this.isShowReg;
          this.isShowLog = !this.isShowLog;
        }

        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/registro": {
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
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/Gpracticas": {
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
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/ForgotPassword": {
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
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/RelacionOP": {
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
        }
        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }
      case "/response-reset-password/" + this.resetToken: {
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
      case "/ForgotPassword": {

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
        }

        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }

      case "/Diagnostico_areas/" + this.idEval: {

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
        }

        if (y == 1) {
          this.router.navigateByUrl('/home');
        }
        break;
      }




    }
  }
}
