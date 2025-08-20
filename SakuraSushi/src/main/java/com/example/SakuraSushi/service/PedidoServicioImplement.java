package com.example.SakuraSushi.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.SakuraSushi.domain.entity.DetallePedido;
import com.example.SakuraSushi.domain.entity.Pedido;
import com.example.SakuraSushi.domain.entity.Producto;
import com.example.SakuraSushi.domain.mapper.PedidoMapper;
import com.example.SakuraSushi.dto.DetallePedidoDto;
import com.example.SakuraSushi.dto.PedidoDto;
import com.example.SakuraSushi.util.enums.EstadoPedido;
import com.example.SakuraSushi.util.enums.TipoEntrega;
import com.example.SakuraSushi.persistence.PedidoRepositorio;
import com.example.SakuraSushi.persistence.ProductoRepositorio;
import com.example.SakuraSushi.util.exception.MyException;

@Service
@Transactional
public class PedidoServicioImplement implements PedidoServicio {

    @Autowired
    private PedidoRepositorio pedidoRepo;

    @Autowired
    private ProductoRepositorio productoRepo;

    @Autowired
    private PedidoMapper pedidoMapper;

    @Override
    public PedidoDto crearPedido(PedidoDto pedidoDto) throws MyException {
        // Validar que el pedido tenga detalles
        if (pedidoDto.getDetalles() == null || pedidoDto.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("El pedido debe tener al menos un producto");
        }

        // Convertir DTO a Entity
        Pedido pedido = pedidoMapper.toEntity(pedidoDto);
        pedido.setEstado(EstadoPedido.PENDIENTE);
        pedido.setFechaPedido(LocalDateTime.now());

        // Procesar detalles del pedido
        List<DetallePedido> detalles = new ArrayList<>();
        for (DetallePedidoDto detalleDto : pedidoDto.getDetalles()) {
            DetallePedido detalle = procesarDetallePedido(detalleDto, pedido);
            detalles.add(detalle);
        }

        pedido.setDetalles(detalles);

        // Calcular totales
        pedido.calcularTotal();

        // Establecer fecha de entrega estimada
        if (pedidoDto.getTipoEntrega() == TipoEntrega.DELIVERY) {
            pedido.setFechaEntregaEstimada(LocalDateTime.now().plusMinutes(45));
            // Aplicar costo de envío si es delivery
            if (pedido.getCostoEnvio() == 0.0) {
                pedido.setCostoEnvio(2.50); // Costo base de delivery
                pedido.calcularTotal(); // Recalcular con costo de envío
            }
        } else {
            pedido.setFechaEntregaEstimada(LocalDateTime.now().plusMinutes(30));
        }

        // Guardar pedido
        Pedido pedidoGuardado = pedidoRepo.save(pedido);

        return pedidoMapper.toDTO(pedidoGuardado);
    }

    @Override
    @Transactional(readOnly = true)
    public PedidoDto obtenerPedidoPorId(Long id) throws MyException {
        Pedido pedido = pedidoRepo.findById(id)
                .orElseThrow(() -> new MyException("Pedido no encontrado con ID: " + id));

        return pedidoMapper.toDTO(pedido);
    }

    @Override
    @Transactional(readOnly = true)
    public PedidoDto obtenerPedidoPorNumero(String numeroPedido) throws MyException {
        Pedido pedido = pedidoRepo.findByNumeroPedido(numeroPedido)
                .orElseThrow(() -> new MyException("Pedido no encontrado con número: " + numeroPedido));

        return pedidoMapper.toDTO(pedido);
    }

    @Override
    public PedidoDto actualizarPedido(Long id, PedidoDto pedidoDto) throws MyException {
        Pedido pedidoExistente = pedidoRepo.findById(id)
                .orElseThrow(() -> new MyException("Pedido no encontrado con ID: " + id));

        // Solo permitir actualización si el pedido está en estado PENDIENTE
        if (pedidoExistente.getEstado() != EstadoPedido.PENDIENTE) {
            throw new MyException("No se puede modificar un pedido que no está pendiente");
        }

        // Actualizar campos permitidos
        pedidoExistente.setClienteNombre(pedidoDto.getClienteNombre());
        pedidoExistente.setClienteEmail(pedidoDto.getClienteEmail());
        pedidoExistente.setClienteTelefono(pedidoDto.getClienteTelefono());
        pedidoExistente.setDireccionEntrega(pedidoDto.getDireccionEntrega());
        pedidoExistente.setNotas(pedidoDto.getNotas());

        // Si cambió el tipo de entrega, recalcular costo de envío
        if (pedidoExistente.getTipoEntrega() != pedidoDto.getTipoEntrega()) {
            pedidoExistente.setTipoEntrega(pedidoDto.getTipoEntrega());
            if (pedidoDto.getTipoEntrega() == TipoEntrega.DELIVERY) {
                pedidoExistente.setCostoEnvio(2.50);
                pedidoExistente.setFechaEntregaEstimada(LocalDateTime.now().plusMinutes(45));
            } else {
                pedidoExistente.setCostoEnvio(0.0);
                pedidoExistente.setFechaEntregaEstimada(LocalDateTime.now().plusMinutes(30));
            }
            pedidoExistente.calcularTotal();
        }

        Pedido pedidoActualizado = pedidoRepo.save(pedidoExistente);
        return pedidoMapper.toDTO(pedidoActualizado);
    }

