import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  configUrl = 'http://localhost:3000/api/';

  getRepos(data : any) {
    return this.http.get<any>(this.configUrl + 'repository-list', { params : data });
  }

  getUsers(data: any) {
    return this.http.get<any>(this.configUrl + 'user-list', {params : data });
  }
}
