package com.example.SakuraSushi.service.producto;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.SakuraSushi.domain.producto.entity.Combo;
import com.example.SakuraSushi.domain.producto.entity.Maki;
import com.example.SakuraSushi.domain.producto.entity.Nigiri;
import com.example.SakuraSushi.domain.producto.entity.Producto;
import com.example.SakuraSushi.domain.producto.entity.Sashimi;
import com.example.SakuraSushi.domain.producto.factory.ProductoFactory;
import com.example.SakuraSushi.dto.producto.ComboDto;
import com.example.SakuraSushi.dto.producto.MakiDto;
import com.example.SakuraSushi.dto.producto.NigiriDto;
import com.example.SakuraSushi.dto.producto.ProductoDto;
import com.example.SakuraSushi.dto.producto.SashimiDto;
import com.example.SakuraSushi.persistence.producto.ProductoRepositorio;
import com.example.SakuraSushi.util.exception.MyException;

@Service
@Transactional
public class ProductoServicio {

    private final ProductoRepositorio productoRepository;
    private final ProductoFactory productoFactory;

    public ProductoServicio(ProductoRepositorio productoRepository, ProductoFactory productoFactory) {
        this.productoRepository = productoRepository;
        this.productoFactory = productoFactory;
    }

    public Producto guardarProducto(ProductoDto productoDto) {

        // Convertir el DTO a la Entidad correspondiente
        Producto productoEntity = convertDtoToEntity(productoDto);

        // Validaciones de negocio adicionales (opcional, pero buena práctica)
        if (productoEntity.getNombre() == null || productoEntity.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto no puede estar vacío.");
        }
        if (productoEntity.getPrecioBase() < 0) {
            throw new IllegalArgumentException("El precio base debe ser mayor a cero.");
        }

        return productoRepository.save(productoEntity);
    }

    private Producto convertDtoToEntity(ProductoDto dto) {
        Producto entity;

        switch (dto.getDType()) {
            case "MAKI":
                entity = new Maki();
                break;
            case "NIGIRI":
                entity = new Nigiri();
                break;
            case "COMBO":
                entity = new Combo();
                break;
            case "SASHIMI":
                entity = new Sashimi();
                break;
            default:
                throw new IllegalArgumentException("Tipo de producto desconocido: " + dto.getDType());
        }

        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion() != null ? dto.getDescripcion() : ""); // descripción por defecto
        entity.setPrecioBase(dto.getPrecioBase()); // precioBase es double primitivo, se inicializa a 0.0 si no se setea

        // asignar stock:
        if (dto.getStock() != null) {
            entity.setStock(dto.getStock());
        } else {
            entity.setStock(1); // valor por defecto
        }

        // valores por defecto para booleanos:
        entity.setDisponible(true);
        entity.setEsGlutenFree(false);
        entity.setEsPicante(false);
        entity.setEsVegano(false);
        entity.setEsVegetariano(false);

        // --- Copiar propiedades específicas de cada subclase ---
        if (entity instanceof Nigiri && dto instanceof NigiriDto) {
            Nigiri nigiriEntity = (Nigiri) entity;
            NigiriDto nigiriDto = (NigiriDto) dto;
            nigiriEntity.setCategoria("Nigiri");
            nigiriEntity.setPiezas(nigiriDto.getPiezas() != null ? nigiriDto.getPiezas() : 0); // Default 0 piezas
            nigiriEntity.setTieneWasabi(nigiriDto.getTieneWasabi() != null ? nigiriDto.getTieneWasabi() : false);
            nigiriEntity.setToppings(nigiriDto.getToppings() != null ? nigiriDto.getToppings() : null);
        } else if (entity instanceof Maki && dto instanceof MakiDto) {
            Maki makiEntity = (Maki) entity;
            MakiDto makiDto = (MakiDto) dto;
            entity.setCategoria("Maki");
        } else if (entity instanceof Combo && dto instanceof ComboDto) {
            Combo comboEntity = (Combo) entity;
            ComboDto comboDto = (ComboDto) dto;
            entity.setCategoria("Combo");
            comboEntity.setPorcentajeDescuento(0);
            comboEntity.setProductosIncluidos(
                    comboDto.getProductosIncluidos() != null ? comboDto.getProductosIncluidos().stream()
                            .collect(Collectors.toList()) : null);
        } else if (entity instanceof Sashimi && dto instanceof SashimiDto) {
            Sashimi sashimiEntity = (Sashimi) entity;
            SashimiDto sashimiDto = (SashimiDto) dto;
            entity.setCategoria("Sashimi");
            sashimiEntity.setTipoPescado(sashimiDto.getTipoPescado() != null ? sashimiDto.getTipoPescado() : "");
        } else {
            entity.setCategoria("General"); // categoría por defecto
        }

