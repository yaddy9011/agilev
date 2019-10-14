import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Gobjetivo } from '../clases/gobjetivos';
import { CrudGoService } from '../services/crud-go.service';


@Component({
  selector: 'app-gestion-objetivos',
  templateUrl: './gestion-objetivos.component.html',
  styleUrls: ['./gestion-objetivos.component.css']
})
export class GestionObjetivosComponent implements OnInit {

  public displayedColumns = ['descrip', 'clave'];

  public dataSource = new MatTableDataSource<Gobjetivo>();

  constructor(private ObjCrudService: CrudGoService) { }

  ngOnInit() {
    this.getAllObj();
    console.log(this.displayedColumns);
    console.log(this.dataSource);
  }

  public getAllObj = () => {
    this.ObjCrudService.getObjetivos()
    .subscribe(res => {
      this.dataSource.data = res as Gobjetivo[];
    })
  }

}
