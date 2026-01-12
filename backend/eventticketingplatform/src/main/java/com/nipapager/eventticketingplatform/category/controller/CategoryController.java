package com.nipapager.eventticketingplatform.category.controller;

import com.nipapager.eventticketingplatform.category.dto.CategoryDTO;
import com.nipapager.eventticketingplatform.category.service.CategoryService;
import com.nipapager.eventticketingplatform.response.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for category management
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ORGANIZER', 'ROLE_ADMIN')") // Changed from ROLE_ADMIN only
    public ResponseEntity<Response<CategoryDTO>> createCategory(@RequestBody CategoryDTO categoryDTO) {
        Response<CategoryDTO> response = categoryService.createCategory(categoryDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


    @GetMapping
    public ResponseEntity<Response<List<CategoryDTO>>> getAllCategories() {
        Response<List<CategoryDTO>> response = categoryService.getAllCategories();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<CategoryDTO>> getCategoryById(@PathVariable Long id) {
        Response<CategoryDTO> response = categoryService.getCategoryById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<CategoryDTO>> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryDTO categoryDTO) {
        Response<CategoryDTO> response = categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Response<Void>> deleteCategory(@PathVariable Long id) {
        Response<Void> response = categoryService.deleteCategory(id);
        return ResponseEntity.ok(response);
    }


}