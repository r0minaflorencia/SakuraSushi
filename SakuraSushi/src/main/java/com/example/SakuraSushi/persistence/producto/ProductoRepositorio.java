package com.example.SakuraSushi.persistence.producto;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.SakuraSushi.domain.producto.entity.Producto;

@Repository
public interface ProductoRepositorio extends JpaRepository<Producto, Long> {

       // Búsquedas básicas
       List<Producto> findByDisponibleTrue();

       List<Producto> findByDisponibleTrueOrderByStockDesc();

       // Búsquedas por tipo de Producto
       @Query("SELECT p FROM Producto p WHERE TYPE(p) = :ProductoClass")
       List<Producto> findByProductoType(@Param("ProductoClass") Class<? extends Producto> ProductoClass);

       @Query("SELECT p FROM Producto p WHERE p.class = :ProductoType")
       List<Producto> findByProductoType(@Param("ProductoType") String ProductoType);

       // Búsquedas por características dietéticas
       @Query("SELECT p FROM Producto p WHERE " +
                     "(:vegetariano = false OR p.esVegetariano = true) AND " +
                     "(:vegano = false OR p.esVegano = true) AND " +
                     "(:glutenFree = false OR p.esGlutenFree = true) AND " +
                     "p.disponible = true")
       List<Producto> findByDietaryRestrictions(@Param("vegetariano") boolean vegetariano,
                     @Param("vegano") boolean vegano,
                     @Param("glutenFree") boolean glutenFree);

       List<Producto> findByEsPicanteTrue();

       List<Producto> findByEsVegetarianoTrue();

       List<Producto> findByEsVeganoTrue();

       @Query("SELECT p FROM Producto p WHERE p.esGlutenFree = true")
       List<Producto> findAllGlutenFree();

       // Búsquedas por precio
       List<Producto> findByPrecioBaseBetween(double minPrecio, double maxPrecio);

       // Búsquedas por ingredientes
       @Query("SELECT p FROM Producto p JOIN p.ingredientes i WHERE LOWER(i) LIKE LOWER(CONCAT('%', :ingrediente, '%'))")
       List<Producto> findByIngrediente(@Param("ingrediente") String ingredientes);

       // Búsqueda avanzada
       @Query("SELECT p FROM Producto p WHERE " +
                     "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                     "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                     "EXISTS (SELECT i FROM p.ingredientes i WHERE LOWER(i) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
       List<Producto> searchProductos(@Param("searchTerm") String searchTerm);

}
