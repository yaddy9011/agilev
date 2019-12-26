import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TasksService } from '../services/tasks.service';
import { Pais } from '../clases/pais';
import { Sector } from '../clases/Sector';
import { Ambito } from '../clases/Ambito';
import { numero_integrante } from '../clases/num-integrante';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Food {
  value: string;
  viewValue: string;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  Paises: Pais[];
  Sectores: Sector[];
  Ambitos: Ambito[];
  numero_integrantes: numero_integrante[];
  popupVisible = false;
  mensaje = "";

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  matcher = new MyErrorStateMatcher();


  constructor(private authService: AuthService, private taskService: TasksService, private router: Router, private _snackBar: MatSnackBar) {

    this.taskService.getPaises()
      .subscribe(pa => {
        this.Paises = pa;
      });

    this.taskService.getSector()
      .subscribe(sec => {
        this.Sectores = sec;
      });

    this.taskService.getAmbito()
      .subscribe(am => {
        this.Ambitos = am;
      });

    this.taskService.getNumIntegrantes()
      .subscribe(num_in => {
        this.numero_integrantes = num_in;
      });
  }

  ngOnInit() {
  }

  onRegister(form): void {

    this.authService.register(form.value).subscribe(res => {
      this.router.navigateByUrl('/login');
    },
      error => {
        this.popupVisible = true;
        this.mensaje = error.error;
      }
    );
  }

  doneClick() {
    this.popupVisible = false;
  }

}

