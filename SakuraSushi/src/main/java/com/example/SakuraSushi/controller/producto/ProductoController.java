package com.example.SakuraSushi.controller.producto;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public ResponseEntity<Page<Producto>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String categoria) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Producto> productos;

        if (categoria != null && !categoria.isEmpty()) {
            // Convertir List a Page
            List<Producto> listaProductos = productoServicio.buscarPorCategoria(categoria);
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), listaProductos.size());
            List<Producto> pageContent = listaProductos.subList(start, end);
            productos = new PageImpl<>(pageContent, pageable, listaProductos.size());
        } else {
            productos = productoServicio.obtenerTodos(pageable);
        }

        return ResponseEntity.ok(productos);
    }

    @PostMapping
    public ResponseEntity<Producto> createProduct(@RequestBody Producto producto) {
        try {
            Producto nuevoProducto = productoServicio.guardarProducto(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/categorias")
    public List<String> getAllCategories() {
        return productoServicio.obtenerTodasLasCategorias();
    }

    @GetMapping("/categorias/{categoria}")
    public List<Producto> getProductsBycategoria(@PathVariable String categoria) {
        return productoServicio.buscarPorCategoria(categoria);
    }

    @GetMapping("/busqueda/{searchTerm}")
    public List<Producto> searchProducts(@RequestParam String searchTerm) {
        return productoServicio.buscarPorTermino(searchTerm);
    }

}
