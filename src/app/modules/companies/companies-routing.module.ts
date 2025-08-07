import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyFormComponent } from './company-form/company-form.component';

const routes: Routes = [
  { path: '', component: CompanyListComponent },       // /companies
  { path: 'form', component: CompanyFormComponent },    // /companies/form
  { path: 'form/:id', component: CompanyFormComponent } // /companies/form/:id
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule {}
