import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number | null;
  name: string | null;
  email: string | null;
  rol: string | null;
  empresaId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5167/api/auth';
  public userSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

login(email: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
    tap((res: any) => {
      localStorage.setItem('token', res.token);
      this.userSubject.next(res.usuario);
    })
  );
}


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('empresaId');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getEmpresaId(): number | null {
  const user = this.getUserFromToken();
  return user?.empresaId ?? null;
}

  getCurrentUserId(): number | null {
    const user = this.getUserFromToken();
    return user?.id || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload: any = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null,
        name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null,
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null,
        rol: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null,
        empresaId: payload['empresaId'] != null ? Number(payload['empresaId']) : null
      };
    } catch (e) {
      console.error('Error leyendo token:', e);
      return null;
    }
  }
}
