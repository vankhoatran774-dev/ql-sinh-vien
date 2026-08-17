import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { downloadCsv } from '../shared/export-utils';

interface SemesterForm {
  semesterId: string;
  semesterName: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface SemesterRecord extends SemesterForm {
  id: number;
}

@Component({
  selector: 'app-semester',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './semester.html',
  styleUrl: './semester.css'
})
export class SemesterComponent {
  private readonly storageKey = 'semesterRecords';

  form: SemesterForm = {
    semesterId: '',
    semesterName: '',
    startDate: '',
    endDate: '',
    status: 'Đang diễn ra'
  };

  semesters: SemesterRecord[] = [];
  selectedId: number | null = null;
  searchText = '';
  message = '';

  constructor() {
    this.loadFromStorage();
  }

  addSemester(): void {
    if (!this.form.semesterId || !this.form.semesterName) {
      this.message = 'Vui lòng nhập mã học kỳ và tên học kỳ.';
      return;
    }

    if (this.selectedId !== null) {
      this.semesters = this.semesters.map(item => item.id === this.selectedId ? { ...item, ...this.form } : item);
      this.selectedId = null;
    } else {
      this.semesters.unshift({ id: Date.now(), ...this.form });
    }

    this.saveToStorage();
    this.message = this.selectedId !== null ? 'Đã cập nhật học kỳ thành công.' : 'Đã thêm học kỳ mới thành công.';
    this.resetForm();
  }

  editSemester(item: SemesterRecord): void {
    this.form = { ...item };
    this.selectedId = item.id;
  }

  deleteSemester(id: number): void {
    this.semesters = this.semesters.filter(item => item.id !== id);
    if (this.selectedId === id) {
      this.resetForm();
      this.selectedId = null;
    }
    this.saveToStorage();
    this.message = 'Đã xóa học kỳ khỏi danh sách.';
  }

  clearAllSemesters(): void {
    this.semesters = [];
    this.saveToStorage();
    this.message = 'Đã xóa toàn bộ dữ liệu học kỳ.';
    this.resetForm();
    this.selectedId = null;
  }

  searchSemester(): void {
    return;
  }

  resetForm(): void {
    this.form = {
      semesterId: '',
      semesterName: '',
      startDate: '',
      endDate: '',
      status: 'Đang diễn ra'
    };
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.semesters));
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
      this.semesters = JSON.parse(saved);
    } catch {
      this.semesters = [];
    }
  }

  exportSemesters(): void {
    downloadCsv('semesters.csv', this.semesters.map(item => ({
      'Mã học kỳ': item.semesterId,
      'Tên học kỳ': item.semesterName,
      'Ngày bắt đầu': item.startDate,
      'Ngày kết thúc': item.endDate,
      'Trạng thái': item.status
    })));
    this.message = 'Đã xuất dữ liệu học kỳ ra file CSV.';
  }

  get totalSemesters(): number {
    return this.semesters.length;
  }

  get displayedSemesters(): SemesterRecord[] {
    const keyword = this.searchText.trim().toLowerCase();
    if (!keyword) {
      return this.semesters;
    }

    return this.semesters.filter(item =>
      item.semesterName.toLowerCase().includes(keyword) ||
      item.semesterId.toLowerCase().includes(keyword) ||
      item.status.toLowerCase().includes(keyword)
    );
  }
}
