import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Song} from '../models';

const API_URL = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  get(url: string, options?): Observable<any> {
    return this.http.get(`${API_URL}${url}`, options);
  }

  getRandomSong(): Observable<Song> {
    return this.get(`/random-song`);
  }
}
