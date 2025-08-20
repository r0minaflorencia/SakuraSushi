package com.example.SakuraSushi.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class GeneralDto extends ProductoDto {

    public GeneralDto() {
        setDType("GENERAL");
    }

}
