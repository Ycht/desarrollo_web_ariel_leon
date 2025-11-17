package com.tarea4.t4.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tarea4.t4.models.Nota;
import com.tarea4.t4.models.NotaRepository;

@RestController
public class ApiController {

    private final NotaRepository notaRepository;

    public ApiController(NotaRepository notaRepository) {
        this.notaRepository = notaRepository;
    }

    @PostMapping("/avisos/{id}/nota")
    public Map<String, Object> agregarNota(
        @PathVariable("id") Integer avisoId,
        @RequestParam("nota") Integer nota) {

        // Validación.
        if (nota == null || nota < 1 || nota > 7) {
            return Map.of("status", "ERROR");
        }

        // Guardar nota.
        notaRepository.save(new Nota(avisoId, nota));

        // Recalcular el promedio.
        List<Nota> notas = notaRepository.findByAvisoId(avisoId);
        double avg = notas.stream()
                      .mapToInt(Nota::getNota)
                      .average()
                      .orElse(0.0);

        return Map.of(
            "status", "OK",
            "promedio", String.format("%.1f", avg)
        );
    }
}