import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvenantComponent } from './convenant.component';

describe('ConvenantComponent', () => {
  let component: ConvenantComponent;
  let fixture: ComponentFixture<ConvenantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvenantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
