package com.example.SakuraSushi.domain.producto.factory;

import org.springframework.stereotype.Component;

import com.example.SakuraSushi.domain.producto.entity.Combo;
import com.example.SakuraSushi.domain.producto.entity.Maki;
import com.example.SakuraSushi.domain.producto.entity.Nigiri;
import com.example.SakuraSushi.domain.producto.entity.Producto;
import com.example.SakuraSushi.domain.producto.entity.Sashimi;
import com.example.SakuraSushi.dto.producto.ComboDto;
import com.example.SakuraSushi.dto.producto.MakiDto;
import com.example.SakuraSushi.dto.producto.NigiriDto;
import com.example.SakuraSushi.dto.producto.ProductoDto;
import com.example.SakuraSushi.dto.producto.SashimiDto;

@Component
public class ProductoDtoFactory {

    public ProductoDto crearDto(Producto producto) {
        switch (producto.getTipoDeProducto()) {
            case "SASHIMI":
                return crearSashimiDto((Sashimi) producto);
            case "MAKI":
                return crearMakiDto((Maki) producto);
            case "NIGIRI":
                return crearNigiriDto((Nigiri) producto);
            case "COMBO":
                return crearComboDto((Combo) producto);
            default:
                throw new IllegalArgumentException("Tipo de producto no soportado: " + producto.getTipoDeProducto());
        }
    }

    private SashimiDto crearSashimiDto(Sashimi sashimi) {
        SashimiDto dto = new SashimiDto();
        mapCommonFields(sashimi, dto);
        dto.setTipoPescado(sashimi.getTipoPescado());
        dto.setPiezas(sashimi.getPiezas());
        return dto;
    }

    private MakiDto crearMakiDto(Maki maki) {
        MakiDto dto = new MakiDto();
        mapCommonFields(maki, dto);
        dto.setPiezas(maki.getPiezas());
        dto.setArrozTipo(maki.getArrozTipo());
        dto.setTipoNori(maki.getTipoNori());
        dto.setToppings(maki.getToppings());
        return dto;
    }

    private NigiriDto crearNigiriDto(Nigiri nigiri) {
        NigiriDto dto = new NigiriDto();
        mapCommonFields(nigiri, dto);
        dto.setToppings(nigiri.getToppings());
        dto.setPiezas(nigiri.getPiezas());
        dto.setTieneWasabi(nigiri.getTieneWasabi());
        return dto;
    }

    private ComboDto crearComboDto(Combo combo) {
        ComboDto dto = new ComboDto();
        mapCommonFields(combo, dto);
        dto.setProductosIncluidosId(combo.getProductosIncluidosId());
        dto.setPorcentajeDescuento(combo.getPorcentajeDescuento());
        dto.setIncluyeSalsaSoja(combo.isIncluyeSalsaSoja());
        dto.setIncluyeWasabi(combo.isIncluyeWasabi());
        dto.setIncluyeJengibre(combo.isIncluyeJengibre());
        return dto;
    }

    private void mapCommonFields(Producto producto, ProductoDto dto) {
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecioBase(producto.getPrecioBase());
        dto.setPrecioFinal(producto.calcularPrecioFinal());
        dto.setStock(producto.getStock());
        dto.setDisponible(producto.isDisponible());
        dto.setIngredientes(producto.getIngredientes());
        dto.setEsPicante(producto.isEsPicante());
        dto.setEsVegetariano(producto.isEsVegetariano());
        dto.setEsVegano(producto.isEsVegano());
        dto.setEsGlutenFree(producto.isEsGlutenFree());
        dto.setCategoria(producto.getCategoria());
        dto.setTipoDeProducto(producto.getTipoDeProducto());
    }
}
