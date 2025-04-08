import React from 'react';
import { Box, Chip } from '@mui/material';

function CategoryList({ categories, activeCategory, onCategoryChange }) {
  return (
    <Box className="category-list">
      {/* 모든 카테고리 옵션 */}
      <Chip
        label="전체"
        onClick={() => onCategoryChange(null)}
        className={`category-chip ${activeCategory === null ? 'active' : ''}`}
        variant={activeCategory === null ? 'filled' : 'outlined'}
        color={activeCategory === null ? 'primary' : 'default'}
      />
      
      {/* 각 카테고리 옵션 */}
      {categories.map((category) => (
        <Chip
          key={category.categoryId}
          label={category.categoryName}
          onClick={() => onCategoryChange(category.categoryId)}
          className={`category-chip ${activeCategory === category.categoryId ? 'active' : ''}`}
          variant={activeCategory === category.categoryId ? 'filled' : 'outlined'}
          color={activeCategory === category.categoryId ? 'primary' : 'default'}
        />
      ))}
    </Box>
  );
}

export default CategoryList;
