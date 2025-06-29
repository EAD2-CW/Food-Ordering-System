package com.menu_service.Controller;

import com.menu_service.dto.MenuItemDTO;
import com.menu_service.dto.MenuItemRequestDTO;
import com.menu_service.Service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;


@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:3000")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    // Get all available menu items

    @GetMapping
    public ResponseEntity<List<MenuItemDTO>> getAllAvailableMenuItems() {
        List<MenuItemDTO> menuItems = menuItemService.getAllAvailableMenuItems();
        return ResponseEntity.ok(menuItems);
    }

    // Get menu item by ID

    @GetMapping("/{itemId}")
    public ResponseEntity<MenuItemDTO> getMenuItemById(@PathVariable Long itemId) {
        MenuItemDTO menuItem = menuItemService.getMenuItemById(itemId);
        return ResponseEntity.ok(menuItem);
    }

    // Create a new menu item

    @PostMapping
    public ResponseEntity<MenuItemDTO> createMenuItem(@Valid @RequestBody MenuItemRequestDTO menuItemRequestDTO) {
        MenuItemDTO createdMenuItem = menuItemService.createMenuItem(menuItemRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMenuItem);
    }

    // Update an existing menu item

    @PutMapping("/{itemId}")
    public ResponseEntity<MenuItemDTO> updateMenuItem(
            @PathVariable Long itemId,
            @Valid @RequestBody MenuItemRequestDTO menuItemRequestDTO) {
        MenuItemDTO updatedMenuItem = menuItemService.updateMenuItem(itemId, menuItemRequestDTO);
        return ResponseEntity.ok(updatedMenuItem);
    }

    // Delete a menu item (soft delete)

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long itemId) {
        menuItemService.deleteMenuItem(itemId);
        return ResponseEntity.noContent().build();
    }

    // Get menu items by category ID

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<MenuItemDTO>> getMenuItemsByCategory(@PathVariable Long categoryId) {
        List<MenuItemDTO> menuItems = menuItemService.getMenuItemsByCategory(categoryId);
        return ResponseEntity.ok(menuItems);
    }

    // Get featured menu items

    @GetMapping("/featured")
    public ResponseEntity<List<MenuItemDTO>> getFeaturedMenuItems() {
        List<MenuItemDTO> featuredItems = menuItemService.getFeaturedMenuItems();
        return ResponseEntity.ok(featuredItems);
    }

    // Search menu items by name

    @GetMapping("/search")
    public ResponseEntity<List<MenuItemDTO>> searchMenuItemsByName(@RequestParam String keyword) {
        List<MenuItemDTO> menuItems = menuItemService.searchMenuItemsByName(keyword);
        return ResponseEntity.ok(menuItems);
    }

    // Get menu items by price range

    @GetMapping("/price-range")
    public ResponseEntity<List<MenuItemDTO>> getMenuItemsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        List<MenuItemDTO> menuItems = menuItemService.getMenuItemsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(menuItems);
    }

    // Get menu items by dietary information

    @GetMapping("/dietary")
    public ResponseEntity<List<MenuItemDTO>> getMenuItemsByDietaryInfo(@RequestParam String dietaryInfo) {
        List<MenuItemDTO> menuItems = menuItemService.getMenuItemsByDietaryInfo(dietaryInfo);
        return ResponseEntity.ok(menuItems);
    }

    // Get menu items by spice level
    @GetMapping("/spice-level/{spiceLevel}")
    public ResponseEntity<List<MenuItemDTO>> getMenuItemsBySpiceLevel(@PathVariable Integer spiceLevel) {
        List<MenuItemDTO> menuItems = menuItemService.getMenuItemsBySpiceLevel(spiceLevel);
        return ResponseEntity.ok(menuItems);
    }

    // Get quick preparation
    @GetMapping("/quick")
    public ResponseEntity<List<MenuItemDTO>> getQuickMenuItems(@RequestParam Integer maxTime) {
        List<MenuItemDTO> quickItems = menuItemService.getQuickMenuItems(maxTime);
        return ResponseEntity.ok(quickItems);
    }

    //Advanced search with multiple criteria

    @GetMapping("/advanced-search")
    public ResponseEntity<List<MenuItemDTO>> searchMenuItems(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer spiceLevel,
            @RequestParam(required = false) String keyword) {

        List<MenuItemDTO> menuItems = menuItemService.searchMenuItems(
                categoryId, minPrice, maxPrice, spiceLevel, keyword);
        return ResponseEntity.ok(menuItems);
    }

    // Toggle menu item availability

    @PatchMapping("/{itemId}/toggle-availability")
    public ResponseEntity<MenuItemDTO> toggleMenuItemAvailability(@PathVariable Long itemId) {
        MenuItemDTO updatedMenuItem = menuItemService.toggleMenuItemAvailability(itemId);
        return ResponseEntity.ok(updatedMenuItem);
    }

    //Toggle menu item featured status

    @PatchMapping("/{itemId}/toggle-featured")
    public ResponseEntity<MenuItemDTO> toggleMenuItemFeaturedStatus(@PathVariable Long itemId) {
        MenuItemDTO updatedMenuItem = menuItemService.toggleMenuItemFeaturedStatus(itemId);
        return ResponseEntity.ok(updatedMenuItem);
    }

    // Update menu item display order

    @PatchMapping("/{itemId}/display-order")
    public ResponseEntity<MenuItemDTO> updateMenuItemDisplayOrder(
            @PathVariable Long itemId,
            @RequestParam Integer displayOrder) {
        MenuItemDTO updatedMenuItem = menuItemService.updateMenuItemDisplayOrder(itemId, displayOrder);
        return ResponseEntity.ok(updatedMenuItem);
    }

    // Check if menu item exists by name in category

    @GetMapping("/exists")
    public ResponseEntity<Boolean> checkMenuItemExists(
            @RequestParam String itemName,
            @RequestParam Long categoryId) {
        boolean exists = menuItemService.existsByNameInCategory(itemName, categoryId);
        return ResponseEntity.ok(exists);
    }

    //Get menu items with filters (comprehensive filtering endpoint)

    @GetMapping("/filter")
    public ResponseEntity<List<MenuItemDTO>> getFilteredMenuItems(
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer spiceLevel,
            @RequestParam(required = false) Integer maxPrepTime,
            @RequestParam(required = false) String dietaryInfo,
            @RequestParam(required = false) String keyword) {

        // Start with all items or apply basic filters
        List<MenuItemDTO> menuItems;

        if (categoryId != null) {
            menuItems = menuItemService.getMenuItemsByCategory(categoryId);
        } else if (featured != null && featured) {
            menuItems = menuItemService.getFeaturedMenuItems();
        } else {
            menuItems = menuItemService.getAllAvailableMenuItems();
        }

        // Apply additional filters using advanced search if needed
        if (minPrice != null || maxPrice != null || spiceLevel != null || keyword != null) {
            menuItems = menuItemService.searchMenuItems(categoryId, minPrice, maxPrice, spiceLevel, keyword);
        }

        return ResponseEntity.ok(menuItems);
    }

    // Bulk update menu items display order

    @PutMapping("/bulk-order")
    public ResponseEntity<Void> updateMenuItemsDisplayOrder(
            @RequestBody List<MenuItemOrderDTO> itemOrders) {
        for (MenuItemOrderDTO orderDTO : itemOrders) {
            menuItemService.updateMenuItemDisplayOrder(orderDTO.getItemId(), orderDTO.getDisplayOrder());
        }
        return ResponseEntity.ok().build();
    }

    // Internal DTO class for bulk order updates

    public static class MenuItemOrderDTO {
        private Long itemId;
        private Integer displayOrder;

        // Constructors
        public MenuItemOrderDTO() {}

        public MenuItemOrderDTO(Long itemId, Integer displayOrder) {
            this.itemId = itemId;
            this.displayOrder = displayOrder;
        }

        // Getters and Setters
        public Long getItemId() {
            return itemId;
        }

        public void setItemId(Long itemId) {
            this.itemId = itemId;
        }

        public Integer getDisplayOrder() {
            return displayOrder;
        }

        public void setDisplayOrder(Integer displayOrder) {
            this.displayOrder = displayOrder;
        }
    }
}