import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBalanceComponent } from './filtro-balance.component';

describe('FiltroBalanceComponent', () => {
  let component: FiltroBalanceComponent;
  let fixture: ComponentFixture<FiltroBalanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltroBalanceComponent]
    });
    fixture = TestBed.createComponent(FiltroBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
