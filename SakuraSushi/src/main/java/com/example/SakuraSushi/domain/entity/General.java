package com.example.SakuraSushi.domain.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("GENERAL")
public class General extends Producto {

    @Override
    public String getDType() {
        return "GENERAL";
    }

    @Override
    public String getCategoria() {
        return "General";
    }

    @Override
    public double calcularPrecioFinal() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'calcularPrecioFinal'");
    }

}
