package com.example.SakuraSushi.dto.producto;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ComboDto extends ProductoDto {

    private List<Long> productosIncluidosId; 
    private int porcentajeDescuento;
    private boolean incluyeSalsaSoja;
    private boolean incluyeWasabi;
    private boolean incluyeJengibre;
    
}
