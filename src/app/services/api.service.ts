import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService  {
  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // POST /register
  register(data: {
    full_name: string;
    id_number: string;
    email: string;
    phone: string;
    county: number;
    constituency: number;
    ward: number;
  }): Observable<{ message: string; voter_code: string }> {
    return this.http.post<any>(`${this.baseUrl}/register`, data, {
      headers: this.headers()
    });
  }

  // POST /login
  login(data: {
    id_number: string;
    voter_code: string;
  }): Observable<{
    message: string;
    user: {
      id: number;
      full_name: string;
      voter_code: string;
      id_number: string;
      county: string;
      constituency: string;
      ward: string;
      has_voted: string[];
    }
  }> {
    return this.http.post<any>(`${this.baseUrl}/login`, data, {
      headers: this.headers()
    });
  }

  // POST /vote
  castVote(data: {
  voter_id: number;
  seat_id: number;
  candidate_id: number;
}): Observable<{ message: string }> {
    return this.http.post<any>(`${this.baseUrl}/vote`, data, {
      headers: this.headers()
    });
  }

  // GET /candidates?county=&constituency=&ward=
  getCandidates(filters: {
    county?: string;
    constituency?: string;
    ward?: string;
    seat_type?: string;
  }): Observable<any[]> {
    let params = new HttpParams();
    if (filters.county) params = params.set('county', filters.county);
    if (filters.constituency) params = params.set('constituency', filters.constituency);
    if (filters.ward) params = params.set('ward', filters.ward);
    if (filters.seat_type) params = params.set('seat_type', filters.seat_type);
    return this.http.get<any[]>(`${this.baseUrl}/candidates`, { params });
  }

  // GET /results?seat_type=
  getResults(seatType?: string): Observable<any[]> {
    let params = new HttpParams();
    if (seatType) params = params.set('seat_type', seatType);
    return this.http.get<any[]>(`${this.baseUrl}/results`, { params });
  }

  // GET /voter/status?voter_id=
  getVoterStatus(voterId: number): Observable<{ has_voted: string[] }> {
    const params = new HttpParams().set('voter_id', voterId.toString());
    return this.http.get<any>(`${this.baseUrl}/voter/status`, { params });
  }
}