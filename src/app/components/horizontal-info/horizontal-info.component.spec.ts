import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalInfoComponent } from './horizontal-info.component';

describe('HorizontalInfoComponent', () => {
  let component: HorizontalInfoComponent;
  let fixture: ComponentFixture<HorizontalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
