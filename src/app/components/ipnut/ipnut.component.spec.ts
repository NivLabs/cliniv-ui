import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpnutComponent } from './ipnut.component';

describe('IpnutComponent', () => {
  let component: IpnutComponent;
  let fixture: ComponentFixture<IpnutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpnutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpnutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
