import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionOpComponent } from './relacion-op.component';

describe('RelacionOpComponent', () => {
  let component: RelacionOpComponent;
  let fixture: ComponentFixture<RelacionOpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelacionOpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelacionOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
