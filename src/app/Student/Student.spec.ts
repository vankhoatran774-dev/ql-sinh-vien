import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { StudentComponent } from './Student';

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should add a student and show it in the list', () => {
    component.form = {
      studentId: 'SV001',
      fullName: 'An',
      className: 'CNTT01',
      birthDate: '2000-01-01',
      gender: 'Nam',
      address: 'HCM',
    };

    component.addStudent();

    expect(component.students.length).toBe(1);
    expect(component.students[0].fullName).toBe('An');
    expect(fixture.nativeElement.textContent).toContain('SV001');
  });
});
