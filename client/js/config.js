// Replace this with your actual Render backend URL after deploying it
const PROD_API_URL = 'https://your-backend-app.onrender.com/api';
const LOCAL_API_URL = 'http://127.0.0.1:5001/api';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE_URL = isLocalhost ? LOCAL_API_URL : PROD_API_URL;
