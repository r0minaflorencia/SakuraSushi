package com.example.SakuraSushi.domain.producto.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("SASHIMI")
public class Sashimi extends Producto {

    private String tipoPescado; // Salmón, Atún, etc.
    private Integer piezas = 6;


    @Override
    public String getDType() {
        return "SASHIMI";
    }

    @Override
    public String getCategoria() {
        return "Sashimi";
    }

    @Override
    public double calcularPrecioFinal() {
        return getPrecioBase();
    }

    public String getTipoPescado() {
        return tipoPescado;
    }

    public void setTipoPescado(String tipoPescado) {
        this.tipoPescado = tipoPescado;
    }

    public Integer getPiezas() {
        return piezas;
    }

    public void setPiezas(Integer piezas) {
        this.piezas = piezas;
    }



}
