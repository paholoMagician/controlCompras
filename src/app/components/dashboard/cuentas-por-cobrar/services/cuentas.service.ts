import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class CuentasService {

  constructor( private http: HttpClient, private url: Environments) { }

  guardarCuentasCobrar( model: any [] ) {
    return this.http.post( this.url.apiurl() + 'cuentasPorCobrar/GuardarCuentasPorCobrar', model );
  }

  actualizarCuentasCobrar( id:number, model: any [] ) {
    return this.http.put( this.url.apiurl() + 'cuentasPorCobrar/actualizarCuentaPagar/' + id, model );
  }

  obtenerCuentasCobrar( id:number ) {

    const apiUrl = this.url.apiurl() + 'cuentasPorCobrar/ObtenerCuentasPorCobrar/'+ id;

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(apiUrl, { headers });

  }

  eliminarCuentasCobrar(id:number) {
    const apiUrl = this.url.apiurl() + 'cuentasPorCobrar/eliminarCuentasCobrar/'+ id;

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(apiUrl, { headers });

  }

}
