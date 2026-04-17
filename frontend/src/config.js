// Centralized API Base URL
const API_BASE_URL = 'http://localhost:5000';

console.log('🚀 UNTED CAR API CONFIG:', {
  URL: API_BASE_URL,
  mode: import.meta.env.MODE
});

export default API_BASE_URL;
