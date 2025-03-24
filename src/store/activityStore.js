import { create } from 'zustand';

const useActivityStore = create((set, get) => ({
  activities: JSON.parse(localStorage.getItem('activities') || '[]'),
  
  addActivity: (activity) => {
    const activities = [...get().activities, {
      ...activity,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }];
    localStorage.setItem('activities', JSON.stringify(activities));
    set({ activities });
  },

  getActivities: () => get().activities,

  clearActivities: () => {
    localStorage.setItem('activities', '[]');
    set({ activities: [] });
  }
}));

export default useActivityStore;