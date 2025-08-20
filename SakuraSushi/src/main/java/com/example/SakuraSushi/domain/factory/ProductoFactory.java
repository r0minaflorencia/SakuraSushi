package com.example.SakuraSushi.domain.factory;

import org.springframework.stereotype.Component;

import com.example.SakuraSushi.domain.entity.Combo;
import com.example.SakuraSushi.domain.entity.Maki;
import com.example.SakuraSushi.domain.entity.Nigiri;
import com.example.SakuraSushi.domain.entity.Producto;
import com.example.SakuraSushi.domain.entity.Sashimi;
import com.example.SakuraSushi.dto.ComboDto;
import com.example.SakuraSushi.dto.MakiDto;
import com.example.SakuraSushi.dto.NigiriDto;
import com.example.SakuraSushi.dto.ProductoDto;
import com.example.SakuraSushi.dto.SashimiDto;

@Component
public class ProductoFactory {

    public ProductoDto toDto(Producto producto) {
        switch (producto.getDType()) {
            case "SASHIMI":
                return crearSashimiDto((Sashimi) producto);
            case "MAKI":
                return crearMakiDto((Maki) producto);
            case "NIGIRI":
                return crearNigiriDto((Nigiri) producto);
            case "COMBO":
                return crearComboDto((Combo) producto);
            default:
                throw new IllegalArgumentException("Tipo de producto no soportado: " + producto.getDType());
        }
    }

    public Producto toEntity(ProductoDto dto) {
        if (dto == null) {
            return null;
        }

        switch (dto.getDType()) {
            case "SASHIMI":
                return crearSashimi((SashimiDto) dto);
            case "MAKI":
                return crearMaki((MakiDto) dto);
            case "NIGIRI":
                return crearNigiri((NigiriDto) dto);
            case "COMBO":
                return crearCombo((ComboDto) dto);
            default:
                throw new IllegalArgumentException("Tipo de producto no soportado: " + dto.getDType());
        }
    }

    private Sashimi crearSashimi(SashimiDto dto) {
        Sashimi sashimi = new Sashimi();
        mapCommonFields(sashimi, dto);

        // Campos específicos de Sashimi
        sashimi.setTipoPescado(dto.getTipoPescado());
        sashimi.setPiezas(dto.getPiezas());

        return sashimi;
    }

    private Maki crearMaki(MakiDto dto) {
        Maki maki = new Maki();
        mapCommonFields(maki, dto);

        maki.setPiezas(dto.getPiezas());

        return maki;
    }

    private Nigiri crearNigiri(NigiriDto dto) {
        Nigiri nigiri = new Nigiri();
        mapCommonFields(nigiri, dto);

        // Campos específicos de Nigiri
        nigiri.setPiezas(dto.getPiezas());
        nigiri.setTieneWasabi(dto.getTieneWasabi());
        nigiri.setToppings(dto.getToppings());

        return nigiri;
    }

    private Combo crearCombo(ComboDto dto) {
        Combo combo = new Combo();
        mapCommonFields(combo, dto);

        // combo.setProductos(dto.getProductos());
        // combo.setDescuento(dto.getDescuento());

        return combo;
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
        dto.setProductosIncluidos(combo.getProductosIncluidos());
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
        dto.setEsPicante(producto.isEsPicante());
        dto.setEsVegetariano(producto.isEsVegetariano());
        dto.setEsVegano(producto.isEsVegano());
        dto.setEsGlutenFree(producto.isEsGlutenFree());
        dto.setCategoria(producto.getCategoria());
        dto.setDType(producto.getDType());
    }

}
