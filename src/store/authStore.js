import { create } from 'zustand';

const COUNSELORS = [
  {
    id: 'counselor1',
    name: 'Roopa'
  },
  {
    id: 'counselor2',
    name: 'Shwetha'
  }
];

const ADMIN = {
  id: 1,
  username: 'admin',
  password: 'admin123',
  role: 'admin',
  name: 'Adarsh'
};

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('currentUser')) || null,
  counselors: COUNSELORS,
  login: (username, password) => {
    if (username === ADMIN.username && password === ADMIN.password) {
      const userData = { ...ADMIN };
      delete userData.password;
      localStorage.setItem('currentUser', JSON.stringify(userData));
      set({ user: userData });
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem('currentUser');
    set({ user: null });
  },
  isAuthenticated: () => {
    return !!JSON.parse(localStorage.getItem('currentUser'));
  },
  getCounselors: () => COUNSELORS
}));

export default useAuthStore;