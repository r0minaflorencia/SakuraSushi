package com.example.SakuraSushi.domain.producto.factory;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.SakuraSushi.domain.producto.entity.Combo;
import com.example.SakuraSushi.domain.producto.entity.Maki;
import com.example.SakuraSushi.domain.producto.entity.Nigiri;
import com.example.SakuraSushi.domain.producto.entity.Producto;
import com.example.SakuraSushi.domain.producto.entity.Sashimi;

@Component
public class ProductoFactory {

    public Producto crearProducto(String tipoDeProducto) {
        switch (tipoDeProducto.toUpperCase()) {
            case "SASHIMI":
                return new Sashimi();
            case "MAKI":
                return new Maki();
            case "NIGIRI":
                return new Nigiri();
            case "COMBO":
                return new Combo();
            default:
                throw new IllegalArgumentException("Tipo de producto no soportado: " + tipoDeProducto);
        }
    }
    
    public Producto crearSashimi(String tipoPescado, String origin, int piezas) {
        Sashimi sashimi = new Sashimi();
        sashimi.setTipoPescado(tipoPescado);
        sashimi.setPiezas(piezas);
        return sashimi;
    }
    
    public Producto crearMaki(String relleno, int piezas) {
        Maki maki = new Maki();
        maki.setRelleno(relleno);
        maki.setPiezas(piezas);
        return maki;
    }
    
    public Producto crearNigiri(List<String> toppings, boolean tieneWasabi) {
        Nigiri nigiri = new Nigiri();
        nigiri.setToppings(toppings);
        nigiri.setTieneWasabi(tieneWasabi);
        return nigiri;
    }
    
}
