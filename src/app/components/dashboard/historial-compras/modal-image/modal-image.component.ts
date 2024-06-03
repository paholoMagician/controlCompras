import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HistorialComprasComponent } from '../historial-compras.component';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.scss']
})
export class ModalImageComponent implements OnInit {

  constructor(  public dialogRef: MatDialogRef<HistorialComprasComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
  formattedUrl: any;
  ngOnInit(): void {

    this.formattedUrl = this.data.replace(/ /g, '%20');
    console.log('Esta es la url de la imagen');
    console.log(this.formattedUrl);

  }

}
