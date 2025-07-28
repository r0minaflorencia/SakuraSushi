package com.example.SakuraSushi.service.pedido;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.SakuraSushi.dto.pedido.PedidoDto;
import com.example.SakuraSushi.util.enums.EstadoPedido;
import com.example.SakuraSushi.util.exception.MyException;

public interface PedidoServicio {
    
    PedidoDto crearPedido(PedidoDto PedidoDto) throws MyException;
    
    PedidoDto obtenerPedidoPorId(Long id) throws MyException;
    
    PedidoDto obtenerPedidoPorNumero(String numeroPedido) throws MyException;
    
    PedidoDto actualizarPedido(Long id, PedidoDto PedidoDto) throws MyException;
    
    PedidoDto actualizarEstadoPedido(Long id, EstadoPedido nuevoEstado) throws MyException;
    
    void cancelarPedido(Long id) throws MyException;
    
    List<PedidoDto> obtenerPedidosPorEstado(EstadoPedido estado);
    
    List<PedidoDto> obtenerPedidosPorCliente(String clienteEmail);
    
    Page<PedidoDto> obtenerPedidosPaginados(Pageable pageable);
    
    Page<PedidoDto> obtenerPedidosPorEstadoPaginados(EstadoPedido estado, Pageable pageable);
    
    List<PedidoDto> obtenerPedidosPorRangoFecha(LocalDateTime fechaInicio, LocalDateTime fechaFin);
    
    void marcarComoEntregado(Long id) throws MyException;
    
    Long contarPedidosPorEstadoYFecha(EstadoPedido estado, LocalDateTime fecha);

}
