// projects-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectListColaboradorComponent } from './project-list-colaborador/project-list-colaborador.component';
import { ProjectKanbanColaboradorComponent } from './project-kanban-colaborador/project-kanban-colaborador.component';

const routes: Routes = [
  { path: '', component: ProjectListComponent },
  { path: 'form', component: ProjectFormComponent },
  { 
    path: ':id/kanban', 
    loadComponent: () => import('./project-kanban/project-kanban.component').then(m => m.ProjectKanbanComponent)
  },

  { path: 'colaborador/lista', component: ProjectListColaboradorComponent },
  { path: 'colaborador/:id/kanban', component: ProjectKanbanColaboradorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
