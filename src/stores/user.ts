import { defineStore } from 'pinia';
import { User } from '../models';

export const useUserStore = defineStore('user', {
  state: () => ({
    access_token: '',
    refresh_token: '',

    is_logged_in: false,
    profile: { avatar_image: '' },
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
  },
});
