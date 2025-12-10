package com.nipapager.eventticketingplatform.category.service;

import com.nipapager.eventticketingplatform.category.dto.CategoryDTO;
import com.nipapager.eventticketingplatform.response.Response;

import java.util.List;

/**
 * Service interface for Category operations
 */
public interface CategoryService {

    Response<CategoryDTO> createCategory(CategoryDTO categoryDTO);

    Response<List<CategoryDTO>> getAllCategories();

    Response<CategoryDTO> getCategoryById(Long id);

    Response<CategoryDTO> updateCategory(Long id, CategoryDTO categoryDTO);

    Response<Void> deleteCategory(Long id);


}
