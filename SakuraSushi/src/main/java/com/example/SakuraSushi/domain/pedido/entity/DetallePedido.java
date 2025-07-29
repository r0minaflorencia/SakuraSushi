package com.example.SakuraSushi.domain.pedido.entity;

import com.example.SakuraSushi.domain.producto.entity.Producto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "detalle_pedidos")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto; // Asumiendo que ya tienes esta entidad

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10)
    private double precioUnitario;

    @Column(name = "subtotal", nullable = false, precision = 10)
    private double subtotal;

    @Column(name = "notas_especiales", length = 255)
    private String notasEspeciales;


    public DetallePedido() {
    }

    public DetallePedido(Pedido pedido, Producto producto, Integer cantidad,
            double precioUnitario) {
        this.pedido = pedido;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        calcularSubtotal();
    }

    // Métodos de utilidad
    public void calcularSubtotal() {
        if (cantidad != null && precioUnitario != 0) {
            this.subtotal = precioUnitario * cantidad;
        }
    }

    @PrePersist
    @PreUpdate
    private void calcularSubtotalAntesDeGuardar() {
        calcularSubtotal();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
        calcularSubtotal();
    }

    public double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
        calcularSubtotal();
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public String getNotasEspeciales() {
        return notasEspeciales;
    }

    public void setNotasEspeciales(String notasEspeciales) {
        this.notasEspeciales = notasEspeciales;
    }
}