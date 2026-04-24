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

  changePassword(data: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/voter/change-password`,
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

  getResults(filters: {
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
    
    return this.http.get<any[]>(`${this.baseUrl}/results`, { params });
  }

  getVoterStatus(voterId: number): Observable<{ has_voted: string[] }> {
    const params = new HttpParams().set('voter_id', voterId.toString());
    return this.http.get<{ has_voted: string[] }>(`${this.baseUrl}/voter/status`, { params });
  }

  summarizeCandidate(candidateId: number): Observable<{ summary: string }> {
    return this.http.post<{ summary: string }>(
      `${this.baseUrl}/candidate/summarize`,
      { candidate_id: candidateId },
      { headers: this.headers(), withCredentials: false }
    );
  }

  adminLogin(adminKey: string): Observable<{ message: string; token: string }> {
    return this.http.post<any>(
      `${this.baseUrl}/system-admin/login`,
      { admin_key: adminKey },
      { headers: this.headers() }
    );
  }

  getAdminStats(token: string): Observable<any> {
    const headers = this.headers().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/system-admin/stats`, { headers });
  }

  getAdminVoters(token: string): Observable<any[]> {
    const headers = this.headers().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/system-admin/voters`, { headers });
  }

  getAdminCandidates(token: string): Observable<any[]> {
    const headers = this.headers().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/system-admin/candidates`, { headers });
  }

  getAdminVotes(token: string): Observable<any[]> {
    const headers = this.headers().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/system-admin/votes`, { headers });
  }

  toggleHalt(token: string): Observable<any> {
    const headers = this.headers().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/system-admin/toggle-halt`, {}, { headers });
  }

  addAdminCandidate(token: string, data: any): Observable<any> {
    const headers = this.headers().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/system-admin/candidates/add`, data, { headers });
  }

  deleteAdminCandidate(token: string, id: number): Observable<any> {
    const headers = this.headers().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.baseUrl}/system-admin/candidates/${id}/delete`, { headers });
  }

  restartElection(token: string): Observable<any> {
    const headers = this.headers().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/system-admin/restart-voting`, {}, { headers });
  }
}