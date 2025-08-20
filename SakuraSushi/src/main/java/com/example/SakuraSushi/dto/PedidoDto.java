package com.example.SakuraSushi.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.SakuraSushi.util.enums.EstadoPedido;
import com.example.SakuraSushi.util.enums.TipoEntrega;

public class PedidoDto {

    private Long id;
    private String numeroPedido;
    private LocalDateTime fechaPedido;
    
    private String clienteNombre;
    
    private String clienteEmail;
    
    private String clienteTelefono;
    
    private String direccionEntrega;
    private EstadoPedido estado;
    
    private TipoEntrega tipoEntrega;
    
    private List<DetallePedidoDto> detalles;
    
    private double subtotal;
    private double descuento;
    private double costoEnvio;
    private double total;
    private String notas;
    private LocalDateTime fechaEntregaEstimada;
    private LocalDateTime fechaEntregaReal;
    
    // Constructores
    public PedidoDto() {}
    
    // Getters y Setters (todos los campos)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNumeroPedido() { return numeroPedido; }
    public void setNumeroPedido(String numeroPedido) { this.numeroPedido = numeroPedido; }
    
    public LocalDateTime getFechaPedido() { return fechaPedido; }
    public void setFechaPedido(LocalDateTime fechaPedido) { this.fechaPedido = fechaPedido; }
    
    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }
    
    public String getClienteEmail() { return clienteEmail; }
    public void setClienteEmail(String clienteEmail) { this.clienteEmail = clienteEmail; }
    
    public String getClienteTelefono() { return clienteTelefono; }
    public void setClienteTelefono(String clienteTelefono) { this.clienteTelefono = clienteTelefono; }
    
    public String getDireccionEntrega() { return direccionEntrega; }
    public void setDireccionEntrega(String direccionEntrega) { this.direccionEntrega = direccionEntrega; }
    
    public EstadoPedido getEstado() { return estado; }
    public void setEstado(EstadoPedido estado) { this.estado = estado; }
    
    public TipoEntrega getTipoEntrega() { return tipoEntrega; }
    public void setTipoEntrega(TipoEntrega tipoEntrega) { this.tipoEntrega = tipoEntrega; }
    
    public List<DetallePedidoDto> getDetalles() { return detalles; }
    public void setDetalles(List<DetallePedidoDto> detalles) { this.detalles = detalles; }
    
    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    
    public double getDescuento() { return descuento; }
    public void setDescuento(double descuento) { this.descuento = descuento; }
    
    public double getCostoEnvio() { return costoEnvio; }
    public void setCostoEnvio(double costoEnvio) { this.costoEnvio = costoEnvio; }
    
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    
    public LocalDateTime getFechaEntregaEstimada() { return fechaEntregaEstimada; }
    public void setFechaEntregaEstimada(LocalDateTime fechaEntregaEstimada) { 
        this.fechaEntregaEstimada = fechaEntregaEstimada; 
    }
    
    public LocalDateTime getFechaEntregaReal() { return fechaEntregaReal; }
    public void setFechaEntregaReal(LocalDateTime fechaEntregaReal) { 
        this.fechaEntregaReal = fechaEntregaReal; 
    }
}
