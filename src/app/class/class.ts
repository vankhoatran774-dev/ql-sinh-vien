import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { downloadCsv } from '../shared/export-utils';

interface ClassForm {
  classId: string;
  className: string;
  faculty: string;
  major: string;
  advisor: string;
}

interface ClassRecord extends ClassForm {
  id: number;
}

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './class.html',
  styleUrl: './class.css'
})
export class ClassComponent {
  private readonly storageKey = 'classRecords';

  form: ClassForm = {
    classId: '',
    className: '',
    faculty: '',
    major: '',
    advisor: ''
  };

  classes: ClassRecord[] = [];
  selectedId: number | null = null;
  searchText = '';
  message = '';

  constructor() {
    this.loadFromStorage();
  }

  addClass(): void {
    if (!this.form.classId || !this.form.className) {
      this.message = 'Vui lòng nhập mã lớp và tên lớp.';
      return;
    }

    if (this.selectedId !== null) {
      this.classes = this.classes.map(item =>
        item.id === this.selectedId ? { ...item, ...this.form } : item
      );
      this.selectedId = null;
    } else {
      this.classes.unshift({ id: Date.now(), ...this.form });
    }

    this.saveToStorage();
    this.message = this.selectedId !== null ? 'Đã cập nhật thông tin lớp thành công.' : 'Đã thêm lớp mới thành công.';
    this.resetForm();
  }

  editClass(item: ClassRecord): void {
    this.form = { ...item };
    this.selectedId = item.id;
  }

  deleteClass(id: number): void {
    this.classes = this.classes.filter(item => item.id !== id);
    if (this.selectedId === id) {
      this.resetForm();
      this.selectedId = null;
    }
    this.saveToStorage();
    this.message = 'Đã xóa lớp khỏi danh sách.';
  }

  clearAllClasses(): void {
    this.classes = [];
    this.saveToStorage();
    this.message = 'Đã xóa toàn bộ dữ liệu lớp học.';
    this.resetForm();
    this.selectedId = null;
  }

  searchClass(): void {
    return;
  }

  resetForm(): void {
    this.form = {
      classId: '',
      className: '',
      faculty: '',
      major: '',
      advisor: ''
    };
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.classes));
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
      this.classes = JSON.parse(saved);
    } catch {
      this.classes = [];
    }
  }

  exportClasses(): void {
    downloadCsv('classes.csv', this.classes.map(item => ({
      'Mã lớp': item.classId,
      'Tên lớp': item.className,
      'Khoa': item.faculty,
      'Ngành': item.major,
      'Cố vấn': item.advisor
    })));
    this.message = 'Đã xuất dữ liệu lớp học ra file CSV.';
  }

  get totalClasses(): number {
    return this.classes.length;
  }

  get displayedClasses(): ClassRecord[] {
    const keyword = this.searchText.trim().toLowerCase();
    if (!keyword) {
      return this.classes;
    }

    return this.classes.filter(item =>
      item.className.toLowerCase().includes(keyword) ||
      item.classId.toLowerCase().includes(keyword) ||
      item.faculty.toLowerCase().includes(keyword) ||
      item.major.toLowerCase().includes(keyword)
    );
  }
}