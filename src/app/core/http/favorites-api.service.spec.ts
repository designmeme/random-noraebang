import { TestBed } from '@angular/core/testing';

import { FavoritesApiService } from './favorites-api.service';

describe('FavoritesApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavoritesApiService = TestBed.get(FavoritesApiService);
    expect(service).toBeTruthy();
  });
});
