import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2'
import { UserService } from './services/user.service';
import { AppStoreService } from './appstore/services/app-store.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { HttpEventType } from '@angular/common/http';
import { Environments } from '../environments/environments';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  homework: boolean = true;
  viewcli: boolean = false;
  viewappstore: boolean = false;
  viewhistory: boolean = false;
  viewCuentasCobrar: boolean = false;

  tiendas: any = [{
    id: 1,
    nombre: 'Amazon'
  },{
    id: 2,
    nombre: 'Shein'
  }, {
    id: 3,
    nombre: 'Ebay'
  }]

  listaComrasBalance:      any     = [];
  listaComrasBalanceGhost: any     = [];
  cantidadListaCompras:    number  = 0;
  _show_spinner:           boolean = false;
  _formulario_on:          boolean = true;
  _formulario_balance:     boolean = false;
  sumatoriaGanacia:        number  = 0;
  listaComras:             any     = [];

  totalPrecio: number = 0;
  totalPrecioShein: number = 0;
  ganancia: number = 0;

  public pedidosForm = new FormGroup({
    tienda:         new FormControl(''),
    usuario:        new FormControl(''),
    producto:       new FormControl(''),
    precio:         new FormControl(''),
    precioShein:    new FormControl(''),
    productoScreen: new FormControl()
  })

  public filtroBalance = new FormGroup({
    filtro:        new FormControl('')
  })

  xindex:any;
  ngOnInit(): void {
    this.xindex = sessionStorage.getItem('index');    
    this.obtenerAppStores();    
    this.validarEmpty();
    this.log.validacion();
    this.obtenerUsuarios();
  }

  constructor( private log: UserService, private appstore: AppStoreService, private storageService: StorageService, private env: Environments) { }

  validarEmpty() {
    if( this.pedidosForm.controls['tienda'].value == undefined || this.pedidosForm.controls['tienda'].value == null || this.pedidosForm.controls['tienda'].value == '' ) {
      this.pedidosForm.controls['usuario'].disable();
      this.pedidosForm.controls['producto'].disable();
      this.pedidosForm.controls['precio'].disable();
      this.pedidosForm.controls['precioShein'].disable();
    } else {
      this.pedidosForm.controls['usuario'].enable();
      this.pedidosForm.controls['producto'].enable();
      this.pedidosForm.controls['precio'].enable();
      this.pedidosForm.controls['precioShein'].enable();
      this.pedidosForm.controls['tienda'].disable();
    }
  }

  archivoSeleccionado: File | null = null;

  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }
  
  calculoGanancia() {
    this.ganancia = Number(this.pedidosForm.controls['precio'].value) - Number(this.pedidosForm.controls['precioShein'].value);
  }

  uploadFile() {

    this._show_spinner = true;

    if (!this.archivoSeleccionado) {
      console.error('Ningún archivo seleccionado');
      this._show_spinner = false;
      return;
    }
  
    // Obtener el nombre del archivo seleccionado
    const nombreArchivoOriginal = this.archivoSeleccionado.name;
  
    let x: any = this.pedidosForm.controls['usuario'].value?.toString();
    this.storageService.subirArchivo(x, this.archivoSeleccionado).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          // console.log('Archivo subido exitosamente');
          // console.log(event);  
          // Llamar a guardarProducto con el nombre del archivo formateado
          this.guardarProducto(nombreArchivoOriginal);
          this._show_spinner = false;
        }
      },
      error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }
    });
  }

