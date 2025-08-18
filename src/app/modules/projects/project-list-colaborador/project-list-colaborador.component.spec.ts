import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListColaboradorComponent } from './project-list-colaborador.component';

describe('ProjectListColaboradorComponent', () => {
  let component: ProjectListColaboradorComponent;
  let fixture: ComponentFixture<ProjectListColaboradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectListColaboradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectListColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
