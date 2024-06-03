import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Environments } from '../../environments/environments';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AppStoreService } from '../appstore/services/app-store.service';
import { CuentasService } from './services/cuentas.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cuentas-por-cobrar',
  templateUrl: './cuentas-por-cobrar.component.html',
  styleUrls: ['./cuentas-por-cobrar.component.scss']
})
export class CuentasPorCobrarComponent {

  _show_spinner: boolean = false;
  icon_button: string = 'add';
  action_button: string = 'Crear cuenta por cobrar';
  _formulario_on: boolean = true;
  iduser:any;
  pvpabono:number = 0;
  pvpabonototal:number = 0;
  pvp: number = 0;
  pvptotal: number = 0;
  pvpsaldo: number = 0;
  pvt: number = 0;
  cancel_button: boolean = false;
  listaComras: any = [];
  modelSendCuentasPorCobrar: any = [];
  listaUsuarios: any = [];
  idcuentacobro:any;
  listaCuantasCobrar: any = [];

  public CuentasPorCobrarForm = new FormGroup({
    idcli:         new FormControl(''),
    idproducto:    new FormControl(''),
    avance:        new FormControl(''),
    observacion:   new FormControl(''),
    saldo:   new FormControl(0)
  })
  
  xindex: any
  ngOnInit(): void {
    this.xindex = sessionStorage.getItem('index');
    this.obtenerUsuarios();
    this.CuentasPorCobrarForm.controls['saldo'].disable()
    this.obtenerCuentasCobrar();
  }

  constructor( private log:            UserService, 
               private appstore:       AppStoreService,
               private storageService: StorageService,
               private cuentas:        CuentasService,
               private env:            Environments ) { }

  onSubmit() {
    switch( this.icon_button ) {
      case 'add':
        this.guardarCuentasPorCobrar();
        break;
      case 'sync_alt':
        this.actualizarCuentasCobrar();
        break;
    }
  }

