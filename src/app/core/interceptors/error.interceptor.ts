import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      const message =
        error.status === 0
          ? 'No se pudo conectar con el servidor. Verifique que la API esté en ejecución.'
          : error.error?.message ?? 'Ha ocurrido un error inesperado.';

      console.error(`[HTTP Error] ${req.method} ${req.url}:`, message);

      return throwError(() => ({ status: error.status, message }));
    }),
  );
};
