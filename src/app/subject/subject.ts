import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { downloadCsv } from '../shared/export-utils';

interface SubjectForm {
  subjectId: string;
  subjectName: string;
  credits: string;
  department: string;
  description: string;
}

interface SubjectRecord extends SubjectForm {
  id: number;
}

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './subject.html',
  styleUrl: './subject.css'
})
export class SubjectComponent {
  private readonly storageKey = 'subjectRecords';

  form: SubjectForm = {
    subjectId: '',
    subjectName: '',
    credits: '',
    department: '',
    description: ''
  };

  subjects: SubjectRecord[] = [];
  selectedId: number | null = null;
  searchText = '';
  message = '';

  constructor() {
    this.loadFromStorage();
  }

  addSubject(): void {
    if (!this.form.subjectId || !this.form.subjectName) {
      this.message = 'Vui lòng nhập mã môn và tên môn.';
      return;
    }

    if (this.selectedId !== null) {
      this.subjects = this.subjects.map(item => item.id === this.selectedId ? { ...item, ...this.form } : item);
      this.selectedId = null;
    } else {
      this.subjects.unshift({ id: Date.now(), ...this.form });
    }

    this.saveToStorage();
    this.message = this.selectedId !== null ? 'Đã cập nhật môn học thành công.' : 'Đã thêm môn học mới thành công.';
    this.resetForm();
  }

  editSubject(item: SubjectRecord): void {
    this.form = { ...item };
    this.selectedId = item.id;
  }

  deleteSubject(id: number): void {
    this.subjects = this.subjects.filter(item => item.id !== id);
    if (this.selectedId === id) {
      this.resetForm();
      this.selectedId = null;
    }
    this.saveToStorage();
    this.message = 'Đã xóa môn học khỏi danh sách.';
  }

  clearAllSubjects(): void {
    this.subjects = [];
    this.saveToStorage();
    this.message = 'Đã xóa toàn bộ dữ liệu môn học.';
    this.resetForm();
    this.selectedId = null;
  }

  searchSubject(): void {
    return;
  }

  resetForm(): void {
    this.form = {
      subjectId: '',
      subjectName: '',
      credits: '',
      department: '',
      description: ''
    };
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.subjects));
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
      this.subjects = JSON.parse(saved);
    } catch {
      this.subjects = [];
    }
  }

  exportSubjects(): void {
    downloadCsv('subjects.csv', this.subjects.map(item => ({
      'Mã môn': item.subjectId,
      'Tên môn': item.subjectName,
      'Tín chỉ': item.credits,
      'Khoa': item.department,
      'Mô tả': item.description
    })));
    this.message = 'Đã xuất dữ liệu môn học ra file CSV.';
  }

  get totalSubjects(): number {
    return this.subjects.length;
  }

  get displayedSubjects(): SubjectRecord[] {
    const keyword = this.searchText.trim().toLowerCase();
    if (!keyword) {
      return this.subjects;
    }

    return this.subjects.filter(item =>
      item.subjectName.toLowerCase().includes(keyword) ||
      item.subjectId.toLowerCase().includes(keyword) ||
      item.department.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
  }
}
