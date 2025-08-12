import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.services';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService); 
  const token = auth.getToken();

  console.log('Token enviado:', token);  // Log del token para depuración

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);  // Si hay un token, modificamos la solicitud
  } else {
    console.log('No se encontró token. Continuando sin modificar la solicitud.');
  }

  return next(req);  // Si no hay token, dejamos la solicitud tal cual
};
