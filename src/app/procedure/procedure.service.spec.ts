/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProcedureService } from './procedure.service';

describe('Service: Procedure', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProcedureService]
    });
  });

  it('should ...', inject([ProcedureService], (service: ProcedureService) => {
    expect(service).toBeTruthy();
  }));
});
