package com.example.SakuraSushi.util.enums;

public enum TipoEntrega {
    DELIVERY("Delivery"),
    PICKUP("Recoger en Tienda");

    private final String descripcion;

    TipoEntrega(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