  eliminarCuentasCobrar( id:number, index:number, abono:number, precio: number, saldo: number ) {
    Swal.fire({
      title: "Estas segura?",
      html: "<span>Esta acción es irreversible y provoca perdida de datos</span>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, sacarlo de la lista!"
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;
        // this.guardarEnIndexedDB(this.listaComras);
        this.cuentas.eliminarCuentasCobrar(id).subscribe({
          next: (x) => {
            this._show_spinner = false;
            Swal.fire({
              title: "Eliminado!",
              text: "Producto eliminado exitosamente",
              icon: "success"
            });  
          }, error: (e) => {
            this._show_spinner = false;
            console.error(e)
          }, complete: () => {
            // this.obtenerProductos(0);
            this.listaCuantasCobrar.splice(index, 1);
            // this.totalPrecio = Number(this.totalPrecio) - precio;
            // this.sumatoria();
            this.pvptotal = this.pvptotal - precio;
            this.pvpabonototal = this.pvpabonototal - abono
            this.pvpsaldo = this.pvpsaldo - saldo;
          }
        })
      }
    });
  }

  calculoSaldos() {
    
    this.pvptotal = 0;
    this.pvpabonototal = 0;
    this.pvpsaldo = 0;

    this.listaCuantasCobrar.filter( (c:any) => {
        this.pvptotal += c.precioacliente; 
        this.pvpabonototal += c.avance;
        this.pvpsaldo += c.saldo;
      } 
    )
    
  }

  filterInitit:any;
  filterHistory () {
    this.listaCuantasCobrar = this.listaCuantasCobrarGhost.filter((item:any) => 
      item.nombre.toLowerCase().includes(this.filterInitit.toLowerCase()) ||
      item.nombreProducto.toLowerCase().includes(this.filterInitit.toLowerCase()) ||
      item.estadoPago.toLowerCase().includes(this.filterInitit.toLowerCase())
    );
    this.calculoSaldos();
  }

  actualizarCuentasCobrar() {

    this.modelSendCuentasPorCobrar = {
      id : this.idcuentacobro,
      idcli: this.CuentasPorCobrarForm.controls['idcli'].value,
      idproducto: this.CuentasPorCobrarForm.controls['idproducto'].value,
      avance: this.CuentasPorCobrarForm.controls['avance'].value,
      observacion: this.CuentasPorCobrarForm.controls['observacion'].value,
      estado: 1,
      fecrea: new Date(),
      usercrea: this.xindex
    }    

    console.log(this.modelSendCuentasPorCobrar);

    if( this.CuentasPorCobrarForm.controls['idcli'].value == undefined || this.CuentasPorCobrarForm.controls['idcli'].value == null || this.CuentasPorCobrarForm.controls['idcli'].value == '' ) {
      Swal.fire({
        title: "Campo cliente vacío",
        icon: "warning"
      });
    } else if ( this.CuentasPorCobrarForm.controls['idproducto'].value == undefined || this.CuentasPorCobrarForm.controls['idproducto'].value == null || this.CuentasPorCobrarForm.controls['idproducto'].value == '' ) {
      Swal.fire({
        title: "Campo producto vacío",
        icon: "warning"
      });
    } else if ( this.CuentasPorCobrarForm.controls['avance'].value == undefined || this.CuentasPorCobrarForm.controls['avance'].value == null ) {
      Swal.fire({
        title: "Campo avance vacío",
        icon: "warning"
      });
    } else {
      this.cuentas.actualizarCuentasCobrar( this.idcuentacobro, this.modelSendCuentasPorCobrar ).subscribe({
        next: (x) => {
          Swal.fire({
            title: "Actualizado con exitoso",
            icon: "success"
          });
        }, error: (e) => {
          console.error(e);
          Swal.fire({
            title: "Oops, algo  ha pasado!",
            icon: "error"
          });
        }, complete: () => {
          this.limpiar();
          this.obtenerCuentasCobrar();
        }
      })
    }

  }

  guardarCuentasPorCobrar() {

    this.modelSendCuentasPorCobrar = {
      idcli: this.CuentasPorCobrarForm.controls['idcli'].value,
      idproducto: this.CuentasPorCobrarForm.controls['idproducto'].value,
      avance: this.CuentasPorCobrarForm.controls['avance'].value,
      observacion: this.CuentasPorCobrarForm.controls['observacion'].value,
      estado: 1,
      fecrea: new Date(),
      usercrea: this.xindex     
    }

    if( this.CuentasPorCobrarForm.controls['idcli'].value == undefined || this.CuentasPorCobrarForm.controls['idcli'].value == null || this.CuentasPorCobrarForm.controls['idcli'].value == '' ) {
      Swal.fire({
        title: "Campo cliente vacío",
        icon: "warning"
      });
    } else if ( this.CuentasPorCobrarForm.controls['idproducto'].value == undefined || this.CuentasPorCobrarForm.controls['idproducto'].value == null || this.CuentasPorCobrarForm.controls['idproducto'].value == '' ) {
      Swal.fire({
        title: "Campo producto vacío",
        icon: "warning"
      });
    } else if ( this.CuentasPorCobrarForm.controls['avance'].value == undefined || this.CuentasPorCobrarForm.controls['avance'].value == null ) {
      Swal.fire({
        title: "Campo avance vacío",
        icon: "warning"
      });
    } else {
      this.cuentas.guardarCuentasCobrar( this.modelSendCuentasPorCobrar ).subscribe({
        next: (x) => {
          Swal.fire({
            title: "Guardado exitoso",
            icon: "success"
          });
        }, error: (e) => {
          console.error(e);
        }, complete: () => {
          this.limpiar();
          this.obtenerCuentasCobrar();
        }
      })
    }

  }
  
  catchtData(data:any) {

    this.idcuentacobro = data.id;
    this.CuentasPorCobrarForm.controls['idcli']      .setValue(data.idcli);
    this.CuentasPorCobrarForm.controls['observacion'].setValue(data.observacion);
    this.CuentasPorCobrarForm.controls['idproducto'] .setValue(data.idproducto);
    this.CuentasPorCobrarForm.controls['avance']     .setValue(data.avance);
    this.obtenerProductos(1)

    setTimeout(() => {
      this.obtenerValorProductos()
      this.calculoSaldo();
    }, 750);

    this.action_button = 'Actualizar cuenta por cobrar';
    this.icon_button   = 'sync_alt';
    this.cancel_button = true;
    this.pvp = data.precioacliente;
    this.pvt = data.preciodeapp;

  }

  obtenerUsuarios() {
    this.log.obtenerUsuarios(this.xindex).subscribe({
      next: (x) => {
        this.listaUsuarios = x;
      }, error: (e) => {
        console.error(e);
      }
    })
  }

  obtenerProductos(estado:number) {
    this.listaComras = [];
    let x: any = this.CuentasPorCobrarForm.controls['idcli'].value;
    if( x != undefined || x != null || x != '' ) {
      this.storageService.obtenerProductos( this.xindex, x, estado )
          .subscribe({
          next: (x) => {
            this.listaComras = x;
          }, error: (e) => {
            console.error(e);
          }
      })
    }
  }

  obtenerValorProductos() {
    let idprod = this.CuentasPorCobrarForm.controls['idproducto'].value;
    this.listaComras.filter( (x:any) => {
      if ( x.id == idprod ) {
        this.pvp = x.precioacliente;
        this.pvt = x.preciodeapp;
      }
    })
  }

  listaCuantasCobrarGhost: any = [];
  obtenerCuentasCobrar() {
    this.cuentas.obtenerCuentasCobrar( this.xindex ).subscribe({
      next: (x) => {
        this.listaCuantasCobrar = x;
        this.listaCuantasCobrarGhost = x;
        console.warn('//////////////////////////');
        console.warn(this.listaCuantasCobrar);
        console.warn('//////////////////////////');
      }, error: (e) => {
        console.error(e);
      }, complete: () => {
        this.calculoSaldos();
      }
    })
  }

  calculoSaldo() {
    let saldo:number = this.pvp - Number(this.CuentasPorCobrarForm.controls['avance'].value);
    this.CuentasPorCobrarForm.controls['saldo'].setValue(saldo);
  }

  limpiar() {
    this.CuentasPorCobrarForm.controls['idcli']      .setValue('');
    this.CuentasPorCobrarForm.controls['idproducto'] .setValue('');
    this.CuentasPorCobrarForm.controls['avance']     .setValue('');
    this.CuentasPorCobrarForm.controls['observacion'].setValue('');
    this.CuentasPorCobrarForm.controls['saldo']      .setValue(0);
    this.action_button = 'Crear cuenta por cobrar';
    this.icon_button   = 'add';
    this.cancel_button = false;
    this.pvp = 0;
    this.pvt = 0;
  }

}
