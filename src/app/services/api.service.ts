import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  register(data: {
    full_name: string;
    id_number: string;
    email: string;
    phone: string;
    county: number;
    constituency: number;
    ward: number;
  }): Observable<{ message: string; voter_code: string }> {
    return this.http.post<{ message: string; voter_code: string }>(
      `${this.baseUrl}/register`,
      data,
      { headers: this.headers(), withCredentials: false }
    );
  }

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
    };
  }> {
    return this.http.post<any>(
      `${this.baseUrl}/login`,
      data,
      { headers: this.headers(), withCredentials: false }
    );
  }

  castVote(data: {
    voter_id: number;
    seat_id: number;
    candidate_id: number;
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/vote`,
      data,
      { headers: this.headers(), withCredentials: false }
    );
  }

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

  getResults(seatType?: string): Observable<any[]> {
    let params = new HttpParams();
    if (seatType) params = params.set('seat_type', seatType);
    return this.http.get<any[]>(`${this.baseUrl}/results`, { params });
  }

  getVoterStatus(voterId: number): Observable<{ has_voted: string[] }> {
    const params = new HttpParams().set('voter_id', voterId.toString());
    return this.http.get<{ has_voted: string[] }>(`${this.baseUrl}/voter/status`, { params });
  }
}