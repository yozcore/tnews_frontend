import { defineStore } from 'pinia';
import { User } from '../models';
import { API_URLS } from '../const';
import axios from 'axios';

export const useOtherUserStore = defineStore('otherUser', {
  state: () => ({
    access_token: '',
    refresh_token: '',
    fetching: true,
    is_logged_in: false,
    profile: { avatar_image: '', username: '', notification_count: 0 },
  }),
  persist: false,

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

    async login(username: string, password: string) {
      this.fetching = true;
      const response = await axios.post(API_URLS.LOGIN, {
        username: username,
        password: password,
      });
      this.access_token = response.data.access;
      this.refresh_token = response.data.refresh;
      this.is_logged_in = true;
      this.fetching = false;
      await this.fetchUserInfo();
    },
    async refreshToken() {
      this.fetching = true;
      const response = await axios.post(
        API_URLS.REFRESH_TOKEN,
        {
          refresh: this.refresh_token,
        },
        {
          headers: {},
        }
      );
      this.access_token = response.data.access;
      this.refresh_token = response.data.refresh;
      this.is_logged_in = true;
      this.fetching = false;
      await this.fetchUserInfo();
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
