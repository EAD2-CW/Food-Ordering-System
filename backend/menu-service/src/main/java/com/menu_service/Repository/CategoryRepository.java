package com.menu_service.Repository;

import com.menu_service.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Find all active categories ordered by display order

    List<Category> findByIsActiveTrueOrderByDisplayOrderAsc();

    // Find category by name (case-insensitive)

    Optional<Category> findByCategoryNameIgnoreCase(String categoryName);

    // Check if category exists by name

    boolean existsByCategoryNameIgnoreCase(String categoryName);

    // Find categories by active status

    List<Category> findByIsActiveOrderByDisplayOrderAsc(Boolean isActive);

    // Get categories with their menu items count

    @Query("SELECT c FROM Category c LEFT JOIN c.menuItems m " +
            "WHERE c.isActive = true " +
            "GROUP BY c.categoryId " +
            "HAVING COUNT(m) > 0 " +
            "ORDER BY c.displayOrder ASC")
    List<Category> findActiveCategoriesWithMenuItems();

    // Find categories by name containing keyword (case-insensitive)

    @Query("SELECT c FROM Category c WHERE " +
            "LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "AND c.isActive = true " +
            "ORDER BY c.displayOrder ASC")
    List<Category> findByNameContainingIgnoreCase(@Param("keyword") String keyword);

    // Get the maximum display order for positioning new categories

    @Query("SELECT COALESCE(MAX(c.displayOrder), 0) FROM Category c")
    Integer findMaxDisplayOrder();

    // Count active categories

    long countByIsActiveTrue();
}