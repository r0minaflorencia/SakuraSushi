package com.example.SakuraSushi.controller.producto;

import java.net.URI;
import java.util.List;

import org.springframework.data.domain.Page;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.example.SakuraSushi.domain.producto.entity.Producto;
import com.example.SakuraSushi.dto.producto.ProductoDto;
import com.example.SakuraSushi.service.producto.ProductoServicio;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoServicio productoServicio;

    public ProductoController(ProductoServicio productoServicio) {
        this.productoServicio = productoServicio;
    }

    @GetMapping
    public ResponseEntity<Page<ProductoDto>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        // Llama al servicio, que se encarga de la lógica de paginación
        // y del mapeo a DTOs.
        Page<ProductoDto> productosPaginados = productoServicio.obtenerTodos(pageable);

        // Retorna el resultado con un código de estado 200 OK
        return ResponseEntity.ok(productosPaginados);
    }

    @PostMapping
    public ResponseEntity<ProductoDto> createProduct(@RequestBody ProductoDto dto) {
        try {
            Producto nuevoProducto = productoServicio.guardarProducto(dto); // El servicio devuelve la entidad
                                                                                  // guardada

            // Convierte la entidad guardada de nuevo a DTO para la respuesta
            ProductoDto responseDto = productoServicio.convertEntityToDto(nuevoProducto);

            URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(responseDto.getId()) // Usar el ID del DTO de respuesta
                    .toUri();

            return ResponseEntity.created(location).body(responseDto); // Devuelve el DTO en el cuerpo

        } catch (Exception e) {
            System.err.println("Error al crear producto: " + e.getMessage());
            e.printStackTrace(); // Imprime la traza completa para depuración
            // Devuelve un ResponseEntity con un mensaje de error o un DTO vacío si es
            // necesario
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

    @GetMapping("/busqueda")
    public List<Producto> searchProducts(@RequestParam("q") String searchTerm) {
        return productoServicio.buscarPorTermino(searchTerm);
    }
}
