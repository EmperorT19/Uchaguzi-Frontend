
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VotingService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  getCounties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/counties/`);
  }

  getConstituencies(countyId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/constituencies/?county=${countyId}`);
  }

  getWards(constituencyId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/wards/?constituency=${constituencyId}`);
  }

  registerVoter(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, {
      headers: this.getHeaders()
    });
  }

  loginVoter(voterCode: string, idNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/voters/login/`, {
      voter_code: voterCode,
      id_number: idNumber
    }, {
      headers: this.getHeaders()
    });
  }

  getSeats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/seats/`);
  }

  getCandidates(seatType?: string): Observable<any> {
    const url = seatType 
      ? `${this.apiUrl}/candidates/?seat_type=${seatType}` 
      : `${this.apiUrl}/candidates/`;
    return this.http.get(url);
  }

  submitVote(voterId: number, seatId: number, candidateId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/votes/`, {
      voter: voterId,
      seat: seatId,
      candidate: candidateId
    }, {
      headers: this.getHeaders()
    });
  }

  getResults(): Observable<any> {
    return this.http.get(`${this.apiUrl}/votes/results/`);
  }


}