import axios from 'axios';
import { getLocalRecommender } from './localRecommender.js';



export const DEMO_MODE_FLAG = 'smartfyp_demo_mode';

export const DEMO_ACCOUNTS = [
  { email: 'admin@demo.com', password: 'demo123', role: 'Admin', name: 'Demo Admin' },
  { email: 'hod@demo.com', password: 'demo123', role: 'HOD', name: 'Demo HOD' },
  { email: 'supervisor@demo.com', password: 'demo123', role: 'Supervisor', name: 'Demo Supervisor' },
  { email: 'leader@demo.com', password: 'demo123', role: 'Team Leader', name: 'Demo Team Leader' },
  { email: 'member@demo.com', password: 'demo123', role: 'Team Member', name: 'Demo Team Member' },
];

export const isDemoMode = () => localStorage.getItem(DEMO_MODE_FLAG) === 'true';

export const clearDemoMode = () => localStorage.removeItem(DEMO_MODE_FLAG);

export const findDemoAccount = (email, password) =>
  DEMO_ACCOUNTS.find(
    (acc) =>
      acc.email.toLowerCase() === (email || '').trim().toLowerCase() &&
      acc.password === password
  );

export const buildDemoLoginResponse = (account) => ({
  _id: 'demo-' + account.role.toLowerCase().replace(/\s+/g, '-'),
  name: account.name,
  email: account.email,
  role: account.role,
  token: 'demo-token-' + Date.now(),
  isFirstLogin: false,
});


export const installDemoInterceptor = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (isDemoMode()) {
        const method = (error.config?.method || 'get').toLowerCase();
        const url = error.config?.url || '';

        let fallbackData;

        if (url.includes('/api/recommendations')) {
          
          let payload = {};
          try {
            payload = error.config?.data ? JSON.parse(error.config.data) : {};
          } catch {
            payload = {};
          }
          const { results, inferenceTimeMs, metrics } = getLocalRecommender().recommend(payload);
          fallbackData = { success: true, data: results, inferenceTimeMs, metrics };
        } else if (method === 'get') {
          fallbackData = [];
        } else {
          
          fallbackData = { success: true, data: [], message: 'Demo mode: no backend connected.' };
        }

        return Promise.resolve({
          data: fallbackData,
          status: 200,
          statusText: 'OK (demo)',
          headers: {},
          config: error.config,
        });
      }
      return Promise.reject(error);
    }
  );
};
