package com.example.SakuraSushi.dto.producto;

import lombok.Data;

@Data
public abstract class ProductoDto {
    private Long id;
    private String nombre;
    private String descripcion;
    private double precioBase;
    private double precioFinal;
    private Integer stock;
    private boolean disponible;
    private boolean esPicante;
    private boolean esVegetariano;
    private boolean esVegano;
    private boolean esGlutenFree;
    private String categoria;
    private String tipoDeProducto;
    
}