    @Override
    public PedidoDto actualizarEstadoPedido(Long id, EstadoPedido nuevoEstado) throws MyException {
        Pedido pedido = pedidoRepo.findById(id)
                .orElseThrow(() -> new MyException("Pedido no encontrado con ID: " + id));

        // Validar transiciones de estado válidas
        validarTransicionEstado(pedido.getEstado(), nuevoEstado);

        pedido.setEstado(nuevoEstado);

        // Si se marca como entregado, establecer fecha de entrega real
        if (nuevoEstado == EstadoPedido.ENTREGADO) {
            pedido.setFechaEntregaReal(LocalDateTime.now());
        }

        Pedido pedidoActualizado = pedidoRepo.save(pedido);
        return pedidoMapper.toDTO(pedidoActualizado);
    }

    @Override
    public void cancelarPedido(Long id) throws MyException {
        Pedido pedido = pedidoRepo.findById(id)
                .orElseThrow(() -> new MyException("Pedido no encontrado con ID: " + id));

        // Solo se puede cancelar si está pendiente o confirmado
        if (pedido.getEstado() != EstadoPedido.PENDIENTE &&
                pedido.getEstado() != EstadoPedido.CONFIRMADO) {
            throw new MyException("No se puede cancelar un pedido en estado: " + pedido.getEstado());
        }

        pedido.setEstado(EstadoPedido.CANCELADO);
        pedidoRepo.save(pedido);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoDto> obtenerPedidosPorEstado(EstadoPedido estado) {
        List<Pedido> pedidos = pedidoRepo.findByEstado(estado);
        return pedidoMapper.toDTOList(pedidos);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoDto> obtenerPedidosPorCliente(String clienteEmail) {
        List<Pedido> pedidos = pedidoRepo.findByClienteEmail(clienteEmail);
        return pedidoMapper.toDTOList(pedidos);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PedidoDto> obtenerPedidosPaginados(Pageable pageable) {
        Page<Pedido> pedidos = pedidoRepo.findAll(pageable);
        return pedidos.map(pedidoMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PedidoDto> obtenerPedidosPorEstadoPaginados(EstadoPedido estado, Pageable pageable) {
        Page<Pedido> pedidos = pedidoRepo.findByEstadoOrderByFechaPedidoDesc(estado, pageable);
        return pedidos.map(pedidoMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoDto> obtenerPedidosPorRangoFecha(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        List<Pedido> pedidos = pedidoRepo.findPedidosPorRangoFecha(fechaInicio, fechaFin);
        return pedidoMapper.toDTOList(pedidos);
    }

    @Override
    public void marcarComoEntregado(Long id) throws MyException {
        actualizarEstadoPedido(id, EstadoPedido.ENTREGADO);
    }

    @Override
    @Transactional(readOnly = true)
    public Long contarPedidosPorEstadoYFecha(EstadoPedido estado, LocalDateTime fecha) {
        return pedidoRepo.countPedidosPorEstadoYFecha(estado, fecha);
    }

    private DetallePedido procesarDetallePedido(DetallePedidoDto detalleDTO, Pedido pedido) throws MyException {
        // Buscar el producto
        Producto producto = productoRepo.findById(detalleDTO.getProductoId())
                .orElseThrow(() -> new MyException(
                        "Producto no encontrado con ID: " + detalleDTO.getProductoId()));

        // Validar que el producto esté disponible
        if (!producto.isDisponible()) {
            throw new IllegalArgumentException("El producto " + producto.getNombre() + " no está disponible");
        }

        // Crear detalle del pedido
        DetallePedido detalle = new DetallePedido();
        detalle.setPedido(pedido);
        detalle.setProducto(producto);
        detalle.setCantidad(detalleDTO.getCantidad());
        detalle.setPrecioUnitario(producto.getPrecioBase()); // Usar precio actual del producto
        detalle.setNotasEspeciales(detalleDTO.getNotasEspeciales());
        detalle.calcularSubtotal();

        return detalle;
    }

    private void validarTransicionEstado(EstadoPedido estadoActual, EstadoPedido nuevoEstado) throws MyException{
        // Definir transiciones válidas
        List<EstadoPedido> transicionesValidas;

        switch (estadoActual) {
            case PENDIENTE:
                transicionesValidas = Arrays.asList(EstadoPedido.CONFIRMADO, EstadoPedido.CANCELADO);
                break;
            case CONFIRMADO:
                transicionesValidas = Arrays.asList(EstadoPedido.EN_PREPARACION, EstadoPedido.CANCELADO);
                break;
            case EN_PREPARACION:
                transicionesValidas = Arrays.asList(EstadoPedido.LISTO);
                break;
            case LISTO:
                transicionesValidas = Arrays.asList(EstadoPedido.EN_CAMINO, EstadoPedido.ENTREGADO);
                break;
            case EN_CAMINO:
                transicionesValidas = Arrays.asList(EstadoPedido.ENTREGADO);
                break;
            case ENTREGADO:
            case CANCELADO:
                transicionesValidas = Arrays.asList(); // Estados finales
                break;
            default:
                throw new IllegalArgumentException("Estado no reconocido: " + estadoActual);
        }

        if (!transicionesValidas.contains(nuevoEstado)) {
            throw new MyException(
                    String.format("Transición inválida de %s a %s", estadoActual, nuevoEstado));
        }
    }

    /**
     * Obtiene pedidos activos (no entregados ni cancelados)
     */
    @Transactional(readOnly = true)
    public List<PedidoDto> obtenerPedidosActivos() {
        List<EstadoPedido> estadosActivos = Arrays.asList(
                EstadoPedido.PENDIENTE,
                EstadoPedido.CONFIRMADO,
                EstadoPedido.EN_PREPARACION,
                EstadoPedido.LISTO,
                EstadoPedido.EN_CAMINO);

        List<Pedido> pedidos = pedidoRepo.findByEstadoInOrderByFechaPedidoDesc(estadosActivos);
        return pedidoMapper.toDTOList(pedidos);
    }


}
