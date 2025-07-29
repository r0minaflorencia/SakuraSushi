package com.example.SakuraSushi.controller.producto;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.SakuraSushi.domain.producto.entity.Producto;
import com.example.SakuraSushi.service.producto.ProductoServicio;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/productos")
public class ProductoController {

    @Autowired
    private ProductoServicio productoServicio;

    @GetMapping
    public List<Producto> getAllProducts() {
        return productoServicio.obtenerTodos();
    }

    @GetMapping("/categoria/{category}")
    public List<Producto> getProductsByCategory(@PathVariable String category) {
        return productoServicio.buscarPorCategoria(category);
    }

    /*
     * @GetMapping("/busqueda/{searchTerm}")
     * public List<Producto> searchProducts(@PathVariable String searchTerm) {
     * return productoServicio.buscarPorTermino(searchTerm);
     * }
     */

}
