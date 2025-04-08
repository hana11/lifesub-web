import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import Header from '../components/Header';
import SubscriptionDetail from '../components/SubscriptionDetail';
import { 
  getSubscriptionDetail, 
  getMySubscriptions, 
  subscribeService,
  unsubscribeService
} from '../services/apiService';

function ServiceDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.userId) {
      fetchData();
    }
  }, [id, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 구독 상세 정보 및 내 구독 목록 병렬 조회
      const [detailResponse, subscriptionsResponse] = await Promise.all([
        getSubscriptionDetail(id),
        getMySubscriptions(user.userId)
      ]);
      
      setSubscription(detailResponse);
      
      // 현재 서비스를 구독 중인지 확인
      const isCurrentlySubscribed = subscriptionsResponse.some(
        sub => String(sub.id) === String(id)
      );
      setIsSubscribed(isCurrentlySubscribed);
    } catch (err) {
      console.error('상세 정보 조회 에러:', err);
      setError('서비스 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      await subscribeService(user.userId, id);
      setIsSubscribed(true);
      setSuccessMessage('구독이 완료되었습니다.');
      setTimeout(() => {
        navigate('/subscriptions');
      }, 1500);
    } catch (err) {
      console.error('구독 신청 에러:', err);
      setError('구독 신청 중 오류가 발생했습니다.');
    }
  };

  const handleOpenConfirm = () => {
    setConfirmDialog(true);
  };

  const handleCloseConfirm = () => {
    setConfirmDialog(false);
  };

  const handleUnsubscribe = async () => {
    handleCloseConfirm();
    try {
      await unsubscribeService(id);
      setIsSubscribed(false);
      setSuccessMessage('구독이 취소되었습니다.');
      setTimeout(() => {
        navigate('/subscriptions');
      }, 1500);
    } catch (err) {
      console.error('구독 취소 에러:', err);
      setError('구독 취소 중 오류가 발생했습니다.');
    }
  };

  const handleCloseSuccess = () => {
    setSuccessMessage('');
  };

  const handleCloseError = () => {
    setError('');
  };

  if (loading) {
    return (
      <Box>
        <Header title="서비스 상세" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Header title="서비스 상세" />
      
      <Box className="page-container">
        {subscription && (
          <SubscriptionDetail 
            subscription={subscription}
            isSubscribed={isSubscribed}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleOpenConfirm}
          />
        )}
      </Box>
      
      {/* 구독 취소 확인 다이얼로그 */}
      <Dialog open={confirmDialog} onClose={handleCloseConfirm}>
        <DialogTitle>
          구독 취소 확인
        </DialogTitle>
        <DialogContent>
          <Typography>
            {subscription?.serviceName} 구독을 정말 취소하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>취소</Button>
          <Button onClick={handleUnsubscribe} color="error" autoFocus>
            구독 취소
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 알림 메시지 */}
      <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ServiceDetail;
