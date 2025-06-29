package com.menu_service.Repository;

import com.menu_service.model.Category;
import com.menu_service.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    //Find all available menu items

    List<MenuItem> findByIsAvailableTrueOrderByDisplayOrderAsc();

    // Find menu items by category and availability

    List<MenuItem> findByCategoryAndIsAvailableTrueOrderByDisplayOrderAsc(Category category);

    // Find menu items by category ID

    @Query("SELECT m FROM MenuItem m WHERE m.category.categoryId = :categoryId " +
            "AND m.isAvailable = true ORDER BY m.displayOrder ASC")
    List<MenuItem> findByCategoryIdAndIsAvailableTrue(@Param("categoryId") Long categoryId);

    // Find featured menu items

    List<MenuItem> findByIsFeaturedTrueAndIsAvailableTrueOrderByDisplayOrderAsc();

    // Search menu items by name (case-insensitive)

    @Query("SELECT m FROM MenuItem m WHERE " +
            "LOWER(m.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "AND m.isAvailable = true " +
            "ORDER BY m.displayOrder ASC")
    List<MenuItem> findByItemNameContainingIgnoreCase(@Param("keyword") String keyword);

    //Find menu items by price range

    @Query("SELECT m FROM MenuItem m WHERE " +
            "m.price BETWEEN :minPrice AND :maxPrice " +
            "AND m.isAvailable = true " +
            "ORDER BY m.price ASC")
    List<MenuItem> findByPriceBetweenAndIsAvailableTrue(
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice
    );

    // Find menu items by dietary information

    @Query("SELECT m FROM MenuItem m WHERE " +
            "LOWER(m.dietaryInfo) LIKE LOWER(CONCAT('%', :dietaryInfo, '%')) " +
            "AND m.isAvailable = true " +
            "ORDER BY m.displayOrder ASC")
    List<MenuItem> findByDietaryInfoContainingIgnoreCase(@Param("dietaryInfo") String dietaryInfo);

    // Find menu items by spice level

    List<MenuItem> findBySpiceLevelAndIsAvailableTrueOrderByDisplayOrderAsc(Integer spiceLevel);

    //Check if menu item exists by name in category

    boolean existsByItemNameIgnoreCaseAndCategory(String itemName, Category category);

    // Count menu items by category

    long countByCategoryAndIsAvailableTrue(Category category);

    //Count all available menu items

    long countByIsAvailableTrue();

    // Get the maximum display order for positioning new items */

    @Query("SELECT COALESCE(MAX(m.displayOrder), 0) FROM MenuItem m WHERE m.category = :category")
    Integer findMaxDisplayOrderByCategory(@Param("category") Category category);

    // Find menu items with preparation time less than specified minutes

    @Query("SELECT m FROM MenuItem m WHERE " +
            "m.preparationTime <= :maxTime " +
            "AND m.isAvailable = true " +
            "ORDER BY m.preparationTime ASC")
    List<MenuItem> findByMaxPreparationTime(@Param("maxTime") Integer maxTime);

    // Advanced search with multiple criteria

    @Query("SELECT m FROM MenuItem m WHERE " +
            "(:categoryId IS NULL OR m.category.categoryId = :categoryId) " +
            "AND (:minPrice IS NULL OR m.price >= :minPrice) " +
            "AND (:maxPrice IS NULL OR m.price <= :maxPrice) " +
            "AND (:spiceLevel IS NULL OR m.spiceLevel = :spiceLevel) " +
            "AND (:keyword IS NULL OR LOWER(m.itemName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND m.isAvailable = true " +
            "ORDER BY m.displayOrder ASC")
    List<MenuItem> findByMultipleCriteria(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("spiceLevel") Integer spiceLevel,
            @Param("keyword") String keyword
    );
}