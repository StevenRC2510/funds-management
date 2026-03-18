import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';

import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should pass through successful requests', () => {
    const spy = vi.fn();
    http.get('/test').subscribe(spy);

    httpMock.expectOne('/test').flush({ data: true });
    expect(spy).toHaveBeenCalledWith({ data: true });
  });

  it('should transform server errors with custom message', () => {
    const errorSpy = vi.fn();
    http.get('/test').subscribe({ error: errorSpy });

    httpMock.expectOne('/test').flush(null, { status: 500, statusText: 'Server Error' });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 500, message: 'Ha ocurrido un error inesperado.' }),
    );
  });

  it('should show connection error message for status 0', () => {
    const errorSpy = vi.fn();
    http.get('/test').subscribe({ error: errorSpy });

    httpMock.expectOne('/test').error(new ProgressEvent('error'), { status: 0 });

    expect(errorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 0,
        message: 'No se pudo conectar con el servidor. Verifique que la API esté en ejecución.',
      }),
    );
  });
});
