package com.example.SakuraSushi.domain.producto.entity;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("MAKI")
public class Maki extends Producto {

    private String relleno; // Salmón, Atún, Pepino, etc.
    private Integer piezas = 8;
    private String arrozTipo = "Sushi Arroz";
    private String tipoNori = "Alga Nori Premium";
    private List<String> toppings; // Semillas de sésamo, etc.

    @Override
    public String getTipoDeProducto() {
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

    public String getRelleno() {
        return relleno;
    }

    public void setRelleno(String relleno) {
        this.relleno = relleno;
    }

    public Integer getPiezas() {
        return piezas;
    }

    public void setPiezas(Integer piezas) {
        this.piezas = piezas;
    }

    public String getArrozTipo() {
        return arrozTipo;
    }

    public void setArrozTipo(String arrozTipo) {
        this.arrozTipo = arrozTipo;
    }

    public String getTipoNori() {
        return tipoNori;
    }

    public void setTipoNori(String tipoNori) {
        this.tipoNori = tipoNori;
    }

    public List<String> getToppings() {
        return toppings;
    }

    public void setToppings(List<String> toppings) {
        this.toppings = toppings;
    }
 

}
