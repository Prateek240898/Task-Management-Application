import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeadFormComponent } from './team-lead-form.component';

describe('TeamLeadFormComponent', () => {
  let component: TeamLeadFormComponent;
  let fixture: ComponentFixture<TeamLeadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeadFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
