package com.example.quanlysinhvien.score;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = "*")
public class ScoreController {
    private final ScoreRepository repository;

    public ScoreController(ScoreRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Score> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Score create(@RequestBody Score score) {
        return repository.save(score);
    }

    @PutMapping("/{id}")
    public Score update(@PathVariable Long id, @RequestBody Score score) {
        score.setId(id);
        return repository.save(score);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
