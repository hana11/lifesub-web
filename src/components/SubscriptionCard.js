import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

function SubscriptionCard({ subscription, onClick }) {
  return (
    <Card 
      className="subscription-card" 
      onClick={() => onClick(subscription.id)}
      sx={{ cursor: 'pointer' }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img 
          src={subscription.logoUrl || '/images/default-logo.png'} 
          alt={subscription.serviceName} 
          className="subscription-logo" 
        />
        <Typography className="subscription-name">
          {subscription.serviceName}
        </Typography>
      </Box>
    </Card>
  );
}

export default SubscriptionCard;
