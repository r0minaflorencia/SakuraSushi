package com.example.SakuraSushi.controller.pedido;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.SakuraSushi.dto.pedido.PedidoDto;
import com.example.SakuraSushi.service.pedido.PedidoServicio;
import com.example.SakuraSushi.util.enums.EstadoPedido;
import com.example.SakuraSushi.util.exception.MyException;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    @Autowired
    private PedidoServicio pedidoServicio;
    
    @PostMapping("/pedidos")
    public ResponseEntity<PedidoDto> crearPedido(@RequestBody PedidoDto pedidoDto) throws MyException {
        PedidoDto nuevoPedido = pedidoServicio.crearPedido(pedidoDto);
        return ResponseEntity.ok(nuevoPedido);
    }

    @PutMapping("/pedidos/{id}/estado")
    public ResponseEntity<PedidoDto> cambiarEstado(@PathVariable Long id,
            @RequestParam EstadoPedido estado) throws MyException {
        PedidoDto pedido = pedidoServicio.actualizarEstadoPedido(id, estado);
        return ResponseEntity.ok(pedido);
    }

}
