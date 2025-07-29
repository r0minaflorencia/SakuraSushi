package com.example.SakuraSushi.domain.producto.entity;

import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "productos")
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
public abstract class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(length = 1000)
    private String descripcion;

    @Column
    private double precioBase;

    @Column(nullable = false)
    private int stock = 0;

    @Column(nullable = false)
    private boolean disponible = true;

    @ElementCollection
    @CollectionTable(name = "ingredientes")
    private List<String> ingredientes;

    private boolean esPicante = false;
    private boolean esVegetariano = false;
    private boolean esVegano = false;
    private boolean esGlutenFree = false;

    public abstract String getTipoDeProducto();

    public abstract String getCategoria();

    public abstract double calcularPrecioFinal();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public double getPrecioBase() {
        return precioBase;
    }

    public void setPrecioBase(double precioBase) {
        this.precioBase = precioBase;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }

    public List<String> getIngredientes() {
        return ingredientes;
    }

    public void setIngredientes(List<String> ingredientes) {
        this.ingredientes = ingredientes;
    }

    public boolean isEsPicante() {
        return esPicante;
    }

    public void setEsPicante(boolean esPicante) {
        this.esPicante = esPicante;
    }

    public boolean isEsVegetariano() {
        return esVegetariano;
    }

    public void setEsVegetariano(boolean esVegetariano) {
        this.esVegetariano = esVegetariano;
    }

    public boolean isEsVegano() {
        return esVegano;
    }

    public void setEsVegano(boolean esVegano) {
        this.esVegano = esVegano;
    }

    public boolean isEsGlutenFree() {
        return esGlutenFree;
    }

    public void setEsGlutenFree(boolean esGlutenFree) {
        this.esGlutenFree = esGlutenFree;
    }

}
