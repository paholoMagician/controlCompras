import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-side',
  templateUrl: './nav-side.component.html',
  styleUrls: ['./nav-side.component.scss']
})
export class NavSideComponent implements OnInit {

  xnombre: string = 'Bienvenid@'

  ngOnInit(): void {
      
    const x: any = sessionStorage.getItem('nombre');
    this.xnombre = x;

  }

}
