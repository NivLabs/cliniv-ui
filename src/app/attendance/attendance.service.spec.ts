/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AttendanceService } from './attendance.service';

describe('Service: Attendance', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttendanceService]
    });
  });

  it('should ...', inject([AttendanceService], (service: AttendanceService) => {
    expect(service).toBeTruthy();
  }));
});
