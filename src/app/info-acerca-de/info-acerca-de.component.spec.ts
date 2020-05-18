import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAcercaDeComponent } from './info-acerca-de.component';

describe('InfoAcercaDeComponent', () => {
  let component: InfoAcercaDeComponent;
  let fixture: ComponentFixture<InfoAcercaDeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoAcercaDeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAcercaDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
