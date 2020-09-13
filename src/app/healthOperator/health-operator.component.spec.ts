import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthOperatorComponent } from './health-operator.component';

describe('HealthOperatorComponent', () => {
  let component: HealthOperatorComponent;
  let fixture: ComponentFixture<HealthOperatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthOperatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
