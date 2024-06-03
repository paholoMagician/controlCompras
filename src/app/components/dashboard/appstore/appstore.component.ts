import { Component, OnInit } from '@angular/core';
import { AppStoreService } from './services/app-store.service';
import { FormControl, FormGroup } from '@angular/forms';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-appstore',
  templateUrl: './appstore.component.html',
  styleUrls: ['./appstore.component.scss']
})

export class AppstoreComponent implements OnInit {

  _show_spinner: boolean = false;

  icon_button: string = 'add';
  action_button: string = 'Crear Tienda';
  _formulario_on: boolean = true;
  iduser:any;
  listaAppStore: any = [];
  xindex: any;  
  sendModelAppStore: any = [];
  shoplist: any = [];

  public appStoreForm = new FormGroup({
    nombreAppStore:    new FormControl(''),
    observacion:       new FormControl('')
  })
 
  ngOnInit(): void {
    this.xindex = sessionStorage.getItem('index');
    this.obtenerAppStores()
  }

  constructor( private appstore: AppStoreService ) {}

  onSubmit() {

    switch( this.action_button ) {
      case 'Crear Tienda':
        this.guardarAppStore();
        break;
      case 'Editar Tienda':
        this.actualizarAppStore();
        break;
    }

  }

  guardarAppStore() {
    this.sendModelAppStore = {
      nombreAppStore: this.appStoreForm.controls['nombreAppStore'].value,
      usercrea:       this.xindex,
      feccrea:        new Date(),
      observacion:    this.appStoreForm.controls['observacion'].value,
      estado:         1
    }

    if ( this.appStoreForm.controls['nombreAppStore'].value == null || this.appStoreForm.controls['nombreAppStore'].value == undefined || this.appStoreForm.controls['nombreAppStore'].value == '' || this.appStoreForm.controls['nombreAppStore'].value?.toString().length < 1  ) {
      Swal.fire({
        title: "El nombre no puede ir vacío",
        icon: "warning"
      });    
      this._show_spinner = false;  
    } else {
      this.appstore.guardarAppStore( this.sendModelAppStore ).subscribe({
        next: (x) => {
          Swal.fire({
            title: "App Store guardado exitosamente",
            icon: "success"
          });    
          this._show_spinner = false;  
        }, error: (e) => {
          console.error(e);
          Swal.fire({
            title: "Algo ha ocurrido",
            icon: "error"
          });    
        }, complete: () => {
          this.limpiar();
          this.obtenerAppStores();
        }
      })
    }
  }

  idStore: any;
  catchData(data:any) {
    this.idStore = data.id;
    this.appStoreForm.controls['nombreAppStore'].setValue(data.nombreAppStore)
    this.appStoreForm.controls['observacion'].setValue(data.observacion)
    this.action_button = 'Editar Tienda';
    this.icon_button = 'sync_alt';
  }

  limpiar() {
    this.appStoreForm.controls['nombreAppStore'].setValue('');
    this.appStoreForm.controls['observacion'].setValue('');
    this.action_button = 'Crear Tienda';
    this.icon_button = 'add';
  }

  obtenerAppStores() {
    this.appstore.obtenerAppStore(this.xindex).subscribe({
      next: (x) => {
        this.listaAppStore = x;
        console.warn(this.listaAppStore);
      },
      error: (e) => {
        console.error('Error response:', e);
        if (e.error && e.error.text) {
          console.error('Error text:', e.error.text);
        }
      }
    });
  }

  eliminarAppStore( id:number, i:number ) {
    Swal.fire({
      title: "Estas segur@?",
      text: "Esto causará perdida de información!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.appstore.eliminarAppStore( id ).subscribe({
          next: (X) => {
            Swal.fire({
              title: "Eliminado!",
              text: "App Store ha sido eliminada con éxito.",
              icon: "success"
            });
          }, error: (e) => {
            Swal.fire({
              title: "Algo ha ocurrido",
              text: "Intentémoslo más tarde",
              icon: "error"
            });
          }, complete: () => {
            this.obtenerAppStores();
            this.listaAppStore.splice(i,1);
          }
        })
      }
    });
  }

  actualizarAppStore() {

    this.sendModelAppStore = {
      id: this.idStore,
      nombreAppStore: this.appStoreForm.controls['nombreAppStore'].value,
      usercrea:       this.xindex,
      feccrea:        new Date(),
      observacion:    this.appStoreForm.controls['observacion'].value,
      estado:         1
    }

    if ( this.appStoreForm.controls['nombreAppStore'].value == null || 
         this.appStoreForm.controls['nombreAppStore'].value == undefined ||
         this.appStoreForm.controls['nombreAppStore'].value == '' ||
         this.appStoreForm.controls['nombreAppStore'].value?.toString().length < 1  ) {

      Swal.fire({
        title: "El nombre no puede ir vacío",
        icon: "warning"
      });    
      this._show_spinner = false;

    } else {
      this.appstore.actualizarAppStore( this.idStore, this.sendModelAppStore ).subscribe({
        next: (x) => {
          Swal.fire({
            title: "App Store actualizado exitosamente",
            icon: "success"
          });    
          this._show_spinner = false;  
        }, error: (e) => {
          console.error(e);
          Swal.fire({
            title: "Algo ha ocurrido",
            icon: "error"
          });    
        }, complete: () => {
          this.limpiar();
          this.obtenerAppStores();
        }

      })
    }

  }

}
