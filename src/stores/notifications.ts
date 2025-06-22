import { defineStore } from 'pinia';
import { API_URLS } from '../const';
import { useUserStore } from './user';
import { Notification } from '../models';
import axios from 'axios';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [{}] as Notification[],
    count: 0,
    next: null,
    previous: null,
    fetching: true,
  }),
  persist: false,

  getters: {
    getFetching: (state) => state.fetching,
  },

  actions: {
    async fetchNotifications() {
      this.fetching = true;
      const userStore = useUserStore();
      const access_token = userStore.access_token;
      const response = await axios.get(API_URLS.ME + 'notifications/', {
        headers: {
          Authorization: 'Bearer ' + access_token,
        },
      });
      this.notifications = response.data.results;
      this.count = response.data.count;
      this.next = response.data.next;
      this.previous = response.data.previous;
      this.fetching = false;
    },
  },
});
