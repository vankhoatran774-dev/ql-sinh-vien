package com.example.quanlysinhvien.teacher;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "*")
public class TeacherController {
    private final TeacherRepository repository;

    public TeacherController(TeacherRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Teacher> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Teacher create(@RequestBody Teacher teacher) {
        return repository.save(teacher);
    }

    @PutMapping("/{id}")
    public Teacher update(@PathVariable Long id, @RequestBody Teacher teacher) {
        teacher.setId(id);
        return repository.save(teacher);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
