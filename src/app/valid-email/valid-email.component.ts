import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-valid-email',
  templateUrl: './valid-email.component.html',
  styleUrls: ['./valid-email.component.css']
})
export class ValidEmailComponent implements OnInit {

  usr = "";
  mensaje = "";
  popupVisible = false;
  isShow = true;
  valbutton = false;

  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.usr = params.idusr;
      console.log(this.usr);
    });
  }

  ConfirmCorreo(e) {
    this.authService.validarcorreoUsr({ id: this.usr }).subscribe(res => {
      this.popupVisible = true;
      this.mensaje = "El correo fue validado adecuadamente";
      this.valbutton = true;
    },
      error => {
        this.popupVisible = true;
        this.mensaje = "El hubo un problema con la validación,verifica de nuevo";
        this.valbutton = false;
        console.log(error);
      });
  }

  doneClick() {
    if (this.valbutton == true) {
      this.popupVisible = false;
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit() {
  }

}
