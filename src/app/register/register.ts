import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { downloadCsv } from '../shared/export-utils';

interface RegistrationForm {
  registrationId: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  registerDate: string;
  status: string;
}

interface RegistrationRecord extends RegistrationForm {
  id: number;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private readonly storageKey = 'registrationRecords';

  form: RegistrationForm = {
    registrationId: '',
    studentId: '',
    studentName: '',
    subjectName: '',
    registerDate: '',
    status: 'Đã duyệt'
  };

  registrations: RegistrationRecord[] = [];
  selectedId: number | null = null;
  searchText = '';
  message = '';

  constructor() {
    this.loadFromStorage();
  }

  addRegistration(): void {
    if (!this.form.registrationId || !this.form.studentId) {
      this.message = 'Vui lòng nhập mã đăng ký và mã sinh viên.';
      return;
    }

    if (this.selectedId !== null) {
      this.registrations = this.registrations.map(item =>
        item.id === this.selectedId ? { ...item, ...this.form } : item
      );
      this.selectedId = null;
    } else {
      this.registrations.unshift({ id: Date.now(), ...this.form });
    }

    this.saveToStorage();
    this.message = this.selectedId !== null ? 'Đã cập nhật đăng ký thành công.' : 'Đã thêm đăng ký mới thành công.';
    this.resetForm();
  }

  editRegistration(item: RegistrationRecord): void {
    this.form = { ...item };
    this.selectedId = item.id;
  }

  deleteRegistration(id: number): void {
    this.registrations = this.registrations.filter(item => item.id !== id);
    if (this.selectedId === id) {
      this.resetForm();
      this.selectedId = null;
    }
    this.saveToStorage();
    this.message = 'Đã xóa đăng ký khỏi danh sách.';
  }

  clearAllRegistrations(): void {
    this.registrations = [];
    this.saveToStorage();
    this.message = 'Đã xóa toàn bộ dữ liệu đăng ký.';
    this.resetForm();
    this.selectedId = null;
  }

  searchRegistration(): void {
    return;
  }

  resetForm(): void {
    this.form = {
      registrationId: '',
      studentId: '',
      studentName: '',
      subjectName: '',
      registerDate: '',
      status: 'Đã duyệt'
    };
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.registrations));
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
      this.registrations = JSON.parse(saved);
    } catch {
      this.registrations = [];
    }
  }

  exportRegistrations(): void {
    downloadCsv('registrations.csv', this.registrations.map(item => ({
      'Mã đăng ký': item.registrationId,
      'Mã sinh viên': item.studentId,
      'Họ tên': item.studentName,
      'Môn học': item.subjectName,
      'Ngày đăng ký': item.registerDate,
      'Trạng thái': item.status
    })));
    this.message = 'Đã xuất dữ liệu đăng ký ra file CSV.';
  }

  get totalRegistrations(): number {
    return this.registrations.length;
  }

  get displayedRegistrations(): RegistrationRecord[] {
    const keyword = this.searchText.trim().toLowerCase();
    if (!keyword) {
      return this.registrations;
    }

    return this.registrations.filter(item =>
      item.studentName.toLowerCase().includes(keyword) ||
      item.studentId.toLowerCase().includes(keyword) ||
      item.subjectName.toLowerCase().includes(keyword) ||
      item.status.toLowerCase().includes(keyword)
    );
  }
}
