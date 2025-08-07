// projects-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';

const routes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: 'form', component: ProjectFormComponent },
  { 
    path: ':id/kanban', 
    loadComponent: () => import('./project-kanban/project-kanban.component').then(m => m.ProjectKanbanComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
