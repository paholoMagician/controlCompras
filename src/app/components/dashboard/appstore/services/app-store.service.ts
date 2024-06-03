import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environments } from 'src/app/components/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {

  constructor( private http: HttpClient, private url: Environments) { }
  obtenerAppStore(usercrea: any): Observable<any> {
    const apiUrl = this.url.apiurl() + 'AppStore/obtenerAppStore/' + usercrea;
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.get(apiUrl, { headers });
  }
  guardarAppStore( model: any [] ) {
    return this.http.post( this.url.apiurl() + 'AppStore/guardarAppStore', model );
  }


  actualizarAppStore( usercrea:any, model: any [] ) {
    return this.http.put( this.url.apiurl() + 'AppStore/actualizarAppStore/'+usercrea, model )
  }

  eliminarAppStore( id:any ): Observable<any> {
    const apiUrl = this.url.apiurl() + 'AppStore/eliminarAppStore/' + id;

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(apiUrl, { headers });
  }

}
