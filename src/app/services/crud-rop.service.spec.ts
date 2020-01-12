import { TestBed } from '@angular/core/testing';

import { CrudRopService } from './crud-rop.service';

describe('CrudRopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrudRopService = TestBed.get(CrudRopService);
    expect(service).toBeTruthy();
  });
});
