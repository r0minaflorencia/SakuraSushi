package com.example.SakuraSushi.domain.producto.entity;

import java.util.List;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("COMBO")
public class Combo extends Producto {

    @ElementCollection
    private List<Long> productosIncluidosId; // IDs de Productos incluidos
    private int porcentajeDescuento = 15; // 15% descuento
    private boolean incluyeSalsaSoja = true;
    private boolean incluyeWasabi = true;
    private boolean incluyeJengibre = true;

    @Override
    public String getTipoDeProducto() {
        return "COMBO";
    }

    @Override
    public String getCategoria() {
        return "Combos";
    }

    @Override
    public double calcularPrecioFinal() {
        double precioFinal;

        precioFinal = (getPrecioBase() * porcentajeDescuento) / 100;

        return precioFinal;
    }

    public List<Long> getProductosIncluidosId() {
        return productosIncluidosId;
    }

    public void setProductosIncluidosId(List<Long> productosIncluidosId) {
        this.productosIncluidosId = productosIncluidosId;
    }

    public int getPorcentajeDescuento() {
        return porcentajeDescuento;
    }

    public void setPorcentajeDescuento(int porcentajeDescuento) {
        this.porcentajeDescuento = porcentajeDescuento;
    }

    public boolean isIncluyeSalsaSoja() {
        return incluyeSalsaSoja;
    }

    public void setIncluyeSalsaSoja(boolean incluyeSalsaSoja) {
        this.incluyeSalsaSoja = incluyeSalsaSoja;
    }

    public boolean isIncluyeWasabi() {
        return incluyeWasabi;
    }

    public void setIncluyeWasabi(boolean incluyeWasabi) {
        this.incluyeWasabi = incluyeWasabi;
    }

    public boolean isIncluyeJengibre() {
        return incluyeJengibre;
    }

    public void setIncluyeJengibre(boolean incluyeJengibre) {
        this.incluyeJengibre = incluyeJengibre;
    }

    

}
