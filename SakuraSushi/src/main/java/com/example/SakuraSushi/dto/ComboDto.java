package com.example.SakuraSushi.dto;

import java.util.List;

import com.example.SakuraSushi.domain.entity.Producto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ComboDto extends ProductoDto {

    private List<Producto> productosIncluidos; 
    private int porcentajeDescuento;
    private boolean incluyeSalsaSoja;
    private boolean incluyeWasabi;
    private boolean incluyeJengibre;

      public ComboDto() {
        setDType("COMBO"); 
    }
    
}
