import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoresManagementComponent } from './scores-management.component';

describe('ScoresManagementComponent', () => {
  let component: ScoresManagementComponent;
  let fixture: ComponentFixture<ScoresManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScoresManagementComponent]
    });
    fixture = TestBed.createComponent(ScoresManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
