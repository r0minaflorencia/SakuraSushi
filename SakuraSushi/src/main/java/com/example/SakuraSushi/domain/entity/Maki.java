package com.example.SakuraSushi.domain.entity;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("MAKI")
public class Maki extends Producto {

    private Integer piezas;
    private List<String> toppings; // Semillas de sésamo, etc.

    @Override
    public String getDType() {
        return "MAKI";
    }

    @Override
    public String getCategoria() {
        return "Maki";
    }

    @Override
    public double calcularPrecioFinal() {

        double precioFinal = getPrecioBase();

        // Precio extra por toppings
        if (toppings != null && !toppings.isEmpty()) {
            precioFinal += toppings.size() * 50; // por topping
        }

        return precioFinal;
    }

    public Integer getPiezas() {
        return piezas;
    }

    public void setPiezas(Integer piezas) {
        this.piezas = piezas;
    }

    public List<String> getToppings() {
        return toppings;
    }

    public void setToppings(List<String> toppings) {
        this.toppings = toppings;
    }

}
