import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAsignadoComponent } from './project-asignado.component';

describe('ProjectAsignadoComponent', () => {
  let component: ProjectAsignadoComponent;
  let fixture: ComponentFixture<ProjectAsignadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectAsignadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectAsignadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
