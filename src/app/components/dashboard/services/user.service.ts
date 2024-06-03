import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from '../../environments/environments';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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

  guardarUsuario( model: any [] ) {
    return this.http.post( this.url.apiurl() + 'Usuario/guardarUsuarios', model )
  }

  actualizarUsuario( id:number, model: any [] ) {
    return this.http.put( this.url.apiurl() + 'Usuario/actualizarUsuarios/' + id, model )
  }

  eliminarUsuario(estado: number, id: number, idcliente: number): Observable<any> {
    const apiUrl = this.url.apiurl() + 'Usuario/actualizarUsuarioEstado/' + estado + '/' + id + '/' + idcliente;

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(apiUrl, { headers });
  }

  cerrarSesion() {

    sessionStorage.removeItem('nombre');
    sessionStorage.removeItem('t');
    sessionStorage.removeItem('cedula');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('index');
    this.route.navigate(['login'])

  }

  obtenerUsuarios(id: number): Observable<any> {
    const apiUrl = this.url.apiurl() + 'Usuario/obtenerUsuario/' + id;

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(apiUrl, { headers });
  }

}
