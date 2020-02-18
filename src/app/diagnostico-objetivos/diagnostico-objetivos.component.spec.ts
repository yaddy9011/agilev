import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticoObjetivosComponent } from './diagnostico-objetivos.component';

describe('DiagnosticoObjetivosComponent', () => {
  let component: DiagnosticoObjetivosComponent;
  let fixture: ComponentFixture<DiagnosticoObjetivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosticoObjetivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticoObjetivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
