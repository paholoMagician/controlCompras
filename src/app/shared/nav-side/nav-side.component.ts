import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Environments } from 'src/app/components/environments/environments';

@Component({
  selector: 'app-nav-side',
  templateUrl: './nav-side.component.html',
  styleUrls: ['./nav-side.component.scss']
})
export class NavSideComponent implements OnInit {

    constructor( private env: Environments ) {}

    versionActual: any = this.env.version;

  @Output() moduloEmit: any = new EventEmitter();
  xnombre: string = 'Bienvenid@'

  ngOnInit(): void {
    const x: any = sessionStorage.getItem('nombre');
    this.xnombre = x;
  }

  listaModulos = [
    {
      cod: 0,
      modulo: 'Home',
      ico: 'home'
    }, {
      cod: 1,
      modulo: 'Crear clientes',
      ico: 'person_add'
    }, {
      cod: 2,
      modulo: 'Agregar App Store',
      ico: 'store'
    }, {
      cod: 3,
      modulo: 'Historial de compras',
      ico: 'receipt_long'
    }, {
      cod: 4,
      modulo: 'Cuentas por cobrar',
      ico: 'payments'
    }
  ]

  enviarModulos(data:any) {
    this.moduloEmit.emit(data);
  }



}
