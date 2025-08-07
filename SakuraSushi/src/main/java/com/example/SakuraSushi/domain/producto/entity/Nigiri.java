package com.example.SakuraSushi.domain.producto.entity;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("NIGIRI")
public class Nigiri extends Producto {

    private List<String> toppings;
    private Integer piezas;
    private boolean tieneWasabi;

    @Override
    public String getDType() {
        return "NIGIRI";
    }

    @Override
    public String getCategoria() {
        return "Nigiri";
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

    public List<String> getToppings() {
        return toppings;
    }

    public void setToppings(List<String> toppings) {
        this.toppings = toppings;
    }

    public Integer getPiezas() {
        return piezas;
    }

    public void setPiezas(Integer piezas) {
        this.piezas = piezas;
    }

    public Boolean getTieneWasabi() {
        return tieneWasabi;
    }

    public void setTieneWasabi(Boolean tieneWasabi) {
        this.tieneWasabi = tieneWasabi;
    }

}
