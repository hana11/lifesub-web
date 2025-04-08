import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Snackbar,
  Alert
} from '@mui/material';
import { loginUser } from '../services/apiService';

function Login({ onLogin }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userId || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await loginUser(userId, password);
      
      if (response && response.accessToken) {
        onLogin({
          userId,
          accessToken: response.accessToken
        });
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%',
          borderRadius: 3
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          생활구독 관리
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          구독 서비스를 편리하게 관리하세요
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="아이디"
            variant="outlined"
            fullWidth
            className="form-field"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            margin="normal"
            autoComplete="username"
          />
          
          <TextField
            label="비밀번호"
            type="password"
            variant="outlined"
            fullWidth
            className="form-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            autoComplete="current-password"
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </Box>
        
        <Typography variant="caption" align="center" sx={{ display: 'block', mt: 2 }}>
          테스트 계정: user01 / Passw0rd
        </Typography>
      </Paper>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;
