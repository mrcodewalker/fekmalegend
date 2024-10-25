import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsManagementsComponent } from './subjects-managements.component';

describe('SubjectsManagementsComponent', () => {
  let component: SubjectsManagementsComponent;
  let fixture: ComponentFixture<SubjectsManagementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectsManagementsComponent]
    });
    fixture = TestBed.createComponent(SubjectsManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
