import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeadListComponent } from './team-lead-list.component';

describe('TeamLeadListComponent', () => {
  let component: TeamLeadListComponent;
  let fixture: ComponentFixture<TeamLeadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeadListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
