import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import Header from '../components/Header';
import { getRecommendedCategory, getServicesByCategory } from '../services/apiService';

function RecommendPage({ user }) {
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.userId) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 추천 카테고리 조회
      const recommendData = await getRecommendedCategory(user.userId);
      setRecommendation(recommendData);
      
      if (recommendData && recommendData.categoryName) {
        // 추천 카테고리의 서비스 목록 조회
        const servicesData = await getServicesByCategory(recommendData.categoryName);
        setServices(servicesData);
      }
    } catch (err) {
      console.error('추천 정보 조회 에러:', err);
      setError('추천 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
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

  const getMonth = () => {
    const date = recommendation?.baseDate ? new Date(recommendation.baseDate) : new Date();
    return `${date.getMonth() + 1}월`;
  };

  if (loading) {
    return (
      <Box>
        <Header title="구독 추천" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Header title="구독 추천" />
      
      <Box className="page-container">
        {recommendation ? (
          <>
            <Card sx={{ mb: 3, borderRadius: 2, bgcolor: '#f5f9ff' }}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {getMonth()} 지출 분석 결과
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  "{recommendation.spendingCategory}" 카테고리에 지출이 많으시네요!
                </Typography>
                {recommendation.totalSpending && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    지출 금액: {formatNumber(recommendation.totalSpending)}원
                  </Typography>
                )}
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  "{recommendation.categoryName}" 구독 서비스를 추천드려요
                </Typography>
              </CardContent>
            </Card>
            
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              추천 서비스 목록
            </Typography>
            
            {services.length > 0 ? (
              services.map((service) => (
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
              ))
            ) : (
              <Card sx={{ borderRadius: 2, bgcolor: '#f9f9f9', mt: 4 }}>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    추천 서비스가 없습니다
                  </Typography>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card sx={{ borderRadius: 2, bgcolor: '#f9f9f9', mt: 4 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" component="h2" gutterBottom>
                추천 정보가 없습니다
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                지출 데이터가 충분하지 않아 추천을 제공할 수 없습니다.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/categories')}
              >
                모든 서비스 보기
              </Button>
            </CardContent>
          </Card>
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

export default RecommendPage;