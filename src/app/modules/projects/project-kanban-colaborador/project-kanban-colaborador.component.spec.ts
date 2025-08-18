import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectKanbanColaboradorComponent } from './project-kanban-colaborador.component';

describe('ProjectKanbanColaboradorComponent', () => {
  let component: ProjectKanbanColaboradorComponent;
  let fixture: ComponentFixture<ProjectKanbanColaboradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectKanbanColaboradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectKanbanColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
