import { defineStore } from 'pinia';
import { User } from '../models';
import { API_URLS } from '../const';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    access_token: '',
    refresh_token: '',
    fetching: true,
    is_logged_in: false,
    profile: { avatar_image: '', username: '' },
    updated_threads_is_unread: true,
  }),
  persist: true,

  getters: {},

  actions: {
    setAccessToken(token: string) {
      this.access_token = token;
    },
    setRefreshToken(token: string) {
      this.refresh_token = token;
    },

    setIsLoggedIn(isLoggedIn: boolean) {
      this.is_logged_in = isLoggedIn;
    },
    setUpdatedThreadsIsUnread(isUnread: boolean) {
      this.updated_threads_is_unread = isUnread;
    },
    setProfile(profile: User) {
      this.profile = profile;
    },

    async fetchUserInfo() {
      this.fetching = true;

      const response = await axios.get(API_URLS.ME + 'account/', {
        headers: {
          Authorization: 'Bearer ' + this.access_token,
        },
      });

      this.profile = response.data;
      this.fetching = false;
    },

    async logout() {
      this.fetching = true;
      await axios.post(
        API_URLS.LOGOUT,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + this.access_token,
          },
        }
      );
      this.access_token = '';
      this.refresh_token = '';
      this.is_logged_in = false;
      this.fetching = false;
    },
  },
});
