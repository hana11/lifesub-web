import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Snackbar,
  Alert
} from '@mui/material';
import Header from '../components/Header';
import CategoryList from '../components/CategoryList';
import { getAllCategories, getServicesByCategory } from '../services/apiService';

function ServiceCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices(selectedCategory);
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('카테고리 목록 조회 에러:', err);
      setError('카테고리 목록을 불러오는 데 실패했습니다.');
    }
  };

  const fetchServices = async (categoryId) => {
    setLoading(true);
    try {
      const data = await getServicesByCategory(categoryId);
      setServices(data);
    } catch (err) {
      console.error('서비스 목록 조회 에러:', err);
      setError('서비스 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/services/${serviceId}`);
  };

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <Box>
      <Header title="구독 서비스 목록" />
      
      <Box className="page-container">
        {/* 카테고리 선택 */}
        <CategoryList 
          categories={categories}
          activeCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        {/* 서비스 목록 */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {services.length}개의 서비스를 찾았습니다
            </Typography>
            
            {services.map((service) => (
              <Box
                key={service.serviceId}
                className="service-card"
                onClick={() => handleServiceClick(service.serviceId)}
              >
                <img 
                  src={service.logoUrl || '/images/default-logo.png'} 
                  alt={service.serviceName} 
                  className="service-logo" 
                />
                <Box className="service-details">
                  <Typography className="service-name">
                    {service.serviceName}
                  </Typography>
                  <Typography className="service-description">
                    {service.description}
                  </Typography>
                  <Typography className="service-price">
                    {formatNumber(service.price)}원/월
                  </Typography>
                </Box>
              </Box>
            ))}
            
            {services.length === 0 && (
              <Card sx={{ borderRadius: 2, bgcolor: '#f9f9f9', mt: 4 }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    해당 카테고리에 서비스가 없습니다
                  </Typography>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Box>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ServiceCategories;
