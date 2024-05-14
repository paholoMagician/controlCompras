import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from '../../environments/environments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( private http: HttpClient, private url: Environments, private route: Router ) { }

  login( model:any ) {
    return this.http.post( this.url.apiurl() + 'Usuario/login', model )
  }

  validacion() {
    const xname: any = sessionStorage.getItem('nombre');
    const xt: any = sessionStorage.getItem('t');

    if ( xname == null || xname == undefined && xt == null || xt == undefined ) {
      this.route.navigate(['login'])
    } else {
      this.route.navigate(['home'])
    }

  }

  cerrarSesion() {

    sessionStorage.removeItem('nombre');
    sessionStorage.removeItem('t');
    sessionStorage.removeItem('cedula');
    sessionStorage.removeItem('email');
    this.route.navigate(['login'])

  }

}
