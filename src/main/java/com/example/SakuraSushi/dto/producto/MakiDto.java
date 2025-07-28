package com.example.SakuraSushi.dto.producto;

import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class MakiDto extends ProductoDto{

    private String relleno;
    private Integer piezas;
    private String arrozTipo;
    private String tipoNori;
    private List<String> toppings;

}
