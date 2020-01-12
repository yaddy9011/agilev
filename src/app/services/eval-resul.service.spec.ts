import { TestBed } from '@angular/core/testing';

import { EvalResulService } from './eval-resul.service';

describe('EvalResulService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EvalResulService = TestBed.get(EvalResulService);
    expect(service).toBeTruthy();
  });
});
