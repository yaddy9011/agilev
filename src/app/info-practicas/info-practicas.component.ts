import { Component, OnInit } from '@angular/core';
import { CrudGpService } from '../services/crud-gp.service';
import { Gpractica } from '../clases/gpracticas';

@Component({
  selector: 'app-info-practicas',
  templateUrl: './info-practicas.component.html',
  styleUrls: ['./info-practicas.component.css']
})
export class InfoPracticasComponent implements OnInit {
  Practicas: Gpractica[];
  constructor(private CrudGpService: CrudGpService) {
    this.GetPracticas();
  }
  ngOnInit() {
  }
  GetPracticas() {
    this.CrudGpService.GetPracticas()
      .subscribe(res => {
        this.Practicas = res;
      });
  }

  
  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }



}
