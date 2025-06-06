import { defineStore } from 'pinia';
import { User, MyCommunity } from '../models';
import { API_URLS } from '../const';
import axios from 'axios';

export const useUserStore = defineStore('user', {
  state: () => ({
    access_token: '',
    refresh_token: '',
    fetching: true,
    is_logged_in: false,
    profile: { avatarImage: '', username: '', notificationCount: 0 },
    updated_threads_is_unread: true,
    my_communities: [{}] as MyCommunity[],
    my_communities_count: 0,
    my_communities_next: null,
    my_communities_previous: null,
    my_communities_fetching: true,
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

    async fetchMyCommunities() {
      this.my_communities_fetching = true;
      const response = await axios.get(API_URLS.ME + 'communities/', {
        headers: {
          Authorization: 'Bearer ' + this.access_token,
        },
      });
      this.my_communities = response.data.results;
      this.my_communities_count = response.data.count;
      this.my_communities_next = response.data.next;
      this.my_communities_previous = response.data.previous;
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
