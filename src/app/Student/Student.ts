import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { downloadCsv } from '../shared/export-utils';

interface StudentForm {
  studentId: string;
  fullName: string;
  className: string;
  birthDate: string;
  gender: string;
  address: string;
}

interface StudentRecord extends StudentForm {
  id: number;
}

@Component({
  selector: 'app-Student',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './Student.html',
  styleUrl: './Student.css'
})
export class StudentComponent {
  private readonly storageKey = 'studentRecords';

  form: StudentForm = {
    studentId: '',
    fullName: '',
    className: '',
    birthDate: '',
    gender: 'Nam',
    address: ''
  };

  students: StudentRecord[] = [];
  selectedId: number | null = null;
  searchText = '';
  message = '';

  constructor() {
    this.loadFromStorage();
  }

  addStudent(): void {
    if (!this.form.studentId || !this.form.fullName) {
      this.message = 'Vui lòng nhập mã sinh viên và họ tên.';
      return;
    }

    if (this.selectedId !== null) {
      this.students = this.students.map(student =>
        student.id === this.selectedId ? { ...student, ...this.form } : student
      );
      this.selectedId = null;
    } else {
      this.students.unshift({
        id: Date.now(),
        ...this.form
      });
    }

    this.saveToStorage();
    this.message = this.selectedId !== null ? 'Đã cập nhật thông tin sinh viên thành công.' : 'Đã thêm sinh viên mới thành công.';
    this.resetForm();
  }

  editStudent(student: StudentRecord): void {
    this.form = { ...student };
    this.selectedId = student.id;
  }

  deleteStudent(id: number): void {
    this.students = this.students.filter(student => student.id !== id);
    if (this.selectedId === id) {
      this.resetForm();
      this.selectedId = null;
    }
    this.saveToStorage();
    this.message = 'Đã xóa sinh viên khỏi danh sách.';
  }

  clearAllStudents(): void {
    this.students = [];
    this.saveToStorage();
    this.message = 'Đã xóa toàn bộ dữ liệu sinh viên.';
    this.resetForm();
    this.selectedId = null;
  }

  searchStudent(): void {
    return;
  }

  resetForm(): void {
    this.form = {
      studentId: '',
      fullName: '',
      className: '',
      birthDate: '',
      gender: 'Nam',
      address: ''
    };
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.students));
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
      this.students = JSON.parse(saved);
    } catch {
      this.students = [];
    }
  }

  exportStudents(): void {
    downloadCsv('students.csv', this.students.map(student => ({
      'Mã sinh viên': student.studentId,
      'Họ tên': student.fullName,
      'Lớp': student.className,
      'Ngày sinh': student.birthDate,
      'Giới tính': student.gender,
      'Địa chỉ': student.address
    })));
    this.message = 'Đã xuất dữ liệu sinh viên ra file CSV.';
  }

  get totalStudents(): number {
    return this.students.length;
  }

  get displayedStudents(): StudentRecord[] {
    const keyword = this.searchText.trim().toLowerCase();
    if (!keyword) {
      return this.students;
    }

    return this.students.filter(student =>
      student.fullName.toLowerCase().includes(keyword) ||
      student.studentId.toLowerCase().includes(keyword) ||
      student.className.toLowerCase().includes(keyword) ||
      student.address.toLowerCase().includes(keyword)
    );
  }
}