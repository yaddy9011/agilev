import { TestBed } from '@angular/core/testing';

import { CrudGoService } from './crud-go.service';

describe('CrudGoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrudGoService = TestBed.get(CrudGoService);
    expect(service).toBeTruthy();
  });
});
