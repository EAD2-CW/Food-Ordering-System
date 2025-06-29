package com.menu_service.Controller;

import com.menu_service.dto.CategoryDTO;
import com.menu_service.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // Get all active categories

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllActiveCategories() {
        List<CategoryDTO> categories = categoryService.getAllActiveCategories();
        return ResponseEntity.ok(categories);
    }

    // Get category by ID
    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long categoryId) {
        CategoryDTO category = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(category);
    }

    // Create a new category
    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO createdCategory = categoryService.createCategory(categoryDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    //Update an existing category
    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryDTO> updateCategory(
            @PathVariable Long categoryId,
            @Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO updatedCategory = categoryService.updateCategory(categoryId, categoryDTO);
        return ResponseEntity.ok(updatedCategory);
    }

    // Delete a category (soft delete)

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

    //Search categories by name

    @GetMapping("/search")
    public ResponseEntity<List<CategoryDTO>> searchCategoriesByName(@RequestParam String keyword) {
        List<CategoryDTO> categories = categoryService.searchCategoriesByName(keyword);
        return ResponseEntity.ok(categories);
    }

    // Get categories that have menu items
    @GetMapping("/with-items")
    public ResponseEntity<List<CategoryDTO>> getCategoriesWithMenuItems() {
        List<CategoryDTO> categories = categoryService.getCategoriesWithMenuItems();
        return ResponseEntity.ok(categories);
    }

    // Check if category exists by name

    @GetMapping("/exists")
    public ResponseEntity<Boolean> checkCategoryExists(@RequestParam String categoryName) {
        boolean exists = categoryService.existsByCategoryName(categoryName);
        return ResponseEntity.ok(exists);
    }

    //Update category display order
    @PatchMapping("/{categoryId}/display-order")
    public ResponseEntity<CategoryDTO> updateCategoryDisplayOrder(
            @PathVariable Long categoryId,
            @RequestParam Integer displayOrder) {
        CategoryDTO updatedCategory = categoryService.updateCategoryDisplayOrder(categoryId, displayOrder);
        return ResponseEntity.ok(updatedCategory);
    }

    // Toggle category active status
    @PatchMapping("/{categoryId}/toggle-status")
    public ResponseEntity<CategoryDTO> toggleCategoryStatus(@PathVariable Long categoryId) {
        CategoryDTO updatedCategory = categoryService.toggleCategoryStatus(categoryId);
        return ResponseEntity.ok(updatedCategory);
    }

    //Get category statistics
    @GetMapping("/{categoryId}/stats")
    public ResponseEntity<CategoryDTO> getCategoryStatistics(@PathVariable Long categoryId) {
        CategoryDTO category = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(category);
    }

    // Bulk update categories display order
    @PutMapping("/bulk-order")
    public ResponseEntity<Void> updateCategoriesDisplayOrder(
            @RequestBody List<CategoryOrderDTO> categoryOrders) {
        for (CategoryOrderDTO orderDTO : categoryOrders) {
            categoryService.updateCategoryDisplayOrder(orderDTO.getCategoryId(), orderDTO.getDisplayOrder());
        }
        return ResponseEntity.ok().build();
    }

    // Internal DTO class for bulk order updates

    public static class CategoryOrderDTO {
        private Long categoryId;
        private Integer displayOrder;

        // Constructors
        public CategoryOrderDTO() {}

        public CategoryOrderDTO(Long categoryId, Integer displayOrder) {
            this.categoryId = categoryId;
            this.displayOrder = displayOrder;
        }

        // Getters and Setters
        public Long getCategoryId() {
            return categoryId;
        }

        public void setCategoryId(Long categoryId) {
            this.categoryId = categoryId;
        }

        public Integer getDisplayOrder() {
            return displayOrder;
        }

        public void setDisplayOrder(Integer displayOrder) {
            this.displayOrder = displayOrder;
        }
    }
}