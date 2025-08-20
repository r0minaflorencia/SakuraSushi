package com.example.SakuraSushi.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class SashimiDto extends ProductoDto {

    private String tipoPescado;
    private Integer piezas;

    public SashimiDto() {
        setDType("SASHIMI"); 
    }

}
