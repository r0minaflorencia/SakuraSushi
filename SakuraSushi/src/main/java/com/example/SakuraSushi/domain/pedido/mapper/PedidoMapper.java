package com.example.SakuraSushi.domain.pedido.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.SakuraSushi.domain.pedido.entity.DetallePedido;
import com.example.SakuraSushi.domain.pedido.entity.Pedido;
import com.example.SakuraSushi.dto.pedido.DetallePedidoDto;
import com.example.SakuraSushi.dto.pedido.PedidoDto;

@Component
public class PedidoMapper {
    
 public PedidoDto toDTO(Pedido pedido) {
        if (pedido == null) return null;
        
        PedidoDto dto = new PedidoDto();
        dto.setId(pedido.getId());
        dto.setNumeroPedido(pedido.getNumeroPedido());
        dto.setFechaPedido(pedido.getFechaPedido());
        dto.setClienteNombre(pedido.getClienteNombre());
        dto.setClienteEmail(pedido.getClienteEmail());
        dto.setClienteTelefono(pedido.getClienteTelefono());
        dto.setDireccionEntrega(pedido.getDireccionEntrega());
        dto.setEstado(pedido.getEstado());
        dto.setTipoEntrega(pedido.getTipoEntrega());
        dto.setSubtotal(pedido.getSubtotal());
        dto.setDescuento(pedido.getDescuento());
        dto.setCostoEnvio(pedido.getCostoEnvio());
        dto.setTotal(pedido.getTotal());
        dto.setNotas(pedido.getNotas());
        dto.setFechaEntregaEstimada(pedido.getFechaEntregaEstimada());
        dto.setFechaEntregaReal(pedido.getFechaEntregaReal());
        
        if (pedido.getDetalles() != null) {
            dto.setDetalles(pedido.getDetalles().stream()
                .map(this::detalleToDto)
                .collect(Collectors.toList()));
        }
        
        return dto;
    }
    
    public Pedido toEntity(PedidoDto dto) {
        if (dto == null) return null;
        
        Pedido pedido = new Pedido();
        pedido.setId(dto.getId());
        pedido.setNumeroPedido(dto.getNumeroPedido());
        pedido.setFechaPedido(dto.getFechaPedido());
        pedido.setClienteNombre(dto.getClienteNombre());
        pedido.setClienteEmail(dto.getClienteEmail());
        pedido.setClienteTelefono(dto.getClienteTelefono());
        pedido.setDireccionEntrega(dto.getDireccionEntrega());
        pedido.setEstado(dto.getEstado());
        pedido.setTipoEntrega(dto.getTipoEntrega());
        pedido.setSubtotal(dto.getSubtotal());
        pedido.setDescuento(dto.getDescuento());
        pedido.setCostoEnvio(dto.getCostoEnvio());
        pedido.setTotal(dto.getTotal());
        pedido.setNotas(dto.getNotas());
        pedido.setFechaEntregaEstimada(dto.getFechaEntregaEstimada());
        pedido.setFechaEntregaReal(dto.getFechaEntregaReal());
        
        return pedido;
    }
    
    public DetallePedidoDto detalleToDto(DetallePedido detalle) {
        if (detalle == null) return null;
        
        DetallePedidoDto dto = new DetallePedidoDto();
        dto.setId(detalle.getId());
        dto.setProductoId(detalle.getProducto().getId());
        dto.setProductoNombre(detalle.getProducto().getNombre());
        dto.setCantidad(detalle.getCantidad());
        dto.setPrecioUnitario(detalle.getPrecioUnitario());
        dto.setSubtotal(detalle.getSubtotal());
        dto.setNotasEspeciales(detalle.getNotasEspeciales());
        
        return dto;
    }
    
    public List<PedidoDto> toDTOList(List<Pedido> pedidos) {
        return pedidos.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
}