import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  // Usa CommonModule en lugar de BrowserModule
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  imports: [
    CommonModule,  // Usamos CommonModule en lugar de BrowserModule
    DashboardRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    FullCalendarModule
  ]
})
export class DashboardModule { }
