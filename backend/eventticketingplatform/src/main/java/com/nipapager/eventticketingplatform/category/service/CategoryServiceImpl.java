package com.nipapager.eventticketingplatform.category.service;

import com.nipapager.eventticketingplatform.category.dto.CategoryDTO;
import com.nipapager.eventticketingplatform.category.entity.Category;
import com.nipapager.eventticketingplatform.category.repository.CategoryRepository;
import com.nipapager.eventticketingplatform.exception.BadRequestException;
import com.nipapager.eventticketingplatform.exception.NotFoundException;
import com.nipapager.eventticketingplatform.response.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service implementation for category operations
 * Handles business logic for category management
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public Response<CategoryDTO> createCategory(CategoryDTO categoryDTO) {
        log.info("Creating category: {}", categoryDTO.getName());

        // Check for duplicate category name
        if (categoryRepository.existsByName(categoryDTO.getName())) {
            throw new BadRequestException("Category already exists: " + categoryDTO.getName());
        }

        // Map DTO to entity
        Category category = modelMapper.map(categoryDTO, Category.class);
        category.setCreatedAt(LocalDateTime.now());

        // Save to database
        Category savedCategory = categoryRepository.save(category);
        log.info("Category created successfully with ID: {}", savedCategory.getId());

        // Map saved entity back to DTO
        CategoryDTO savedDTO = modelMapper.map(savedCategory, CategoryDTO.class);

        return Response.<CategoryDTO>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Category created successfully")
                .data(savedDTO)
                .build();
    }

    @Override
    public Response<List<CategoryDTO>> getAllCategories() {
        log.info("Fetching all categories");

        // Get all categories from database
        List<Category> categories = categoryRepository.findAll();

        // Map entities to DTOs
        List<CategoryDTO> categoryDTOList = categories.stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .toList();

        return Response.<List<CategoryDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Categories retrieved successfully")
                .data(categoryDTOList)
                .build();
    }

    @Override
    public Response<CategoryDTO> getCategoryById(Long id) {
        log.info("Fetching category with id: {}", id);

        // Find category by id
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + id));

        // Map to DTO
        CategoryDTO categoryDTO = modelMapper.map(category, CategoryDTO.class);

        return Response.<CategoryDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Category retrieved successfully")
                .data(categoryDTO)
                .build();
    }

    @Override
    public Response<CategoryDTO> updateCategory(Long id, CategoryDTO categoryDTO) {
        log.info("Updating category with id: {}", id);

        // Find existing category
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + id));

        // Update name if provided
        if (categoryDTO.getName() != null && !categoryDTO.getName().isEmpty()) {
            // Check for duplicate name (only if name is being changed)
            if (!category.getName().equals(categoryDTO.getName()) &&
                    categoryRepository.existsByName(categoryDTO.getName())) {
                throw new BadRequestException("Category already exists: " + categoryDTO.getName());
            }
            category.setName(categoryDTO.getName());
        }

        // Update description if provided
        if (categoryDTO.getDescription() != null && !categoryDTO.getDescription().isEmpty()) {
            category.setDescription(categoryDTO.getDescription());
        }

        // Update image URL if provided
        if (categoryDTO.getImageUrl() != null && !categoryDTO.getImageUrl().isEmpty()) {
            category.setImageUrl(categoryDTO.getImageUrl());
        }

        // Save updated category
        Category savedCategory = categoryRepository.save(category);
        log.info("Category updated successfully: {}", savedCategory.getId());

        // Map to DTO
        CategoryDTO updatedDTO = modelMapper.map(savedCategory, CategoryDTO.class);

        return Response.<CategoryDTO>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Category updated successfully")
                .data(updatedDTO)
                .build();
    }

    @Override
    public Response<Void> deleteCategory(Long id) {
        log.info("Deleting category with id: {}", id);

        // Check if category exists
        if (!categoryRepository.existsById(id)) {
            throw new NotFoundException("Category not found with id: " + id);
        }

        // Delete category
        categoryRepository.deleteById(id);
        log.info("Category deleted successfully: {}", id);

        return Response.<Void>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Category deleted successfully")
                .build();
    }
}