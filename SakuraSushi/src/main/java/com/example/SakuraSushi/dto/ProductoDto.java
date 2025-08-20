package com.example.SakuraSushi.dto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonSubTypes.Type;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "dType"
)
@JsonSubTypes({
    @Type(value = MakiDto.class, name = "MAKI"),
    @Type(value = NigiriDto.class, name = "NIGIRI"),
    @Type(value = ComboDto.class, name = "COMBO"),
    @Type(value = SashimiDto.class, name = "SASHIMI")
})
@Data // Genera getters, setters, toString, equals, hashCode
@NoArgsConstructor // Genera un constructor sin argumentos (CRUCIAL para Jackson)
@AllArgsConstructor // Genera un constructor con todos los argumentos (útil)
public abstract class ProductoDto {
    private Long id;
    private String nombre;
    private String descripcion;
    private double precioBase;
    private double precioFinal;
    private Integer stock;
    private boolean disponible;
    private boolean esPicante;
    private boolean esVegetariano;
    private boolean esVegano;
    private boolean esGlutenFree;
    private String categoria;
    private String dType;


    
}
