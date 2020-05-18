import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPasosRoadmapComponent } from './info-pasos-roadmap.component';

describe('InfoPasosRoadmapComponent', () => {
  let component: InfoPasosRoadmapComponent;
  let fixture: ComponentFixture<InfoPasosRoadmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoPasosRoadmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPasosRoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
