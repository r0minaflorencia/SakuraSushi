package com.example.SakuraSushi.domain.producto.entity;

import java.util.List;

import org.hibernate.annotations.BatchSize;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

@Entity
@DiscriminatorValue("COMBO")
public class Combo extends Producto {

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "combo_productos_incluidos", 
            joinColumns = @JoinColumn(name = "combo_id"), 
            inverseJoinColumns = @JoinColumn(name = "producto_id") 
    )
    @BatchSize(size = 10)
    private List<Producto> productosIncluidos; 
    private int porcentajeDescuento = 15; // 15% descuento
    private boolean incluyeSalsaSoja = true;
    private boolean incluyeWasabi = true;
    private boolean incluyeJengibre = true;

    @Override
    public String getDType() {
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

    public List<Producto> getProductosIncluidos() {
        return productosIncluidos;
    }

    public void setProductosIncluidos(List<Producto> productosIncluidos) {
        this.productosIncluidos = productosIncluidos;
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
