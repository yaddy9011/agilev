import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnosticoAreasComponent } from './diagnostico-areas.component';

describe('DiagnosticoAreasComponent', () => {
  let component: DiagnosticoAreasComponent;
  let fixture: ComponentFixture<DiagnosticoAreasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosticoAreasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnosticoAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
