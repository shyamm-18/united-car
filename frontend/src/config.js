// Centralized API Base URL
// In production, this will be the URL of your Render backend.
// Locally, it defaults to http://localhost:5000

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default API_BASE_URL;
