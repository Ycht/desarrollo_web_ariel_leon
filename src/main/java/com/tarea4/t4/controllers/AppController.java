package com.tarea4.t4.controllers;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.tarea4.t4.models.AvisoAdopcion;
import com.tarea4.t4.models.AvisoAdopcionRepository;
import com.tarea4.t4.models.Nota;
import com.tarea4.t4.models.NotaRepository;

@Controller
public class AppController {

    private final AvisoAdopcionRepository avisoRepository;
    private final NotaRepository notaRepository;

    public AppController(AvisoAdopcionRepository avisoRepository, NotaRepository notaRepository) {
        this.avisoRepository = avisoRepository;
        this.notaRepository = notaRepository;
    }

    @GetMapping("/")
    public String indexRoute(Model model) {

        List<AvisoAdopcion> avisos = avisoRepository.findAll();

        List<Map<String, Object>> data = avisos.stream().map(av -> {
            List<Nota> notas = notaRepository.findByAvisoId(av.getId());

            String promedio;
            if (notas.isEmpty()) {
                promedio = "-";
            } else {
                double avg = notas.stream()
                    .collect(Collectors.averagingInt(Nota::getNota));
                promedio = String.format("%.1f", avg);
            }

            return Map.of(
                "aviso", av,
                "promedio", promedio
            );
        }).toList();

        model.addAttribute("data", data);

        return "index";
    }
}