import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserI } from '../clases/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  popupVisible = false;
  mensaje = "";
  loadingVisible = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLogin(form): void {

    this.loadingVisible = true;
    this.authService.login(form.value).subscribe(res => {
      this.router.navigateByUrl('/main');
    },
      error => {
        this.popupVisible = true;
        this.mensaje = error.error;
      });
  }

  doneClick() {
    this.popupVisible = false;
  }


  onShown() {
    setTimeout(() => {
      this.loadingVisible = false;
    }, 3000);
  }

  onHidden() {
  }

}
