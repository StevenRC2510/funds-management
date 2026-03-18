import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { apiBaseUrlInterceptor } from './api-base-url.interceptor';

describe('apiBaseUrlInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiBaseUrlInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should prepend base URL to relative paths', () => {
    http.get('/funds').subscribe();
    const req = httpMock.expectOne((r) => r.url.includes('/funds'));
    expect(req.request.url).toBe('http://localhost:3000/funds');
    req.flush([]);
  });

  it('should not modify absolute URLs', () => {
    http.get('https://external-api.com/data').subscribe();
    const req = httpMock.expectOne('https://external-api.com/data');
    expect(req.request.url).toBe('https://external-api.com/data');
    req.flush({});
  });
});
