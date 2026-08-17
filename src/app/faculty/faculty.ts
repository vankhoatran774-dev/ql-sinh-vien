import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { downloadCsv } from '../shared/export-utils';

interface FacultyForm {
  facultyId: string;
  facultyName: string;
  deanName: string;
  phone: string;
  email: string;
}

interface FacultyRecord extends FacultyForm {
  id: number;
}

@Component({
  selector: 'app-faculty',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './faculty.html',
  styleUrl: './faculty.css'
})
export class FacultyComponent {
  private readonly storageKey = 'facultyRecords';

  form: FacultyForm = {
    facultyId: '',
    facultyName: '',
    deanName: '',
    phone: '',
    email: ''
  };

  faculties: FacultyRecord[] = [];
  selectedId: number | null = null;
  searchText = '';
  message = '';

  constructor() {
    this.loadFromStorage();
  }

  addFaculty(): void {
    if (!this.form.facultyId || !this.form.facultyName) {
      this.message = 'Vui lòng nhập mã khoa và tên khoa.';
      return;
    }

    if (this.selectedId !== null) {
      this.faculties = this.faculties.map(faculty =>
        faculty.id === this.selectedId ? { ...faculty, ...this.form } : faculty
      );
      this.selectedId = null;
    } else {
      this.faculties.unshift({ id: Date.now(), ...this.form });
    }

    this.saveToStorage();
    this.message = this.selectedId !== null ? 'Đã cập nhật thông tin khoa thành công.' : 'Đã thêm khoa mới thành công.';
    this.resetForm();
  }

  editFaculty(faculty: FacultyRecord): void {
    this.form = { ...faculty };
    this.selectedId = faculty.id;
  }

  deleteFaculty(id: number): void {
    this.faculties = this.faculties.filter(faculty => faculty.id !== id);
    if (this.selectedId === id) {
      this.resetForm();
      this.selectedId = null;
    }
    this.saveToStorage();
    this.message = 'Đã xóa khoa khỏi danh sách.';
  }

  clearAllFaculties(): void {
    this.faculties = [];
    this.saveToStorage();
    this.message = 'Đã xóa toàn bộ dữ liệu khoa.';
    this.resetForm();
    this.selectedId = null;
  }

  searchFaculty(): void {
    return;
  }

  resetForm(): void {
    this.form = {
      facultyId: '',
      facultyName: '',
      deanName: '',
      phone: '',
      email: ''
    };
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.faculties));
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const saved = window.localStorage.getItem(this.storageKey);
    if (!saved) {
      return;
    }

    try {
      this.faculties = JSON.parse(saved);
    } catch {
      this.faculties = [];
    }
  }

  exportFaculties(): void {
    downloadCsv('faculties.csv', this.faculties.map(faculty => ({
      'Mã khoa': faculty.facultyId,
      'Tên khoa': faculty.facultyName,
      'Trưởng khoa': faculty.deanName,
      'Số điện thoại': faculty.phone,
      'Email': faculty.email
    })));
    this.message = 'Đã xuất dữ liệu khoa ra file CSV.';
  }

  get totalFaculties(): number {
    return this.faculties.length;
  }

  get displayedFaculties(): FacultyRecord[] {
    const keyword = this.searchText.trim().toLowerCase();
    if (!keyword) {
      return this.faculties;
    }

    return this.faculties.filter(faculty =>
      faculty.facultyName.toLowerCase().includes(keyword) ||
      faculty.facultyId.toLowerCase().includes(keyword) ||
      faculty.deanName.toLowerCase().includes(keyword) ||
      faculty.email.toLowerCase().includes(keyword)
    );
  }
}