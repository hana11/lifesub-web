import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Header({ title, showBack = true, onBackClick }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Box className="header">
      {showBack && (
        <IconButton 
          className="back-button" 
          aria-label="뒤로 가기" 
          onClick={handleBack}
          edge="start"
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <Typography variant="h6" component="h1">
        {title}
      </Typography>
      {/* 우측 여백 맞추기 위한 빈 공간 */}
      {showBack && <Box sx={{ width: 48 }} />}
    </Box>
  );
}

export default Header;
