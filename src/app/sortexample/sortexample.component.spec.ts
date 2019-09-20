import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortexampleComponent } from './sortexample.component';

describe('SortexampleComponent', () => {
  let component: SortexampleComponent;
  let fixture: ComponentFixture<SortexampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortexampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortexampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
