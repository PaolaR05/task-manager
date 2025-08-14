import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { EmpresaService } from '../../../core/services/empresaservices';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class CompanyFormComponent implements OnInit {
  companyId: number | null = null;
  companyData = { nombre: '', descripcion: '' };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private empresaService: EmpresaService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.companyId = +params['id'];
        this.empresaService.getEmpresa(this.companyId).subscribe(company => {
          this.companyData = {
            nombre: company.Nombre || '',
            descripcion: company.Descripcion || ''
          };
        });
      }
    });
  }

  saveCompany() {
    if (this.companyId) {
      this.empresaService.updateEmpresa(this.companyId, this.companyData)
        .subscribe(() => this.router.navigate(['/companies']));
    } else {
      this.empresaService.createEmpresa(this.companyData)
        .subscribe(() => this.router.navigate(['/companies']));
    }
  }

  cancel() {
    this.router.navigate(['/companies']);
  }
}
