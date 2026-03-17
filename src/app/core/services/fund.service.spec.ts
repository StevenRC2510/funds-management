import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { FundService } from './fund.service';

describe('FundService', () => {
  let service: FundService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FundService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.match(() => true);
  });

  it('should start with empty funds before API responds', () => {
    expect(service.funds()).toEqual([]);
  });

  it('should compute fpvFunds as empty initially', () => {
    expect(service.fpvFunds()).toEqual([]);
  });

  it('should compute ficFunds as empty initially', () => {
    expect(service.ficFunds()).toEqual([]);
  });

  it('should filter funds by category ALL returns empty initially', () => {
    expect(service.fundsByCategory('ALL')).toEqual([]);
    expect(service.fundsByCategory('FPV')).toEqual([]);
    expect(service.fundsByCategory('FIC')).toEqual([]);
  });
});
