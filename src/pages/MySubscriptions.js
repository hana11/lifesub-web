import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import Header from '../components/Header';
import SubscriptionCard from '../components/SubscriptionCard';
import { getMySubscriptions } from '../services/apiService';

function MySubscriptions({ user }) {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.userId) {
      fetchSubscriptions();
    }
  }, [user]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await getMySubscriptions(user.userId);
      setSubscriptions(data);
    } catch (err) {
      console.error('구독 목록 조회 에러:', err);
      setError('구독 목록을 불러오는 데 실패했습니다.');
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

  const handleCloseError = () => {
    setError('');
  };

  if (loading) {
    return (
      <Box>
        <Header title="나의 구독 목록" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Header title="나의 구독 목록" />
      
      <Box className="page-container">
        {subscriptions.length > 0 ? (
          <>
            <Typography variant="body1" sx={{ mb: 3 }}>
              현재 {subscriptions.length}개의 서비스를 구독 중이에요
            </Typography>
            
            <Grid container spacing={2}>
              {subscriptions.map((sub) => (
                <Grid item xs={4} key={sub.id}>
                  <SubscriptionCard 
                    subscription={sub} 
                    onClick={handleViewSubscription}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <Card sx={{ borderRadius: 2, bgcolor: '#f9f9f9', mt: 2 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
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
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MySubscriptions;
