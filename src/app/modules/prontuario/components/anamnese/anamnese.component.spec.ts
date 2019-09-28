import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnamneseComponent } from './anamnese.component';

describe('AnamneseComponent', () => {
  let component: AnamneseComponent;
  let fixture: ComponentFixture<AnamneseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnamneseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnamneseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
