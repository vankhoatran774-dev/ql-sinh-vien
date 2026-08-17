import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { downloadCsv } from '../shared/export-utils';

interface ScoreForm {
  scoreId: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  score: string;
  grade: string;
}

interface ScoreRecord extends ScoreForm {
  id: number;
}

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './score.html',
  styleUrl: './score.css'
})
export class ScoreComponent {
  private readonly storageKey = 'scoreRecords';

  form: ScoreForm = {
    scoreId: '',
    studentId: '',
    studentName: '',
    subjectName: '',
    score: '',
    grade: 'A'
  };

  scores: ScoreRecord[] = [];
  selectedId: number | null = null;
  searchText = '';
  message = '';

  constructor() {
    this.loadFromStorage();
  }

  addScore(): void {
    if (!this.form.scoreId || !this.form.studentId) {
      this.message = 'Vui lòng nhập mã điểm và mã sinh viên.';
      return;
    }

    if (this.selectedId !== null) {
      this.scores = this.scores.map(item =>
        item.id === this.selectedId ? { ...item, ...this.form } : item
      );
      this.selectedId = null;
    } else {
      this.scores.unshift({ id: Date.now(), ...this.form });
    }

    this.saveToStorage();
    this.message = this.selectedId !== null ? 'Đã cập nhật điểm thành công.' : 'Đã thêm bản ghi điểm mới thành công.';
    this.resetForm();
  }

  editScore(item: ScoreRecord): void {
    this.form = { ...item };
    this.selectedId = item.id;
  }

  deleteScore(id: number): void {
    this.scores = this.scores.filter(item => item.id !== id);
    if (this.selectedId === id) {
      this.resetForm();
      this.selectedId = null;
    }
    this.saveToStorage();
    this.message = 'Đã xóa bản ghi điểm khỏi danh sách.';
  }

  clearAllScores(): void {
    this.scores = [];
    this.saveToStorage();
    this.message = 'Đã xóa toàn bộ dữ liệu điểm.';
    this.resetForm();
    this.selectedId = null;
  }

  searchScore(): void {
    return;
  }

  resetForm(): void {
    this.form = {
      scoreId: '',
      studentId: '',
      studentName: '',
      subjectName: '',
      score: '',
      grade: 'A'
    };
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
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
      this.scores = JSON.parse(saved);
    } catch {
      this.scores = [];
    }
  }

  exportScores(): void {
    downloadCsv('scores.csv', this.scores.map(item => ({
      'Mã điểm': item.scoreId,
      'Mã sinh viên': item.studentId,
      'Họ tên': item.studentName,
      'Môn học': item.subjectName,
      'Điểm': item.score,
      'Xếp loại': item.grade
    })));
    this.message = 'Đã xuất dữ liệu điểm ra file CSV.';
  }

  get totalScores(): number {
    return this.scores.length;
  }

  get displayedScores(): ScoreRecord[] {
    const keyword = this.searchText.trim().toLowerCase();
    if (!keyword) {
      return this.scores;
    }

    return this.scores.filter(item =>
      item.studentName.toLowerCase().includes(keyword) ||
      item.studentId.toLowerCase().includes(keyword) ||
      item.subjectName.toLowerCase().includes(keyword) ||
      item.grade.toLowerCase().includes(keyword)
    );
  }
}
