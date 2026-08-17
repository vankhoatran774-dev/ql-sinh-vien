package com.example.quanlysinhvien.subject;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {
    private final SubjectRepository repository;

    public SubjectController(SubjectRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Subject> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Subject create(@RequestBody Subject subject) {
        return repository.save(subject);
    }

    @PutMapping("/{id}")
    public Subject update(@PathVariable Long id, @RequestBody Subject subject) {
        subject.setId(id);
        return repository.save(subject);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
