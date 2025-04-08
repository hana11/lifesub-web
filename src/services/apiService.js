import axios from 'axios';

const { AUTH_URL, MYSUB_URL, RECOMMEND_URL } = window.__runtime_config__ || {
  AUTH_URL: 'http://20.1.2.3/api/auth',
  MYSUB_URL: 'http://20.1.2.3/api/mysub',
  RECOMMEND_URL: 'http://20.1.2.3/api/recommend'
};

// 인증된 요청에 사용할 Axios 인스턴스 생성
const createAuthorizedRequest = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// 인증 관련 API 함수
export const loginUser = async (userId, password) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, {
      userId,
      password
    });
    return response.data.data;
  } catch (error) {
    console.error('로그인 에러:', error);
    throw error;
  }
};

export const logoutUser = async (userId) => {
  try {
    const request = createAuthorizedRequest();
    const response = await request.post(`${AUTH_URL}/logout`, {
      userId
    });
    return response.data.data;
  } catch (error) {
    console.error('로그아웃 에러:', error);
    throw error;
  }
};

// 구독 관련 API 함수
export const getTotalFee = async (userId) => {
  try {
    const request = createAuthorizedRequest();
    const response = await request.get(`${MYSUB_URL}/total-fee?userId=${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('총 구독료 조회 에러:', error);
    throw error;
  }
};

export const getMySubscriptions = async (userId) => {
  try {
    const request = createAuthorizedRequest();
    const response = await request.get(`${MYSUB_URL}/list?userId=${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('구독 목록 조회 에러:', error);
    throw error;
  }
};

export const getSubscriptionDetail = async (subscriptionId) => {
  try {
    const request = createAuthorizedRequest();
    const response = await request.get(`${MYSUB_URL}/services/${subscriptionId}`);
    return response.data.data;
  } catch (error) {
    console.error('구독 상세 조회 에러:', error);
    throw error;
  }
};

export const subscribeService = async (userId, subscriptionId) => {
  try {
    const request = createAuthorizedRequest();
    const response = await request.post(`${MYSUB_URL}/services/${subscriptionId}/subscribe?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('구독 신청 에러:', error);
    throw error;
  }
};

export const unsubscribeService = async (subscriptionId) => {
  try {
    const request = createAuthorizedRequest();
    const response = await request.delete(`${MYSUB_URL}/services/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.error('구독 취소 에러:', error);
    throw error;
  }
};

export const getAllCategories = async () => {
  try {
    const request = createAuthorizedRequest();
    const response = await request.get(`${MYSUB_URL}/categories`);
    return response.data.data;
  } catch (error) {
    console.error('카테고리 목록 조회 에러:', error);
    throw error;
  }
};

export const getServicesByCategory = async (categoryId) => {
  try {
    const request = createAuthorizedRequest();
    const response = await request.get(`${MYSUB_URL}/services?categoryId=${categoryId}`);
    return response.data.data;
  } catch (error) {
    console.error('카테고리별 서비스 조회 에러:', error);
    throw error;
  }
};

// 추천 관련 API 함수
export const getRecommendedCategory = async (userId) => {
  try {
    const request = createAuthorizedRequest();
    const response = await request.get(`${RECOMMEND_URL}/categories?userId=${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('추천 카테고리 조회 에러:', error);
    throw error;
  }
};
