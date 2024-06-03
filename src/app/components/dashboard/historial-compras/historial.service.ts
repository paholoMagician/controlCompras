import { Injectable } from '@angular/core';
import { Environments } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {

  constructor( private http: HttpClient, private url: Environments) { }

  obtenerHistorialCompras( usercrea:number, idcli: number ) {

    const apiUrl = this.url.apiurl() + 'Producto/obtenerHistorialProductos/' + usercrea + '/' + idcli;

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(apiUrl, { headers });

  }


}
