package com.example.SakuraSushi.dto;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class NigiriDto extends ProductoDto {

    private List<String> toppings;
    private Integer piezas;
    private Boolean tieneWasabi;

    public NigiriDto() {
        setDType("NIGIRI");
    }

}
