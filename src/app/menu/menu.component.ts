import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

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

  constructor(private AuthService: AuthService, private router: Router) { }

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
          this.isShowprac= !this.isShowprac;

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
        this.isShowprac= !this.isShowprac;

        break;
      }

      case "/eval": {

        if (x == null) {

          this.isShowLogo = !this.isShowLogo;
          this.isShoweval = !this.isShoweval;
          this.isShowprac= !this.isShowprac;

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
        this.isShowprac= !this.isShowprac;

        break;
      }

    }

  }

}
