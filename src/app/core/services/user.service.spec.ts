import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { UserService } from './user.service';
import type { User } from '../models';

const MOCK_USER: User = { id: 1, name: 'Cliente BTG', balance: 500000 };

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.match(() => true);
  });

  it('should start with balance 0 before API responds', () => {
    expect(service.balance()).toBe(0);
  });

  it('should update balance via PATCH and reflect in signal', () => {
    service.updateBalance(425000).subscribe((user) => {
      expect(user.balance).toBe(425000);
    });

    const patchReq = httpMock.expectOne('/user');
    expect(patchReq.request.method).toBe('PATCH');
    expect(patchReq.request.body).toEqual({ balance: 425000 });
    patchReq.flush({ ...MOCK_USER, balance: 425000 });
  });
});
