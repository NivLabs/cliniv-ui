import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoClinicoComponent } from './historico-clinico.component';

describe('HistoricoClinicoComponent', () => {
  let component: HistoricoClinicoComponent;
  let fixture: ComponentFixture<HistoricoClinicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoClinicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoClinicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
