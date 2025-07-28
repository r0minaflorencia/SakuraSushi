package com.example.SakuraSushi.service.producto;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.SakuraSushi.domain.producto.entity.Producto;
import com.example.SakuraSushi.domain.producto.factory.ProductoDtoFactory;
import com.example.SakuraSushi.domain.producto.factory.ProductoFactory;
import com.example.SakuraSushi.dto.producto.ProductoDto;
import com.example.SakuraSushi.persistence.producto.ProductoRepositorio;
import com.example.SakuraSushi.util.exception.MyException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductoServicio {

    private final ProductoRepositorio ProductoRepository;
    private final ProductoFactory ProductoFactory;
    private final ProductoDtoFactory ProductoDtoFactory;

    private Producto findProductoById(Long id) throws MyException {
        return ProductoRepository.findById(id)
                .orElseThrow(() -> new MyException("Producto no encontrado con ID: " + id));
    }

    private ProductoDto convertToDto(Producto Producto) {
        ProductoDto dto = ProductoDtoFactory.crearDto(Producto);
        dto.setPrecioFinal(calcularPrecioFinal(Producto.getId()));
        return dto;
    }

    private double calcularPrecioFinal(Long id) {
       return 0;
    }

    private void updateProductoFromDto(Producto Producto, ProductoDto dto) {
        Producto.setNombre(dto.getNombre());
        Producto.setDescripcion(dto.getDescripcion());
        Producto.setPrecioBase(dto.getPrecioBase());
        Producto.setStock(dto.getStock());
        Producto.setDisponible(dto.isDisponible());
        Producto.setIngredientes(dto.getIngredientes());
        Producto.setEsPicante(dto.isEsPicante());
        Producto.setEsVegetariano(dto.isEsVegetariano());
        Producto.setEsVegano(dto.isEsVegano());
        Producto.setEsGlutenFree(dto.isEsGlutenFree());
    }

}
