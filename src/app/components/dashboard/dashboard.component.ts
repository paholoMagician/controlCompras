import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2'
import { UserService } from './services/user.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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
    tienda:        new FormControl(''),
    usuario:        new FormControl(''),
    producto:       new FormControl(''),
    precio:        new FormControl(''),
    precioShein:   new FormControl(''),
  })

  public filtroBalance = new FormGroup({
    filtro:        new FormControl('')
  })
  
  ngOnInit(): void {
    this.cargarDatosDesdeIndexedDB();
    this.validarEmpty();
    this.log.validacion();
  }

  constructor(private log: UserService) { }

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

  eliminarProduto(index:number) {
    console.log(index)
    this.listaComras.splice( index, 1 )
    this.sumatoria();
  }

  onSubmit() {
    console.log('tratando de guardar')

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
      this.guardarCompras();
    }
    
  }

  guardarCompras(  ) {
    this._show_spinner = true;
    const arr:any = {
      usuario:     this.pedidosForm.controls['usuario'].value,
      producto:    this.pedidosForm.controls['producto'].value,
      precio:      this.pedidosForm.controls['precio'].value,
      precioShein: this.pedidosForm.controls['precioShein'].value,
      fechaCrea:   new Date(),
      tienda: this.pedidosForm.controls['tienda'].value
    }

    console.log(arr)

    this.listaComras.unshift(arr);

    this.sumatoria();

    setTimeout(() => {
      this.limpiar()
      this._show_spinner = false;
    }, 500);

  }

  guardarEnIndexedDB(datos: any[]) {
    // Abrir la conexión con la base de datos
    const request = indexedDB.open('ProductosShain', 1);

    request.onerror = function(event:any) {
        console.error("Error al abrir la base de datos:", event.target.error);
    };

    request.onsuccess = function(event:any) {
        const db = event.target.result;
        // Iniciar una transacción de lectura y escritura
        const transaction = db.transaction(['shein_almacen'], 'readwrite');
        // Obtener el almacén de objetos
        const store = transaction.objectStore('shein_almacen');
        // Agregar los datos al almacén
        datos.forEach((dato) => {
            const addRequest = store.add(dato);
            addRequest.onsuccess = function(event:any) {
                console.log("Datos guardados correctamente en IndexedDB.");
            };
            addRequest.onerror = function(event:any) {
                console.error("Error al guardar los datos en IndexedDB:", event.target.error);
            };
        });
    };

    request.onupgradeneeded = function(event:any) {
        const db = event.target.result;

        // Crear un almacén de objetos si no existe
        const store = db.createObjectStore('shein_almacen', { autoIncrement: true });

        console.log("Almacén de objetos creado correctamente.");
    };
}



  sumatoria() {
    this.totalPrecio =0
    this.totalPrecioShein =0
    this.listaComras.filter( (x:any) => {
      this.totalPrecio += x.precio;
      this.totalPrecioShein += x.precioShein;
      this.ganancia = this.totalPrecio - this.totalPrecioShein;
    })

    if( this.listaComras.length == 0 ) this.ganancia = 0;

  }

  totalPrecioBalancePunlico: number = 0;
  totalPrecioBalanceAppShein: number = 0;
  sumatoriaBalance() {
    this.totalPrecioBalancePunlico = 0
    this.totalPrecioBalanceAppShein = 0
    this.listaComrasBalance.filter( (x:any) => {
      this.totalPrecioBalancePunlico  += x.precio;
      this.totalPrecioBalanceAppShein += x.precioShein;
    })
  }

  async obtenerModelosDesdeIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ProductosShain', 1);

        request.onerror = function(event:any) {
            console.error("Error al abrir la base de datos:", event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = async function(event:any) {
            const db = event.target.result;

            const transaction = db.transaction(['shein_almacen'], 'readonly');
            const store = transaction.objectStore('shein_almacen');

            const getRequest = store.getAll();

            getRequest.onsuccess = function(event:any) {
                const data = event.target.result;
                console.log("Datos obtenidos correctamente desde IndexedDB:", data);
                
                console.warn('data========================================');
                console.warn(data);

                // Obtener las claves primarias (keys)
                const keys = data.map((item: any) => item.id); // Suponiendo que la clave primaria se llama 'id'

                console.warn('keys')
                console.warn(keys)

                // Crear un nuevo array de objetos que contienen los datos y las claves primarias
                const dataWithKeys = data.map((item: any, index: number) => {
                    return { data: item, key: keys[index] };
                });

                resolve(dataWithKeys);
            };

            getRequest.onerror = function(event:any) {
                console.error("Error al obtener los datos desde IndexedDB:", event.target.error);
                reject(event.target.error);
            };
        };

        request.onupgradeneeded = function(event:any) {
            const db = event.target.result;

            const store = db.createObjectStore('shein_almacen', { autoIncrement: true });

            console.log("Almacén de objetos creado correctamente.");
        };
    });
}

  async cargarDatosDesdeIndexedDB() {
    this._show_spinner = true;
    try {
        const modelosConKeys: any = await this.obtenerModelosDesdeIndexedDB();
        setTimeout(() => {
            const dataWithKeys = modelosConKeys.map((item: any) => {

                return { data: item.data, key: item.key };
            });

            this.listaComrasBalance = dataWithKeys.map((item: any) => item.data).flat();
            this.listaComrasBalanceGhost = dataWithKeys.map((item: any) => item.data).flat();
            this.cantidadListaCompras = this.listaComrasBalance.length;

            console.warn(this.listaComrasBalance)
            console.warn(this.listaComrasBalanceGhost)

            this.listaComrasBalance.filter( (x:any) => {
                if( x.fechaCrea == undefined || x.fechaCrea == null || x.fechaCrea == '' ) x.fechaCrea = new Date( '2023-03-04' );
                if( x.tienda == undefined || x.tienda == null || x.tienda == '' ) x.tienda = 'ST'
                else if( x.tienda == undefined || x.tienda == null || x.tienda == '' ) x.usuario = 'SU'
                else if( x.precio == undefined || x.precio == null || x.precio == '' ) x.precio = 0
                else if( x.precioShein == undefined || x.precioShein == null || x.precioShein == '' ) x.precioShein = 0
            });

            this.sumatoria();
            this.sumatoriaBalance();
            this._show_spinner = false;
        }, 2000);
    } catch (error) {
        console.error("Error al cargar datos desde IndexedDB:", error);
    }
}

  eliminarDatosBalance(index:number, id: number) {
    this.listaComrasBalance.splice(index, 1);
    this.sumatoriaBalance();
  }

  limpiar() {
    // this.pedidosForm.controls['usuario'].setValue('');
    this.pedidosForm.controls['producto'].setValue('');
    this.pedidosForm.controls['precio'].setValue('');
    this.pedidosForm.controls['precioShein'].setValue('');  
    this.pedidosForm.controls['tienda'].enable();
  }

  limpiarTablaCompras() {
    Swal.fire({
      title: "Estas segura?",
      html: "<span>Esta acción es irreversible y provoca perdida de datos,<strong> ¿ya enviaste el screenshot Mami!!!!!!?</strong></span>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this._show_spinner = true;
        this.guardarEnIndexedDB(this.listaComras);
        setTimeout(() => {
          this.listaComras = [];
          this.totalPrecio = 0
          this.totalPrecioShein = 0;
          this.ganancia = 0;
          this._show_spinner = false;
          Swal.fire({
            title: "Eliminado!",
            text: "Datos de la tabla eliminado exitosamente, te amitoch!!",
            icon: "success"
          });
        }, 2000);
      }
    });

  }

  onSubmitFiltrar() {
    let filter: any = this.filtroBalance.controls['filtro'].value;
    this.listaComrasBalance = this.listaComrasBalanceGhost.filter((item:any) => 
      item.usuario.toLowerCase().includes(filter.toLowerCase()) ||
      item.producto.toLowerCase().includes(filter.toLowerCase()) ||
      item.tienda.toLowerCase().includes(filter.toLowerCase()) 
    );

    this.sumatoriaBalance();

  }

}
