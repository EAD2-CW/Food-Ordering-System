package com.menu_service.Service;

import com.menu_service.dto.MenuItemDTO;
import com.menu_service.dto.MenuItemRequestDTO;
import com.menu_service.Exception.CategoryNotFoundException;
import com.menu_service.Exception.MenuItemNotFoundException;
import com.menu_service.Exception.MenuItemAlreadyExsistsException;
import com.menu_service.model.Category;
import com.menu_service.model.MenuItem;
import com.menu_service.Repository.CategoryRepository;
import com.menu_service.Repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for MenuItem operations
 * Contains business logic for menu item management
 */
@Service
@Transactional
public class MenuItemServiceImpl implements MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> getAllAvailableMenuItems() {
        List<MenuItem> menuItems = menuItemRepository.findByIsAvailableTrueOrderByDisplayOrderAsc();
        return menuItems.stream()
                .map(this::mapToMenuItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MenuItemDTO getMenuItemById(Long itemId) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new MenuItemNotFoundException("Menu item not found with ID: " + itemId));
        return mapToMenuItemDTO(menuItem);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> getMenuItemsByCategory(Long categoryId) {
        // Verify category exists
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + categoryId));

        List<MenuItem> menuItems = menuItemRepository.findByCategoryAndIsAvailableTrueOrderByDisplayOrderAsc(category);
        return menuItems.stream()
                .map(this::mapToMenuItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> getFeaturedMenuItems() {
        List<MenuItem> menuItems = menuItemRepository.findByIsFeaturedTrueAndIsAvailableTrueOrderByDisplayOrderAsc();
        return menuItems.stream()
                .map(this::mapToMenuItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MenuItemDTO createMenuItem(MenuItemRequestDTO menuItemRequestDTO) {
        // Verify category exists
        Category category = categoryRepository.findById(menuItemRequestDTO.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + menuItemRequestDTO.getCategoryId()));

        // Check if menu item with same name already exists in this category
        if (menuItemRepository.existsByItemNameIgnoreCaseAndCategory(menuItemRequestDTO.getItemName(), category)) {
            throw new MenuItemAlreadyExsistsException("Menu item with name '" + menuItemRequestDTO.getItemName() +
                    "' already exists in category '" + category.getCategoryName() + "'");
        }

        MenuItem menuItem = new MenuItem();
        menuItem.setCategory(category);
        menuItem.setItemName(menuItemRequestDTO.getItemName());
        menuItem.setDescription(menuItemRequestDTO.getDescription());
        menuItem.setPrice(menuItemRequestDTO.getPrice());
        menuItem.setIsAvailable(menuItemRequestDTO.getIsAvailable() != null ? menuItemRequestDTO.getIsAvailable() : true);
        menuItem.setImageUrl(menuItemRequestDTO.getImageUrl());
        menuItem.setPreparationTime(menuItemRequestDTO.getPreparationTime());
        menuItem.setIngredients(menuItemRequestDTO.getIngredients());
        menuItem.setDietaryInfo(menuItemRequestDTO.getDietaryInfo());
        menuItem.setCalories(menuItemRequestDTO.getCalories());
        menuItem.setSpiceLevel(menuItemRequestDTO.getSpiceLevel());
        menuItem.setIsFeatured(menuItemRequestDTO.getIsFeatured() != null ? menuItemRequestDTO.getIsFeatured() : false);

        // Set display order - if not provided, set to next available order in category
        if (menuItemRequestDTO.getDisplayOrder() != null) {
            menuItem.setDisplayOrder(menuItemRequestDTO.getDisplayOrder());
        } else {
            Integer maxOrder = menuItemRepository.findMaxDisplayOrderByCategory(category);
            menuItem.setDisplayOrder(maxOrder + 1);
        }

        MenuItem savedMenuItem = menuItemRepository.save(menuItem);
        return mapToMenuItemDTO(savedMenuItem);
    }

    @Override
    public MenuItemDTO updateMenuItem(Long itemId, MenuItemRequestDTO menuItemRequestDTO) {
        MenuItem existingMenuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new MenuItemNotFoundException("Menu item not found with ID: " + itemId));

        // Verify category exists if category is being changed
        Category category = categoryRepository.findById(menuItemRequestDTO.getCategoryId())
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + menuItemRequestDTO.getCategoryId()));

        // Check if updating name conflicts with existing menu item in the same category
        if (!existingMenuItem.getItemName().equalsIgnoreCase(menuItemRequestDTO.getItemName()) &&
                menuItemRepository.existsByItemNameIgnoreCaseAndCategory(menuItemRequestDTO.getItemName(), category)) {
            throw new MenuItemAlreadyExsistsException("Menu item with name '" + menuItemRequestDTO.getItemName() +
                    "' already exists in category '" + category.getCategoryName() + "'");
        }

        // Update menu item fields
        existingMenuItem.setCategory(category);
        existingMenuItem.setItemName(menuItemRequestDTO.getItemName());
        existingMenuItem.setDescription(menuItemRequestDTO.getDescription());
        existingMenuItem.setPrice(menuItemRequestDTO.getPrice());
        existingMenuItem.setImageUrl(menuItemRequestDTO.getImageUrl());
        existingMenuItem.setPreparationTime(menuItemRequestDTO.getPreparationTime());
        existingMenuItem.setIngredients(menuItemRequestDTO.getIngredients());
        existingMenuItem.setDietaryInfo(menuItemRequestDTO.getDietaryInfo());
        existingMenuItem.setCalories(menuItemRequestDTO.getCalories());
        existingMenuItem.setSpiceLevel(menuItemRequestDTO.getSpiceLevel());

        if (menuItemRequestDTO.getIsAvailable() != null) {
            existingMenuItem.setIsAvailable(menuItemRequestDTO.getIsAvailable());
        }

        if (menuItemRequestDTO.getIsFeatured() != null) {
            existingMenuItem.setIsFeatured(menuItemRequestDTO.getIsFeatured());
        }

        if (menuItemRequestDTO.getDisplayOrder() != null) {
            existingMenuItem.setDisplayOrder(menuItemRequestDTO.getDisplayOrder());
        }

        MenuItem updatedMenuItem = menuItemRepository.save(existingMenuItem);
        return mapToMenuItemDTO(updatedMenuItem);
    }

    @Override
    public void deleteMenuItem(Long itemId) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new MenuItemNotFoundException("Menu item not found with ID: " + itemId));

        // Soft delete - mark as unavailable instead of actually deleting
        menuItem.setIsAvailable(false);
        menuItemRepository.save(menuItem);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> searchMenuItemsByName(String keyword) {
        List<MenuItem> menuItems = menuItemRepository.findByItemNameContainingIgnoreCase(keyword);
        return menuItems.stream()
                .map(this::mapToMenuItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> getMenuItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<MenuItem> menuItems = menuItemRepository.findByPriceBetweenAndIsAvailableTrue(minPrice, maxPrice);
        return menuItems.stream()
                .map(this::mapToMenuItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> getMenuItemsByDietaryInfo(String dietaryInfo) {
        List<MenuItem> menuItems = menuItemRepository.findByDietaryInfoContainingIgnoreCase(dietaryInfo);
        return menuItems.stream()
                .map(this::mapToMenuItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> getMenuItemsBySpiceLevel(Integer spiceLevel) {
        List<MenuItem> menuItems = menuItemRepository.findBySpiceLevelAndIsAvailableTrueOrderByDisplayOrderAsc(spiceLevel);
        return menuItems.stream()
                .map(this::mapToMenuItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> getQuickMenuItems(Integer maxPreparationTime) {
        List<MenuItem> menuItems = menuItemRepository.findByMaxPreparationTime(maxPreparationTime);
        return menuItems.stream()
                .map(this::mapToMenuItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> searchMenuItems(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                             Integer spiceLevel, String keyword) {
        List<MenuItem> menuItems = menuItemRepository.findByMultipleCriteria(
                categoryId, minPrice, maxPrice, spiceLevel, keyword);
        return menuItems.stream()
                .map(this::mapToMenuItemDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MenuItemDTO toggleMenuItemAvailability(Long itemId) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new MenuItemNotFoundException("Menu item not found with ID: " + itemId));

        menuItem.setIsAvailable(!menuItem.getIsAvailable());
        MenuItem updatedMenuItem = menuItemRepository.save(menuItem);
        return mapToMenuItemDTO(updatedMenuItem);
    }

    @Override
    public MenuItemDTO toggleMenuItemFeaturedStatus(Long itemId) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new MenuItemNotFoundException("Menu item not found with ID: " + itemId));

        menuItem.setIsFeatured(!menuItem.getIsFeatured());
        MenuItem updatedMenuItem = menuItemRepository.save(menuItem);
        return mapToMenuItemDTO(updatedMenuItem);
    }

    @Override
    public MenuItemDTO updateMenuItemDisplayOrder(Long itemId, Integer newDisplayOrder) {
        MenuItem menuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new MenuItemNotFoundException("Menu item not found with ID: " + itemId));

        menuItem.setDisplayOrder(newDisplayOrder);
        MenuItem updatedMenuItem = menuItemRepository.save(menuItem);
        return mapToMenuItemDTO(updatedMenuItem);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByNameInCategory(String itemName, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + categoryId));
        return menuItemRepository.existsByItemNameIgnoreCaseAndCategory(itemName, category);
    }

    /**
     * Maps MenuItem entity to MenuItemDTO
     */
    private MenuItemDTO mapToMenuItemDTO(MenuItem menuItem) {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setItemId(menuItem.getItemId());
        dto.setCategoryId(menuItem.getCategory().getCategoryId());
        dto.setCategoryName(menuItem.getCategory().getCategoryName());
        dto.setItemName(menuItem.getItemName());
        dto.setDescription(menuItem.getDescription());
        dto.setPrice(menuItem.getPrice());
        dto.setIsAvailable(menuItem.getIsAvailable());
        dto.setImageUrl(menuItem.getImageUrl());
        dto.setPreparationTime(menuItem.getPreparationTime());
        dto.setIngredients(menuItem.getIngredients());
        dto.setDietaryInfo(menuItem.getDietaryInfo());
        dto.setCalories(menuItem.getCalories());
        dto.setSpiceLevel(menuItem.getSpiceLevel());
        dto.setIsFeatured(menuItem.getIsFeatured());
        dto.setDisplayOrder(menuItem.getDisplayOrder());
        dto.setCreatedAt(menuItem.getCreatedAt());
        dto.setUpdatedAt(menuItem.getUpdatedAt());

        return dto;
    }
}