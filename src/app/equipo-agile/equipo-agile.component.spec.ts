import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipoAgileComponent } from './equipo-agile.component';

describe('EquipoAgileComponent', () => {
  let component: EquipoAgileComponent;
  let fixture: ComponentFixture<EquipoAgileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipoAgileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipoAgileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
