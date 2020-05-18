import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPracticasComponent } from './info-practicas.component';

describe('InfoPracticasComponent', () => {
  let component: InfoPracticasComponent;
  let fixture: ComponentFixture<InfoPracticasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPracticasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPracticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
