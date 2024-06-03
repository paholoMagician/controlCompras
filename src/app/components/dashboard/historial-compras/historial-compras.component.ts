import { Component, OnInit } from '@angular/core';
import { Environments } from '../../environments/environments';
import { StorageService } from 'src/app/shared/services/storage.service';
import { HistorialService } from './historial.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalImageComponent } from './modal-image/modal-image.component';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.component.html',
  styleUrls: ['./historial-compras.component.scss']
})
export class HistorialComprasComponent implements OnInit {

  _show_spinner: boolean = false;
  xindex: any;
  ngOnInit(): void {
    this.xindex = sessionStorage.getItem('index');    
    this.obtenerProductos(this.xindex, 0);
  }

  constructor(private historialServices: HistorialService, private env: Environments, public dialog: MatDialog,) {}

  listaComras: any = [];
  listaComrasGhost: any = [];
  obtenerProductos(iduser:number, idcliente: number) {
    this.listaComras = [];
    this._show_spinner = true;
    this.historialServices.obtenerHistorialCompras( iduser, idcliente ).subscribe({
      next: (x) => {
        this.listaComras = x;
        this.listaComrasGhost = x;
        console.log(this.listaComras)
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }, complete: () => {
        this.sumatoria();
      }
    })

  }

  showImage( url:any, idcli: number ) {
    let urlimagen: any = this.env.apingRok + '/storage/' + idcli + '/' + url
    console.log(urlimagen)
    this.openDialogCursos(urlimagen);
  }

  openDialogCursos(url:any) {   

    const dialogRef = this.dialog.open( ModalImageComponent, {
      height: 'auto',
      width:  '300px',
      data: url,
    });

    dialogRef.afterClosed().subscribe( result => {
      console.warn( result );
    });

  }

  filterInitit:any;
  filterHistory () {
    this.listaComras = this.listaComrasGhost.filter((item:any) => 
      item.nombre.toLowerCase().includes(this.filterInitit.toLowerCase()) ||
      item.nombreAppStore.toLowerCase().includes(this.filterInitit.toLowerCase()) ||
      item.nombreProducto.toLowerCase().includes(this.filterInitit.toLowerCase())
    );
    this.sumatoria()
  }

  pvptotal: number = 0;
  pvttotal: number = 0;
  sumatoria() {
    this.pvptotal = 0;
    this.pvttotal = 0;
    this.listaComras.filter( (x:any) => {
      this.pvptotal += x.precioacliente;
      this.pvttotal += x.preciodeapp;
    })
  }


}
