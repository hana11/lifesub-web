import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

function TotalFeeCard({ totalFee, feeLevel }) {
  const formatNumber = (num) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
  };

  // fee level에 따른 UI 클래스와 텍스트 결정
  const levelClass = feeLevel === 'liker' ? 'level-liker' : 
                     feeLevel === 'collector' ? 'level-collector' : 'level-addict';
  
  const levelText = feeLevel === 'liker' ? '구독 라이커' : 
                    feeLevel === 'collector' ? '구독 컬렉터' : '구독 중독자';

  return (
    <Card elevation={2} sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          이번 달 총 구독료
        </Typography>
        <Typography variant="h4" component="p" sx={{ fontWeight: 'bold', my: 2 }}>
          {formatNumber(totalFee)}원
        </Typography>
        <Box className={`fee-level ${levelClass}`}>
          {levelText}
        </Box>
      </CardContent>
    </Card>
  );
}

export default TotalFeeCard;
