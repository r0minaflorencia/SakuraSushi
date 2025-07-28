package com.example.SakuraSushi.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Index {

    @GetMapping("/")
    public Map<String, String> obtenerSaludo() {
        Map<String, String> respuesta = new HashMap<>();
        respuesta.put("mensaje", "¡Hola Sushi Lover!");
        return respuesta;
    }

}