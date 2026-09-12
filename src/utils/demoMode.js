import axios from 'axios';

/**
 * DEMO MODE
 * --------------------------------------------------------------
 * Lets this frontend run standalone (no backend / no database)
 * for presentations and portfolio demos.
 *
 * - A fixed set of demo accounts below are checked locally on
 *   the Login page BEFORE any real API call is made.
 * - Once logged in with a demo account, a global axios response
 *   interceptor quietly turns any failed API call (since there's
 *   no real backend) into a harmless empty response instead of
 *   an error, so dashboards render their normal "no data yet"
 *   empty states instead of crashing or showing network errors.
 *
 * NOTE: This does not fabricate realistic project/task/user data —
 * it only prevents the UI from breaking when there's no backend.
 * Lists and stats will appear empty. This is purely for showing
 * off the frontend UI/UX, not a full working simulation.
 * --------------------------------------------------------------
 */

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

/**
 * Call once, early (main.jsx), before the app renders.
 * While demo mode is active, converts failed axios calls into
 * empty-but-successful responses so components don't error out.
 */
export const installDemoInterceptor = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (isDemoMode()) {
        const method = (error.config?.method || 'get').toLowerCase();
        const fallbackData = method === 'get' ? [] : { success: true, message: 'Demo mode: no backend connected.' };
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
