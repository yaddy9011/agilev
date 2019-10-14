import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionObjetivosComponent } from './gestion-objetivos.component';

describe('GestionObjetivosComponent', () => {
  let component: GestionObjetivosComponent;
  let fixture: ComponentFixture<GestionObjetivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionObjetivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionObjetivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
