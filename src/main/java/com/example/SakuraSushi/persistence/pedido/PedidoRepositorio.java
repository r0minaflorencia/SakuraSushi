package com.example.SakuraSushi.persistence.pedido;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.SakuraSushi.domain.pedido.entity.Pedido;
import com.example.SakuraSushi.util.enums.EstadoPedido;

@Repository
public interface PedidoRepositorio extends JpaRepository<Pedido, Long> {
    
    Optional<Pedido> findByNumeroPedido(String numeroPedido);

    List<Pedido> findByEstado(EstadoPedido estado);

    List<Pedido> findByClienteEmail(String clienteEmail);

    List<Pedido> findByClienteTelefono(String clienteTelefono);

    List<Pedido> findByFechaPedidoBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);

    Page<Pedido> findByEstadoOrderByFechaPedidoDesc(EstadoPedido estado, Pageable pageable);

    @Query("SELECT p FROM Pedido p WHERE p.fechaPedido >= :fechaInicio AND p.fechaPedido <= :fechaFin")
    List<Pedido> findPedidosPorRangoFecha(@Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin);

    @Query("SELECT p FROM Pedido p WHERE p.estado IN :estados ORDER BY p.fechaPedido DESC")
    List<Pedido> findByEstadoInOrderByFechaPedidoDesc(@Param("estados") List<EstadoPedido> estados);

    @Query("SELECT COUNT(p) FROM Pedido p WHERE p.estado = :estado AND DATE(p.fechaPedido) = DATE(:fecha)")
    Long countPedidosPorEstadoYFecha(@Param("estado") EstadoPedido estado,
            @Param("fecha") LocalDateTime fecha);

    @Query("SELECT SUM(p.total) FROM Pedido p WHERE p.estado = 'ENTREGADO' AND p.fechaPedido >= :fechaInicio AND p.fechaPedido <= :fechaFin")
    double calcularVentasPorPeriodo(@Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin);
}
