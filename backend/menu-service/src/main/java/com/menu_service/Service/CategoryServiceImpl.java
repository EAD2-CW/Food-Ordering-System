package com.menu_service.Service;

import com.menu_service.dto.CategoryDTO;
import com.menu_service.Exception.CategoryNotFoundException;
import com.menu_service.Exception.CategoryAlreadyExsistsException;
import com.menu_service.model.Category;
import com.menu_service.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllActiveCategories() {
        List<Category> categories = categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
        return categories.stream()
                .map(this::mapToCategoryDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + categoryId));
        return mapToCategoryDTO(category);
    }

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        // Check if category with same name already exists
        if (categoryRepository.existsByCategoryNameIgnoreCase(categoryDTO.getCategoryName())) {
            throw new CategoryAlreadyExsistsException("Category with name '" + categoryDTO.getCategoryName() + "' already exists");
        }

        Category category = new Category();
        category.setCategoryName(categoryDTO.getCategoryName());
        category.setDescription(categoryDTO.getDescription());
        category.setImageUrl(categoryDTO.getImageUrl());
        category.setIsActive(categoryDTO.getIsActive() != null ? categoryDTO.getIsActive() : true);

        // Set display order - if not provided, set to next available order
        if (categoryDTO.getDisplayOrder() != null) {
            category.setDisplayOrder(categoryDTO.getDisplayOrder());
        } else {
            Integer maxOrder = categoryRepository.findMaxDisplayOrder();
            category.setDisplayOrder(maxOrder + 1);
        }

        Category savedCategory = categoryRepository.save(category);
        return mapToCategoryDTO(savedCategory);
    }

    @Override
    public CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + categoryId));

        // Check if updating name conflicts with existing category
        if (!existingCategory.getCategoryName().equalsIgnoreCase(categoryDTO.getCategoryName()) &&
                categoryRepository.existsByCategoryNameIgnoreCase(categoryDTO.getCategoryName())) {
            throw new CategoryAlreadyExsistsException("Category with name '" + categoryDTO.getCategoryName() + "' already exists");
        }

        // Update category fields
        existingCategory.setCategoryName(categoryDTO.getCategoryName());
        existingCategory.setDescription(categoryDTO.getDescription());
        existingCategory.setImageUrl(categoryDTO.getImageUrl());

        if (categoryDTO.getIsActive() != null) {
            existingCategory.setIsActive(categoryDTO.getIsActive());
        }

        if (categoryDTO.getDisplayOrder() != null) {
            existingCategory.setDisplayOrder(categoryDTO.getDisplayOrder());
        }

        Category updatedCategory = categoryRepository.save(existingCategory);
        return mapToCategoryDTO(updatedCategory);
    }

    @Override
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + categoryId));

        // Soft delete - mark as inactive instead of actually deleting
        category.setIsActive(false);
        categoryRepository.save(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> searchCategoriesByName(String keyword) {
        List<Category> categories = categoryRepository.findByNameContainingIgnoreCase(keyword);
        return categories.stream()
                .map(this::mapToCategoryDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getCategoriesWithMenuItems() {
        List<Category> categories = categoryRepository.findActiveCategoriesWithMenuItems();
        return categories.stream()
                .map(this::mapToCategoryDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByCategoryName(String categoryName) {
        return categoryRepository.existsByCategoryNameIgnoreCase(categoryName);
    }

    @Override
    public CategoryDTO updateCategoryDisplayOrder(Long categoryId, Integer newDisplayOrder) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + categoryId));

        category.setDisplayOrder(newDisplayOrder);
        Category updatedCategory = categoryRepository.save(category);
        return mapToCategoryDTO(updatedCategory);
    }

    @Override
    public CategoryDTO toggleCategoryStatus(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + categoryId));

        category.setIsActive(!category.getIsActive());
        Category updatedCategory = categoryRepository.save(category);
        return mapToCategoryDTO(updatedCategory);
    }

    // Maps Category entity to CategoryDTO

    private CategoryDTO mapToCategoryDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setCategoryName(category.getCategoryName());
        dto.setDescription(category.getDescription());
        dto.setImageUrl(category.getImageUrl());
        dto.setIsActive(category.getIsActive());
        dto.setDisplayOrder(category.getDisplayOrder());
        dto.setCreatedAt(category.getCreatedAt());
        dto.setUpdatedAt(category.getUpdatedAt());

        // Set menu item count if menu items are loaded
        if (category.getMenuItems() != null) {
            dto.setMenuItemCount((long) category.getMenuItems().size());
        }

        return dto;
    }
}