modelProductoSend: any = [];
guardarProducto(nombreArchivo: string) {    
  let x: any = this.pedidosForm.controls['usuario'].value;
  const baseUrl: any = this.env.apingRok+'/storage/'+x+'/';
  let tienda: any = this.pedidosForm.controls['tienda'].value;
  this.modelProductoSend = {
    "idusuario": this.xindex,
    "idcliente": x,
    "tienda": tienda,
    "nombreProducto": this.pedidosForm.controls['producto'].value,
    "precioacliente": this.pedidosForm.controls['precio'].value,
    "preciodeapp": this.pedidosForm.controls['precioShein'].value,
    "urlimagen": nombreArchivo,
    "estado": 0,
    "fecrea": new Date()
  }

  if( this.pedidosForm.controls['tienda'].value == undefined || this.pedidosForm.controls['tienda'].value == null || this.pedidosForm.controls['tienda'].value == '' ) {
    Swal.fire({
      title: "Campo tienda vacío",
      icon: "warning"
    });
  }

  else if( this.pedidosForm.controls['usuario'].value == undefined || this.pedidosForm.controls['usuario'].value == null || this.pedidosForm.controls['usuario'].value == '' ) {
    Swal.fire({
      title: "Campo usuario vacío",
      icon: "warning"
    });
  }
  
  else if ( this.pedidosForm.controls['producto'].value == undefined || this.pedidosForm.controls['producto'].value == null || this.pedidosForm.controls['producto'].value == '' ) {
    Swal.fire({
      title: "Campo producto vacío",
      icon: "warning"
    });
  }

  else if ( this.pedidosForm.controls['precio'].value == undefined || this.pedidosForm.controls['precio'].value == null || this.pedidosForm.controls['precio'].value == '' ) {
    Swal.fire({
      title: "Campo precio vacío",
      icon: "warning"
    });
  }

  else if ( this.pedidosForm.controls['precioShein'].value == undefined || this.pedidosForm.controls['precioShein'].value == null || this.pedidosForm.controls['precioShein'].value =='' ) {
    Swal.fire({
      title: "Campo precio shein vacío",
      icon: "warning"
    });
  } else {
    // Aquí podrías realizar una llamada a tu servicio para guardar el producto
    this.storageService.guardarProducto(this.modelProductoSend).subscribe({
      next: (x) => {
        Swal.fire({
          title: "Producto guardado",
          icon: "success"
        });
      }, error: (e) => {
        Swal.fire({
          title: "No se ha podido guardar el producto",
          icon: "error"
        });
        console.error(e);
      }, complete: () => {
        this.obtenerProductos(0);
        this.limpiar()
        this.ganancia = 0;
      }
    });
  }
}
  modulo: any;
  recibirModulos(event:any) {
    this.modulo = event;
    console.log(event);
    switch( this.modulo.cod ) {
      case 0:
        this.homework     = true;
        this.viewcli      = false;
        this.viewappstore = false;
        this.viewhistory  = false;
        this.viewCuentasCobrar  = false;
        break;
      case 1:
        this.viewcli      = true;
        this.homework     = false;
        this.viewappstore = false;
        this.viewhistory  = false;
        this.viewCuentasCobrar  = false;
        break; 
      case 2:
        this.viewcli      = false;
        this.homework     = false;
        this.viewappstore = true;
        this.viewhistory  = false;
        this.viewCuentasCobrar  = false;
        break;
      case 3:
        this.viewcli      = false;
        this.homework     = false;
        this.viewappstore = false;
        this.viewhistory  = true;
        this.viewCuentasCobrar  = false;
        break;
      case 4:
        this.viewcli      = false;
        this.homework     = false;
        this.viewappstore = false;
        this.viewhistory  = false;
        this.viewCuentasCobrar  = true;
        break;
    }
  }

  listaAppStore:any = [];
  obtenerAppStores() {
    this.appstore.obtenerAppStore(this.xindex).subscribe({
      next: (x) => {
        this.listaAppStore =x;
      }, error: (e) => {
        console.error(e);
      }
    })
  }
  
  listaUsuarios: any = [];
  obtenerUsuarios() {
    this.log.obtenerUsuarios(this.xindex).subscribe({
      next: (x) => {
        this.listaUsuarios = x;
      }
    })
  }

  updateEstadosProductos() {
    let x: any = this.pedidosForm.controls['usuario'].value;
    Swal.fire({
      title: "Estas segura?",
      html: "<span>Limpiar la tabla enviara a los productos al estado de compra efectuada, puedes revisarlo en el historial</span>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, limpiar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;
        // this.guardarEnIndexedDB(this.listaComras);
        this.storageService.actualizarEstadosProductos( 1, this.xindex, x ).subscribe({
          next: (x) => {
            this.obtenerProductos(0);
          }, error: (e) => {
            console.error(e);
            this._show_spinner = false;
            Swal.fire({
              title: "Oops!",
              text: "Algo ha sucedido con la red, intentalo más tarde o llame al desarrollador",
              icon: "error"
            });
          }, complete: () => {
            this._show_spinner = false;
            Swal.fire({
              title: "Limpiado!",
              text: "El estado de los productos ha sido cambiados a comprado",
              icon: "success"
            });
            this.totalPrecio = 0;
          }
        })    
      }
    });
    
  }


  onSubmit() {
    this.uploadFile();
  }

  obtenerProductos(estado:number) {
    this.listaComras = [];
    let x: any = this.pedidosForm.controls['usuario'].value;
    if( x != undefined || x != null || x != '' ) {
      this.storageService.obtenerProductos( this.xindex, x, estado ).subscribe({
        next: (x) => {  
          console.log('Estos son los productos obtenidos')
          console.log(x)
          this.listaComras = x;
        }, error: (e) => {
          console.error(e);
        }, complete: () => {
          this.sumatoria()        
        }
      })

    }

  }

  sumatoria() {
    this.totalPrecio = 0;
    this.listaComras.filter( (x:any) => {
      this.totalPrecio += x.precioacliente;
    })
  }

  eliminarProductoCliente( id:number, index: number, precio: number ) {

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
        this.storageService.eliminarProductoCliente( id ).subscribe({
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
            this.listaComras.splice(index, 1);
            this.totalPrecio = Number(this.totalPrecio) - precio;
            // this.sumatoria();
          }
        })
      }
    });
  }

  limpiar() {
    this.pedidosForm.controls['producto'].setValue('');
    this.pedidosForm.controls['precio'].setValue('');
    this.pedidosForm.controls['precioShein'].setValue('');  
    this.pedidosForm.controls['tienda'].enable();
    // Limpiar el input file
    this.fileInput.nativeElement.value = '';
  }

  // limpiarTablaCompras() {
  //   Swal.fire({
  //     title: "Estas segura?",
  //     html: "<span>Esta acción es irreversible y provoca perdida de datos,<strong> ¿ya enviaste el screenshot Mami!!!!!!?</strong></span>",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Sí, eliminar!"
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this._show_spinner = true;
  //       // this.guardarEnIndexedDB(this.listaComras);
  //       setTimeout(() => {
  //         this.listaComras = [];
  //         this.totalPrecio = 0
  //         this.totalPrecioShein = 0;
  //         this.ganancia = 0;
  //         this._show_spinner = false;
  //         Swal.fire({
  //           title: "Eliminado!",
  //           text: "Datos de la tabla eliminado exitosamente, te amitoch!!",
  //           icon: "success"
  //         });
  //       }, 2000);
  //     }
  //   });

  // }

  onSubmitFiltrar() {
    let filter: any = this.filtroBalance.controls['filtro'].value;
    this.listaComrasBalance = this.listaComrasBalanceGhost.filter((item:any) => 
      item.usuario.toLowerCase().includes(filter.toLowerCase()) ||
      item.producto.toLowerCase().includes(filter.toLowerCase()) ||
      item.tienda.toLowerCase().includes(filter.toLowerCase()) 
    );

    // this.sumatoriaBalance();

  }

}
