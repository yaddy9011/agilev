import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public show:boolean = true;

  constructor() { 
    var id_usr = localStorage.getItem("ACCESS_IDS");
    if (id_usr){
      this.show = !this.show;
    }
  }

  ngOnInit() {
  }

}
