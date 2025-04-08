import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, 
  Typography, 
  Button, 
  Grid,
  Card,
  CardContent,
  Fab,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';
import Header from '../components/Header';
import TotalFeeCard from '../components/TotalFeeCard';
import SubscriptionCard from '../components/SubscriptionCard';
import { getTotalFee, getMySubscriptions, getRecommendedCategory, logoutUser } from '../services/apiService';

function Main({ user, onLogout }) {
  const navigate = useNavigate();
  const [totalFee, setTotalFee] = useState(null);
  const [feeLevel, setFeeLevel] = useState('');
  const [subscriptions, setSubscriptions] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
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
      // 병렬로 데이터 가져오기
      const [feeResponse, subscriptionsResponse, recommendResponse] = await Promise.all([
        getTotalFee(user.userId),
        getMySubscriptions(user.userId),
        getRecommendedCategory(user.userId).catch(err => {
          console.error('추천 카테고리 조회 에러(무시됨):', err);
          return null; // 추천 관련 오류는 무시하고 진행
        })
      ]);

      setTotalFee(feeResponse.totalFee);
      setFeeLevel(feeResponse.feeLevel);
      setSubscriptions(subscriptionsResponse);
      setRecommendation(recommendResponse);
    } catch (err) {
      console.error('메인 데이터 로드 에러:', err);
      setError('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubscription = (id) => {
    navigate(`/services/${id}`);
  };

  const handleViewAllServices = () => {
    navigate('/categories');
  };

  const handleViewRecommendation = () => {
    navigate('/recommend');
  };

  const handleLogout = async () => {
    try {
      await logoutUser(user.userId);
      onLogout();
    } catch (err) {
      console.error('로그아웃 에러:', err);
      setError('로그아웃 처리 중 오류가 발생했습니다.');
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Header title="생활구독 관리" showBack={false} />
      
      <Box className="page-container">
        {/* 사용자 인사 메시지 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            {user.userId}님, 안녕하세요!
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            size="small"
          >
            로그아웃
          </Button>
        </Box>
        
        {/* 총 구독료 */}
        <TotalFeeCard totalFee={totalFee} feeLevel={feeLevel} />
        
        {/* 내 구독 섹션 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              나의 구독 서비스
            </Typography>
            <Button 
              variant="text" 
              color="primary"
              onClick={() => navigate('/subscriptions')}
              size="small"
            >
              전체보기
            </Button>
          </Box>
          
          {subscriptions.length > 0 ? (
            <Grid container spacing={2}>
              {subscriptions.slice(0, 6).map((sub) => (
                <Grid item xs={4} key={sub.id}>
                  <SubscriptionCard 
                    subscription={sub} 
                    onClick={handleViewSubscription}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ borderRadius: 2, bgcolor: '#f9f9f9' }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  아직 구독한 서비스가 없어요
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<CategoryIcon />}
                  onClick={handleViewAllServices}
                >
                  구독 서비스 둘러보기
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
        
        {/* 추천 구독 카테고리 */}
        {recommendation && (
          <Card sx={{ borderRadius: 2, bgcolor: '#f5f9ff', mb: 4 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                추천 구독 카테고리
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {recommendation.spendingCategory} 지출이 많으신 것 같아요.<br />
                {recommendation.categoryName} 구독 서비스는 어떠세요?
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleViewRecommendation}
                size="small"
              >
                추천 서비스 보기
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* 하단 고정 버튼 */}
        <Fab
          color="primary"
          variant="extended"
          onClick={handleViewAllServices}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: '50%',
            transform: 'translateX(50%)',
            zIndex: 1000,
            px: 3
          }}
        >
          <CategoryIcon sx={{ mr: 1 }} />
          구독 서비스 둘러보기
        </Fab>
      </Box>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Main;
