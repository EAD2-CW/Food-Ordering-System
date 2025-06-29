package com.menu_service.Service;

import com.menu_service.dto.CategoryDTO;

import java.util.List;


public interface CategoryService {

    // Get all active categories

    List<CategoryDTO> getAllActiveCategories();

    // Get category by ID

    CategoryDTO getCategoryById(Long categoryId);

    // Create a new category

    CategoryDTO createCategory(CategoryDTO categoryDTO);

    // Update an existing category

    CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO);

    //Delete a category

    void deleteCategory(Long categoryId);

    // Search categories by name

    List<CategoryDTO> searchCategoriesByName(String keyword);

    // Get categories with menu items

    List<CategoryDTO> getCategoriesWithMenuItems();

    // Check if category exists by name

    boolean existsByCategoryName(String categoryName);

    // Update category display order

    CategoryDTO updateCategoryDisplayOrder(Long categoryId, Integer newDisplayOrder);

    //Toggle category active status

    CategoryDTO toggleCategoryStatus(Long categoryId);
}