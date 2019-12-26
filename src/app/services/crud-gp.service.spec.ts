import { TestBed } from '@angular/core/testing';

import { CrudGpService } from './crud-gp.service';

describe('CrudGpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrudGpService = TestBed.get(CrudGpService);
    expect(service).toBeTruthy();
  });
});
