package com.menu_service.Service;

import com.menu_service.dto.MenuItemDTO;
import com.menu_service.dto.MenuItemRequestDTO;

import java.math.BigDecimal;
import java.util.List;


public interface MenuItemService {

    // Get all available menu items

    List<MenuItemDTO> getAllAvailableMenuItems();

    //Get menu item by ID

    MenuItemDTO getMenuItemById(Long itemId);

    // Get menu items by category ID

    List<MenuItemDTO> getMenuItemsByCategory(Long categoryId);

    // Get featured menu items

    List<MenuItemDTO> getFeaturedMenuItems();

    // Create a new menu item

    MenuItemDTO createMenuItem(MenuItemRequestDTO menuItemRequestDTO);

    // Update an existing menu item

    MenuItemDTO updateMenuItem(Long itemId, MenuItemRequestDTO menuItemRequestDTO);

    // Delete a menu item (soft delete - mark as unavailable)

    void deleteMenuItem(Long itemId);

    // Search menu items by name

    List<MenuItemDTO> searchMenuItemsByName(String keyword);

    // Search menu items by price range

    List<MenuItemDTO> getMenuItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);

    // Get menu items by dietary information
   
    List<MenuItemDTO> getMenuItemsByDietaryInfo(String dietaryInfo);

    // Get menu items by spice level

    List<MenuItemDTO> getMenuItemsBySpiceLevel(Integer spiceLevel);

    // Get menu items with quick preparation time

    List<MenuItemDTO> getQuickMenuItems(Integer maxPreparationTime);

    // Advanced search with multiple criteria ()
    List<MenuItemDTO> searchMenuItems(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                      Integer spiceLevel, String keyword);

    // Toggle menu item availability

    MenuItemDTO toggleMenuItemAvailability(Long itemId);

    // Toggle menu item featured status

    MenuItemDTO toggleMenuItemFeaturedStatus(Long itemId);

    // Update menu item display order

    MenuItemDTO updateMenuItemDisplayOrder(Long itemId, Integer newDisplayOrder);

    //Check if menu item exists by name in category

    boolean existsByNameInCategory(String itemName, Long categoryId);
}