package com.menu_service.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;


public class MenuItemDTO {

    private Long itemId;

    private Long categoryId;

    private String categoryName;

    @NotBlank(message = "Item name is required")
    @Size(min = 2, max = 150, message = "Item name must be between 2 and 150 characters")
    private String itemName;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2, message = "Price format is invalid")
    private BigDecimal price;

    private Boolean isAvailable = true;

    private String imageUrl;

    @Min(value = 1, message = "Preparation time must be at least 1 minute")
    @Max(value = 300, message = "Preparation time cannot exceed 300 minutes")
    private Integer preparationTime;

    @Size(max = 1000, message = "Ingredients cannot exceed 1000 characters")
    private String ingredients;

    @Size(max = 500, message = "Dietary info cannot exceed 500 characters")
    private String dietaryInfo;

    @Min(value = 0, message = "Calories cannot be negative")
    private Integer calories;

    @Min(value = 1, message = "Spice level must be between 1 and 5")
    @Max(value = 5, message = "Spice level must be between 1 and 5")
    private Integer spiceLevel;

    private Boolean isFeatured = false;

    private Integer displayOrder = 0;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Constructors
    public MenuItemDTO() {}

    public MenuItemDTO(Long itemId, String itemName, String description, BigDecimal price) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.description = description;
        this.price = price;
    }

    // Getters and Setters
    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getPreparationTime() {
        return preparationTime;
    }

    public void setPreparationTime(Integer preparationTime) {
        this.preparationTime = preparationTime;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getDietaryInfo() {
        return dietaryInfo;
    }

    public void setDietaryInfo(String dietaryInfo) {
        this.dietaryInfo = dietaryInfo;
    }

    public Integer getCalories() {
        return calories;
    }

    public void setCalories(Integer calories) {
        this.calories = calories;
    }

    public Integer getSpiceLevel() {
        return spiceLevel;
    }

    public void setSpiceLevel(Integer spiceLevel) {
        this.spiceLevel = spiceLevel;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "MenuItemDTO{" +
                "itemId=" + itemId +
                ", categoryId=" + categoryId +
                ", categoryName='" + categoryName + '\'' +
                ", itemName='" + itemName + '\'' +
                ", price=" + price +
                ", isAvailable=" + isAvailable +
                ", preparationTime=" + preparationTime +
                ", isFeatured=" + isFeatured +
                '}';
    }
}