        return entity;
    }

    /*
     * Método de ejemplo para convertir Entidad a DTO (para la respuesta del
     * controlador)
     */
    @SuppressWarnings("null")
    public ProductoDto convertEntityToDto(Producto entity) {

        ProductoDto dto = null;

        // Instanciar el DTO de subclase correcto
        if (entity instanceof Maki) {
            dto = new MakiDto();
            Maki makiEntity = (Maki) entity;
        } else if (entity instanceof Nigiri) {
            dto = new NigiriDto();
            Nigiri nigiriEntity = (Nigiri) entity;
            ((NigiriDto) dto).setPiezas(nigiriEntity.getPiezas());
            ((NigiriDto) dto).setTieneWasabi(nigiriEntity.getTieneWasabi());
            ((NigiriDto) dto).setToppings(nigiriEntity.getToppings());
        } else if (entity instanceof Combo) {
            dto = new ComboDto();
            Combo comboEntity = (Combo) entity;
            ((ComboDto) dto).setPorcentajeDescuento(comboEntity.getPorcentajeDescuento());
            // Mapear productos incluidos si es necesario
        } else if (entity instanceof Sashimi) {
            dto = new SashimiDto();
            Sashimi sashimiEntity = (Sashimi) entity;
            ((SashimiDto) dto).setTipoPescado(sashimiEntity.getTipoPescado());
        }

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setPrecioBase(entity.getPrecioBase());
        dto.setCategoria(entity.getCategoria());
        dto.setDisponible(entity.isDisponible());
        dto.setEsGlutenFree(entity.isEsGlutenFree());
        dto.setEsPicante(entity.isEsPicante());
        dto.setEsVegano(entity.isEsVegano());
        dto.setEsVegetariano(entity.isEsVegetariano());
        dto.setStock(entity.getStock());

        if (entity instanceof Maki) {
            dto.setDType("MAKI");
            dto.setCategoria("Maki");
        } else if (entity instanceof Nigiri) {
            dto.setDType("NIGIRI");
            dto.setCategoria("Nigiri");
        } else if (entity instanceof Combo) {
            dto.setDType("COMBO");
            dto.setCategoria("Combo");
        } else if (entity instanceof Sashimi) {
            dto.setDType("SASHIMI");
            dto.setCategoria("Sashimi");
        }

        return dto;
    }

    public ProductoDto findProductoById(Long id) throws MyException {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new MyException("Producto no encontrado con ID: " + id));
        return productoFactory.toDto(producto);
    }

    public Page<ProductoDto> obtenerTodos(Pageable pageable) {
        // 1. Obtener la página de entidades (Producto) del repositorio
        Page<Producto> productos = productoRepository.findAll(pageable);

        // 2. Mapear cada entidad Producto a un ProductoDto usando la fábrica
        // El método .map() itera sobre cada elemento de la página y aplica la función
        // de mapeo.
        return productos.map(productoFactory::toDto);
    }

    public List<Producto> buscarPorCategoria(String categoria) {

        return productoRepository.findAll().stream()
                .filter(p -> p.getClass().getSimpleName().equalsIgnoreCase(categoria))
                .collect(Collectors.toList());
    }

    public List<String> obtenerTodasLasCategorias() {
        return productoRepository.findDistinctProductTypes().stream()
                .map(Class::getSimpleName)
                .collect(Collectors.toList());
    }

    public List<Producto> buscarDisponibles() {
        return productoRepository.findByDisponibleTrue();
    }

    public List<Producto> buscarPorTermino(String searchTerm) {
        return productoRepository.searchProductos(searchTerm);
    }

    private void updateProductoFromDto(Producto producto, ProductoDto dto) {
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecioBase(dto.getPrecioBase());
        producto.setStock(dto.getStock());
        producto.setDisponible(dto.isDisponible());
        producto.setEsPicante(dto.isEsPicante());
        producto.setEsVegetariano(dto.isEsVegetariano());
        producto.setEsVegano(dto.isEsVegano());
        producto.setEsGlutenFree(dto.isEsGlutenFree());
    }

}
