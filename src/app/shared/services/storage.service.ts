import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  baseUrl = this.env.apiurl();
  
  constructor(private http: HttpClient, private env: Environments) { }
  
  // subirArchivo(nombreCarpeta: any, archivo: File) {
  //   const formData = new FormData();
  //   formData.append('Archivo', archivo);
  //   return this.http.post( this.baseUrl+`ImageManager/crearCarpeta/${nombreCarpeta}`, formData);
  // }

  // subirArchivo(nombreCarpeta: string, archivo: File): Observable<HttpEvent<any>> {
    
  //   const formData: FormData = new FormData();
  //   formData.append('Archivo', archivo);
  //   const apiUrl = this.baseUrl + 'ImageManager/crearCarpeta/' + nombreCarpeta;
  //   const headers = new HttpHeaders({
  //     'ngrok-skip-browser-warning': 'true'
  //   });

  //   const req = new HttpRequest('POST', apiUrl, formData, {
  //     headers: headers,
  //     reportProgress: true,
  //     responseType: 'json'
  //   });

  //   return this.http.request(req);

  // }

  subirArchivo(nombreCarpeta: string, archivo: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('Archivo', archivo);
    const apiUrl = this.baseUrl + 'ImageManager/crearCarpeta/' + nombreCarpeta;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
  
    const req = new HttpRequest('POST', apiUrl, formData, {
      headers: headers,
      reportProgress: true,
      responseType: 'json'
    });
  
    return this.http.request(req);
  }

  guardarFileSeason( model:any [] ) {
    return this.http.post( this.baseUrl + 'FileSeason/guardarUrlFile', model );
  }

  guardarProducto( model: any [] ) {
    return this.http.post( this.baseUrl + 'Producto/GuardarProducto', model );
  }
 
  obtenerProductos( id:number, idcliente:number, estado: number ) {

    const apiUrl = this.baseUrl + 'Producto/ObtenerProductosCliente/' + id + '/' + idcliente + '/' + estado;

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(apiUrl, { headers });

  }
 
  eliminarProductoCliente( id:number ) {
    
    const apiUrl = this.baseUrl + 'Producto/EliminarProductosCliente/' + id;

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(apiUrl, { headers });

  }

  actualizarEstadosProductos( st:number, iduser: number, idcliente: number ) {

    const apiUrl = this.baseUrl + 'Producto/ActualizarProductosClienteEstado/' + st + '/' + iduser + '/' + idcliente;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(apiUrl, { headers });

  }


}
