import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { downloadCsv } from '../shared/export-utils';
import { TeacherApiService, TeacherRecord } from '../shared/teacher-api.service';

interface TeacherForm {
  teacherId: string;
  fullName: string;
  faculty: string;
  birthDate: string;
  gender: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './teacher.html',
  styleUrl: './teacher.css'
})
export class TeacherComponent implements OnInit {
  private readonly storageKey = 'teacherRecords';

  form: TeacherForm = {
    teacherId: '',
    fullName: '',
    faculty: '',
    birthDate: '',
    gender: 'Nam',
    phone: '',
    email: ''
  };

  teachers: TeacherRecord[] = [];
  selectedId: number | null = null;
  searchText = '';
  message = '';

  constructor(private readonly teacherApi: TeacherApiService) {}

  ngOnInit(): void {
    this.loadFromStorage();
    this.teacherApi.getAll().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.teachers = data.map(item => ({ ...item, id: item.id ?? Date.now() }));
          this.saveToStorage();
        }
      },
      error: () => {
        this.message = 'Backend chưa chạy, dữ liệu vẫn đang dùng localStorage.';
      }
    });
  }

  addTeacher(): void {
    if (!this.form.teacherId || !this.form.fullName) {
      this.message = 'Vui lòng nhập mã giảng viên và họ tên.';
      return;
    }

    if (this.selectedId !== null) {
      const id = this.selectedId;
      const updatedTeacher = { ...this.getTeacherById(id), ...this.form, id };
      this.teachers = this.teachers.map(teacher => teacher.id === id ? updatedTeacher : teacher);
      this.selectedId = null;
      this.saveToStorage();
      this.message = 'Đã cập nhật thông tin giảng viên thành công.';
      this.resetForm();

      this.teacherApi.update(id, this.form).subscribe({
        next: (updated) => {
          this.teachers = this.teachers.map(teacher => teacher.id === id ? { ...updatedTeacher, ...updated, id } : teacher);
          this.saveToStorage();
        },
        error: () => {
          this.message = 'Đã cập nhật cục bộ vì backend chưa sẵn sàng.';
        }
      });
      return;
    }

    const newTeacher = this.buildTeacherFromForm();
    this.teachers = [newTeacher, ...this.teachers];
    this.saveToStorage();
    this.message = 'Đã thêm giảng viên mới thành công.';
    this.resetForm();

    this.teacherApi.create(this.form).subscribe({
      next: (created) => {
        this.teachers = this.teachers.map(teacher => teacher.id === newTeacher.id ? { ...newTeacher, ...created, id: created.id ?? newTeacher.id } : teacher);
        this.saveToStorage();
      },
      error: () => {
        this.message = 'Đã thêm giảng viên cục bộ vì backend chưa sẵn sàng.';
      }
    });
  }

  editTeacher(teacher: TeacherRecord): void {
    this.form = { ...teacher };
    this.selectedId = teacher.id;
  }

  deleteTeacher(id: number): void {
    this.teacherApi.delete(id).subscribe({
      next: () => {
        this.teachers = this.teachers.filter(teacher => teacher.id !== id);
        if (this.selectedId === id) {
          this.resetForm();
          this.selectedId = null;
        }
        this.saveToStorage();
        this.message = 'Đã xóa giảng viên khỏi danh sách.';
      },
      error: () => {
        this.teachers = this.teachers.filter(teacher => teacher.id !== id);
        if (this.selectedId === id) {
          this.resetForm();
          this.selectedId = null;
        }
        this.saveToStorage();
        this.message = 'Đã xóa cục bộ vì backend chưa sẵn sàng.';
      }
    });
  }

  clearAllTeachers(): void {
    this.teachers = [];
    this.saveToStorage();
    this.message = 'Đã xóa toàn bộ dữ liệu giảng viên.';
    this.resetForm();
    this.selectedId = null;
  }

  searchTeacher(): void {
    return;
  }

  resetForm(): void {
    this.form = {
      teacherId: '',
      fullName: '',
      faculty: '',
      birthDate: '',
      gender: 'Nam',
      phone: '',
      email: ''
    };
  }

  private buildTeacherFromForm(): TeacherRecord {
    return {
      id: Date.now(),
      teacherId: this.form.teacherId.trim(),
      fullName: this.form.fullName.trim(),
      faculty: this.form.faculty.trim(),
      birthDate: this.form.birthDate,
      gender: this.form.gender,
      phone: this.form.phone.trim(),
      email: this.form.email.trim()
    };
  }

  private getTeacherById(id: number): TeacherRecord | undefined {
    return this.teachers.find(teacher => teacher.id === id);
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, JSON.stringify(this.teachers));
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
      this.teachers = JSON.parse(saved);
    } catch {
      this.teachers = [];
    }
  }

  exportTeachers(): void {
    downloadCsv('teachers.csv', this.teachers.map(teacher => ({
      'Mã giảng viên': teacher.teacherId,
      'Họ tên': teacher.fullName,
      'Khoa': teacher.faculty,
      'Ngày sinh': teacher.birthDate,
      'Giới tính': teacher.gender,
      'Số điện thoại': teacher.phone,
      'Email': teacher.email
    })));
    this.message = 'Đã xuất dữ liệu giảng viên ra file CSV.';
  }

  get totalTeachers(): number {
    return this.teachers.length;
  }

  get displayedTeachers(): TeacherRecord[] {
    const keyword = this.searchText.trim().toLowerCase();
    if (!keyword) {
      return this.teachers;
    }

    return this.teachers.filter(teacher =>
      teacher.fullName.toLowerCase().includes(keyword) ||
      teacher.teacherId.toLowerCase().includes(keyword) ||
      teacher.faculty.toLowerCase().includes(keyword) ||
      teacher.email.toLowerCase().includes(keyword)
    );
  }
}
