import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPracticasComponent } from './gestion-practicas.component';

describe('GestionPracticasComponent', () => {
  let component: GestionPracticasComponent;
  let fixture: ComponentFixture<GestionPracticasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionPracticasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPracticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
