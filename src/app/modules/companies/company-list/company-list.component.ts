// company-list.component.ts
import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../../core/services/EmpresaServices';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {
  empresas: any[] = [];
  filteredEmpresas: any[] = [];
  filterText: string = '';

  displayedColumns = ['id', 'nombre', 'actions'];

  constructor(private empresaService: EmpresaService) {}

  ngOnInit(): void {
    this.loadEmpresas();
  }

  loadEmpresas() {
    this.empresaService.getEmpresas().subscribe(empresas => {
      this.empresas = empresas;
      this.applyFilter();
    });
  }

  applyFilter() {
    const filter = this.filterText.toLowerCase();
    this.filteredEmpresas = this.empresas.filter(e =>
      e.nombre.toLowerCase().includes(filter)
    );
  }

  deleteEmpresa(id: number) {
    if (confirm('¿Estás seguro de eliminar esta empresa?')) {
      this.empresaService.deleteEmpresa(id).subscribe(() => {
        this.loadEmpresas();
      });
    }
  }
}
