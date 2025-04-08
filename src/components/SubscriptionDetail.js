import React from 'react';
import { Box, Typography, Button, Divider, Card, CardContent } from '@mui/material';

function SubscriptionDetail({ subscription, isSubscribed, onSubscribe, onUnsubscribe }) {
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Card elevation={2} sx={{ borderRadius: 3, mb: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <img 
            src={subscription.logoUrl || '/images/default-logo.png'} 
            alt={subscription.serviceName} 
            style={{ width: 80, height: 80, objectFit: 'contain', marginRight: 16 }} 
          />
          <Box>
            <Typography variant="h5" component="h2">
              {subscription.serviceName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {subscription.category}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box className="detail-section">
          <Typography className="detail-header">서비스 설명</Typography>
          <Typography className="detail-content">
            {subscription.description}
          </Typography>
        </Box>

        <Box className="detail-section">
          <Typography className="detail-header">공유 인원</Typography>
          <Typography className="detail-content">
            최대 {subscription.maxSharedUsers}명까지 공유 가능
          </Typography>
        </Box>

        <Box className="price-tag">
          <Typography className="price-amount">
            {formatNumber(subscription.price)}원
          </Typography>
          <Typography className="price-period">/ 월</Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          {isSubscribed ? (
            <Button 
              variant="outlined" 
              color="error" 
              fullWidth 
              onClick={onUnsubscribe}
              sx={{ py: 1.5 }}
            >
              구독 취소하기
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              onClick={onSubscribe}
              sx={{ py: 1.5 }}
            >
              구독하기
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default SubscriptionDetail;
