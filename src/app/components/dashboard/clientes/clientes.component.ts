import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Password } from 'primeng/password';
import { UserService } from '../services/user.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  
  _show_spinner: boolean = false;
  icon_button: string = 'add';
  action_button: string = 'Crear cliente nuevo';
  _formulario_on: boolean = true;
  iduser:any;
  listaUsuarios: any = [];

  public clientesForm = new FormGroup({
    nombre:    new FormControl(''),
    cedula:    new FormControl(''),
    email:     new FormControl(''),
    password:  new FormControl(''),
    direccion: new FormControl(''),
    edad:      new FormControl(),
    telefono:  new FormControl()
  })
  xindex: any
  ngOnInit(): void {
    this.xindex = sessionStorage.getItem('index');
    this.obtenerUsuarios();
  }

  constructor( private user: UserService ) {}

  onSubmit() {
    switch( this.action_button ) {
      case 'Crear cliente nuevo':
        this.guardarCliente();
        break;
      case 'Editar cliente':
        this.actualizarCliente();
        break;
    }
  }

  sendModelCliente: any = []
  guardarCliente() {
    
    this._show_spinner = true;

    this.sendModelCliente = {
      nombre:   this.clientesForm.controls['nombre'].value,
      password: this.clientesForm.controls['password'].value,
      edad:     this.clientesForm.controls['edad'].value,
      email:    this.clientesForm.controls['email'].value,
      tipo: 2,
      estado: 1,
      direccion: this.clientesForm.controls['direccion'].value, 
      cedula: this.clientesForm.controls['cedula'].value,
      fcrea: new Date(),
      usercrea: this.xindex,
      telefono: this.clientesForm.controls['telefono'].value,
    }

    if ( this.clientesForm.controls['nombre'].value == null || this.clientesForm.controls['nombre'].value == undefined || this.clientesForm.controls['nombre'].value == '' || this.clientesForm.controls['nombre'].value?.toString().length < 1  ) {
      Swal.fire({
        title: "El nombre no puede ir vacío",
        icon: "warning"
      });    
      this._show_spinner = false;  
    } else if ( this.clientesForm.controls['password'].value == null || this.clientesForm.controls['password'].value == undefined || this.clientesForm.controls['password'].value == '' || this.clientesForm.controls['password'].value?.toString().length < 1  ) { 
      Swal.fire({
        title: "La contraseña no puede ir vacío",
        icon: "warning"
      });
      this._show_spinner = false;
    } else {
      this.user.guardarUsuario( this.sendModelCliente ).subscribe({
        next: (x) => {  
          this._show_spinner = false;  
          Swal.fire({
            title: "Cliente creado con éxito",
            icon: "success"
          });
        }, error: (e) => {
          this._show_spinner = false;
          Swal.fire({
            title: "Algo ha ocurrido",
            icon: "error"
          });  
          console.error(e);  
        }, complete: () => {
          this.obtenerUsuarios();
          this.limpiar();
        }
      })
    }

  }

  obtenerUsuarios() {
    this.user.obtenerUsuarios(this.xindex).subscribe({
      next: (x) => {
        this.listaUsuarios = x;
        console.log(this.listaUsuarios);
      }
    })
  }

  eliminarUsuarios(id:number) {
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
        this.user.eliminarUsuario( 0, this.xindex, id ).subscribe({
          next: (X) => {
            Swal.fire({
              title: "Eliminado!",
              text: "Usuario ha sido eliminado con éxito.",
              icon: "success"
            });
          }, error: (e) => {
            Swal.fire({
              title: "Algo ha ocurrido",
              text: "Intentémoslo más tarde",
              icon: "error"
            });
          }, complete: () => {
            this.obtenerUsuarios();
          }
        })

      }
    });
  }

  catchData(user:any) {
    /**---------------------------------------------- */
    this.iduser = user.id
    /**---------------------------------------------- */
    this.clientesForm.controls['nombre']   
        .setValue(user.nombre);
    /**---------------------------------------------- */
    this.clientesForm.controls['password'] 
        .setValue(user.password);
    /**---------------------------------------------- */
    this.clientesForm.controls['edad']
        .setValue(user.edad);
    /**---------------------------------------------- */
    this.clientesForm.controls['email']
        .setValue(user.email);
    /**---------------------------------------------- */
    this.clientesForm.controls['telefono']
        .setValue(user.telefono);
    /**---------------------------------------------- */
    this.clientesForm.controls['direccion']
        .setValue(user.direccion);
    /**---------------------------------------------- */
    this.clientesForm.controls['cedula']
        .setValue(user.cedula);
    /**---------------------------------------------- */
    this.action_button='Editar cliente';
    this.icon_button = 'sync';
    /**---------------------------------------------- */
  }

  actualizarCliente() {    
    this._show_spinner = true;
    this.sendModelCliente = {
      id:        this.iduser,
      nombre:    this.clientesForm.controls['nombre']   .value,
      password:  this.clientesForm.controls['password'] .value,
      edad:      this.clientesForm.controls['edad']     .value,
      email:     this.clientesForm.controls['email']    .value,
      tipo:      2,
      estado:    1,
      direccion: this.clientesForm.controls['direccion'].value, 
      cedula:    this.clientesForm.controls['cedula'].value,
      fcrea:     new Date(),
      usercrea:  this.xindex,
      telefono:  this.clientesForm.controls['telefono'].value,
    }

    if ( this.clientesForm.controls['nombre'].value == null || this.clientesForm.controls['nombre'].value == undefined || this.clientesForm.controls['nombre'].value == '' || this.clientesForm.controls['nombre'].value?.toString().length < 1  ) {
      Swal.fire({
        title: "El nombre no puede ir vacío",
        icon: "warning"
      });    
      this._show_spinner = false;
    } else if ( this.clientesForm.controls['password'].value == null || this.clientesForm.controls['password'].value == undefined || this.clientesForm.controls['password'].value == '' || this.clientesForm.controls['password'].value?.toString().length < 1  ) { 
      Swal.fire({
        title: "La contraseña no puede ir vacío",
        icon: "warning"
      });
      this._show_spinner = false;
    } else {
      this.user.actualizarUsuario( this.iduser, this.sendModelCliente ).subscribe({
        next: (x) => {  
          this._show_spinner = false;  
          Swal.fire({
            title: "Cliente actualizado con éxito",
            icon: "success"
          });
        }, error: (e) => {
          this._show_spinner = false;
          Swal.fire({
            title: "Algo ha ocurrido",
            icon: "error"
          });
  
          console.error(e);
  
        }, complete: () => {
          this.obtenerUsuarios();
          this.limpiar();
        }
      })
    }

  }

  limpiar() {
    this.clientesForm.controls['nombre'].setValue('');
    this.clientesForm.controls['password'].setValue('');
    this.clientesForm.controls['edad'].setValue('');
    this.clientesForm.controls['email'].setValue('');
    this.clientesForm.controls['direccion'].setValue('');
    this.clientesForm.controls['telefono'].setValue('');
    this.clientesForm.controls['cedula'].setValue('');
    this.action_button='Crear cliente nuevo';
    this.icon_button = 'add';
  }



}
