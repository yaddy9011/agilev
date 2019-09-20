import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sortexample',
  templateUrl: './sortexample.component.html',
  styleUrls: ['./sortexample.component.css']
})
export class SortexampleComponent implements OnInit {

  eventUpdateCounter = 0;

  list = [
    { Caption: 'Order', SortOrder: null },
    { Caption: 'Me', SortOrder: null },
   ]

   list2=[ { Caption: 'Right', SortOrder: null },
    { Caption: 'The', SortOrder: null },
    { Caption: 'Into', SortOrder: null },
    { Caption: 'Put', SortOrder: null }]


  
  constructor() { }

  ngOnInit() {
  }

  public end(){
    console.log(this.list.map((m, i, l) => {m.SortOrder = i; return m;}))
  }

public eventOptions = {
  onUpdate: () => this.eventUpdateCounter ++,
  draggable: '.draggable',
  group: 'group'
};
  

}
