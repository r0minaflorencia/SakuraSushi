package com.example.SakuraSushi.persistence;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.SakuraSushi.domain.entity.Producto;

@Repository
public interface ProductoRepositorio extends JpaRepository<Producto, Long> {

       // Búsquedas básicas
       List<Producto> findByDisponibleTrue();

       @Query("SELECT DISTINCT TYPE(p) FROM Producto p")
       List<Class<? extends Producto>> findDistinctProductTypes();

       @Query(value = "SELECT p FROM Producto p LEFT JOIN FETCH p.productosIncluidos pi " +
                     "WHERE TYPE(p) = Combo", countQuery = "SELECT COUNT(p) FROM Producto p")
       Page<Producto> findAllWithComboDetails(Pageable pageable);

       @Query("SELECT p FROM Producto p WHERE p.class = :categoria")
       List<Producto> findBycategoria(@Param("categoria") String categoria);

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

       // Búsqueda avanzada
       @Query("SELECT p FROM Producto p WHERE " +
                     "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                     "LOWER(p.descripcion) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
       List<Producto> searchProductos(@Param("searchTerm") String searchTerm);

}
