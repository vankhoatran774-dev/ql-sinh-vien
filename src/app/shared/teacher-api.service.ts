import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TeacherRecord {
  id: number;
  teacherId: string;
  fullName: string;
  faculty: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class TeacherApiService {
  private readonly apiUrl = 'http://localhost:8080/api/teachers';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TeacherRecord[]> {
    return this.http.get<TeacherRecord[]>(this.apiUrl);
  }

  create(teacher: Omit<TeacherRecord, 'id'>): Observable<TeacherRecord> {
    return this.http.post<TeacherRecord>(this.apiUrl, teacher);
  }

  update(id: number, teacher: Partial<TeacherRecord>): Observable<TeacherRecord> {
    return this.http.put<TeacherRecord>(`${this.apiUrl}/${id}`, teacher);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
