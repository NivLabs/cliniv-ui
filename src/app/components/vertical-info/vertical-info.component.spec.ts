import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalInfoComponent } from './vertical-info.component';

describe('VerticalInfoComponent', () => {
  let component: VerticalInfoComponent;
  let fixture: ComponentFixture<VerticalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerticalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
