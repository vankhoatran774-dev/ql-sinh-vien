package com.example.quanlysinhvien.student;

import jakarta.persistence.*;

@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentId;
    private String fullName;
    private String className;
    private String birthDate;
    private String gender;
    private String address;

    public Student() {}

    public Student(String studentId, String fullName, String className, String birthDate, String gender, String address) {
        this.studentId = studentId;
        this.fullName = fullName;
        this.className = className;
        this.birthDate = birthDate;
        this.gender = gender;
        this.address = address;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public String getBirthDate() { return birthDate; }
    public void setBirthDate(String birthDate) { this.birthDate = birthDate; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
