import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Password } from 'primeng/password';
import { UserService } from '../services/user.service';

import Swal from 'sweetalert2'
import { Router } from '@angular/router';
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  _show_spinner: boolean = false;

  public loginForm = new FormGroup({
    email:        new FormControl(''),
    password:        new FormControl('')
  })

  ngOnInit(): void {
      this.log.validacion()
  }

  constructor( private log: UserService, private route: Router ) {}

  onSubmit() {

  }

  loguearse() {

    this._show_spinner = true;

    this.log.login( this.loginForm.value ).subscribe({
      next: (x:any) => {
        console.warn(x);
        sessionStorage.setItem('email',  x.email);
        sessionStorage.setItem('nombre', x.nombre);
        sessionStorage.setItem('t',      x.tipo);
        sessionStorage.setItem('cedula', x.cedula);
        Toast.fire({
          icon: "success",
          title: "Ingreso exitoso"
        });
      }, error: (e) => {
        Toast.fire({
          icon: "error",
          title: "Algo ha ocurrido"
        });
        this._show_spinner = false;
      }, complete: () => {
        setTimeout(() => {
          this._show_spinner = false;
          this.route.navigate(['home']);
        }, 1000);
      }
    })

  }

}
