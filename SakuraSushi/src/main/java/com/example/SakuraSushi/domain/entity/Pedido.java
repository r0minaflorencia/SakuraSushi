package com.example.SakuraSushi.domain.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.example.SakuraSushi.util.enums.EstadoPedido;
import com.example.SakuraSushi.util.enums.TipoEntrega;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_pedido", unique = true, nullable = false)
    private String numeroPedido;

    @Column(name = "fecha_pedido", nullable = false)
    private LocalDateTime fechaPedido;

    @Column(name = "cliente_nombre", nullable = false, length = 100)
    private String clienteNombre;

    @Column(name = "cliente_email", nullable = false, length = 150)
    private String clienteEmail;

    @Column(name = "cliente_telefono", nullable = false, length = 15)
    private String clienteTelefono;

    @Column(name = "direccion_entrega", length = 255)
    private String direccionEntrega;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoPedido estado;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_entrega", nullable = false)
    private TipoEntrega tipoEntrega;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetallePedido> detalles;

    @Column(name = "subtotal", nullable = false, precision = 10)
    private double subtotal;

    @Column(name = "descuento", precision = 10)
    private double descuento = 0;

    @Column(name = "costo_envio", precision = 10)
    private double costoEnvio = 0;

    @Column(name = "total", nullable = false, precision = 10)
    private double total;

    @Column(name = "notas", length = 500)
    private String notas;

    @Column(name = "fecha_entrega_estimada")
    private LocalDateTime fechaEntregaEstimada;

    @Column(name = "fecha_entrega_real")
    private LocalDateTime fechaEntregaReal;

    @Column(name = "creado_a_las", nullable = false, updatable = false)
    private LocalDateTime creadoA;

    @Column(name = "actualizado_a_las")
    private LocalDateTime actualizadoA;

    // Constructores
    public Pedido() {
        this.fechaPedido = LocalDateTime.now();
        this.estado = EstadoPedido.PENDIENTE;
        this.creadoA = LocalDateTime.now();
    }

    public Pedido(String clienteNombre, String clienteEmail, String clienteTelefono,
            TipoEntrega tipoEntrega) {
        this();
        this.clienteNombre = clienteNombre;
        this.clienteEmail = clienteEmail;
        this.clienteTelefono = clienteTelefono;
        this.tipoEntrega = tipoEntrega;
    }

    // Métodos de utilidad
    @PrePersist
    protected void onCreate() {
        creadoA = LocalDateTime.now();
        actualizadoA = LocalDateTime.now();
        if (numeroPedido == null) {
            generarNumeroPedido();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        actualizadoA = LocalDateTime.now();
    }

    private void generarNumeroPedido() {
        this.numeroPedido = "PED-" + System.currentTimeMillis();
    }

    public void calcularTotal() {
        if (detalles != null && !detalles.isEmpty()) {
            this.subtotal = detalles.stream()
                    .mapToDouble(DetallePedido::getSubtotal)
                    .sum();
        } else {
            this.subtotal = 0.0;
        }

        this.total = subtotal
                - (descuento != 0.0 ? descuento : 0.0)
                + (costoEnvio != 0.0 ? costoEnvio : 0.0);
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroPedido() {
        return numeroPedido;
    }

    public void setNumeroPedido(String numeroPedido) {
        this.numeroPedido = numeroPedido;
    }

    public LocalDateTime getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(LocalDateTime fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public String getClienteNombre() {
        return clienteNombre;
    }

    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }

    public String getClienteEmail() {
        return clienteEmail;
    }

    public void setClienteEmail(String clienteEmail) {
        this.clienteEmail = clienteEmail;
    }

    public String getClienteTelefono() {
        return clienteTelefono;
    }

    public void setClienteTelefono(String clienteTelefono) {
        this.clienteTelefono = clienteTelefono;
    }

    public String getDireccionEntrega() {
        return direccionEntrega;
    }

    public void setDireccionEntrega(String direccionEntrega) {
        this.direccionEntrega = direccionEntrega;
    }

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }

    public TipoEntrega getTipoEntrega() {
        return tipoEntrega;
    }

    public void setTipoEntrega(TipoEntrega tipoEntrega) {
        this.tipoEntrega = tipoEntrega;
    }

    public List<DetallePedido> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedido> detalles) {
        this.detalles = detalles;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getDescuento() {
        return descuento;
    }

    public void setDescuento(double descuento) {
        this.descuento = descuento;
    }

    public double getCostoEnvio() {
        return costoEnvio;
    }

    public void setCostoEnvio(double costoEnvio) {
        this.costoEnvio = costoEnvio;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public LocalDateTime getFechaEntregaEstimada() {
        return fechaEntregaEstimada;
    }

    public void setFechaEntregaEstimada(LocalDateTime fechaEntregaEstimada) {
        this.fechaEntregaEstimada = fechaEntregaEstimada;
    }

    public LocalDateTime getFechaEntregaReal() {
        return fechaEntregaReal;
    }

    public void setFechaEntregaReal(LocalDateTime fechaEntregaReal) {
        this.fechaEntregaReal = fechaEntregaReal;
    }

    public LocalDateTime getCreadoA() {
        return creadoA;
    }

    public void setCreatedAt(LocalDateTime creadoA) {
        this.creadoA = creadoA;
    }

    public LocalDateTime getActualizadoA() {
        return actualizadoA;
    }

    public void setActualizadoA(LocalDateTime actualizadoA) {
        this.actualizadoA = actualizadoA;
    }
}
