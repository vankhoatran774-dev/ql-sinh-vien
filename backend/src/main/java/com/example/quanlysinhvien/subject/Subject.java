package com.example.quanlysinhvien.subject;

import jakarta.persistence.*;

@Entity
@Table(name = "subjects")
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subjectId;
    private String subjectName;
    private String credits;
    private String department;
    private String description;

    public Subject() {}

    public Subject(String subjectId, String subjectName, String credits, String department, String description) {
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.credits = credits;
        this.department = department;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSubjectId() { return subjectId; }
    public void setSubjectId(String subjectId) { this.subjectId = subjectId; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public String getCredits() { return credits; }
    public void setCredits(String credits) { this.credits = credits; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
