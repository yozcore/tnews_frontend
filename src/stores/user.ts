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
    setProfile(profile: User) {
      this.profile = profile;
    },

    async fetchUserInfo() {
      this.fetching = true;
      console.log(this.access_token);
      const response = await axios.get(API_URLS.ME + 'account/', {
        headers: {
          Authorization: 'Bearer ' + this.access_token,
        },
      });
      console.log(response);
      this.profile = response.data;
      this.fetching = false;
    },
  },
});
