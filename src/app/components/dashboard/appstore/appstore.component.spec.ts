import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppstoreComponent } from './appstore.component';

describe('AppstoreComponent', () => {
  let component: AppstoreComponent;
  let fixture: ComponentFixture<AppstoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppstoreComponent]
    });
    fixture = TestBed.createComponent(AppstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
