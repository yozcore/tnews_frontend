import { defineStore } from 'pinia';
import { Thread, User, Community } from '../models';
import { API_URLS } from '../const';
import axios from 'axios';
import { title } from 'process';
import { useQuasar } from 'quasar';

export const useCommunityStore = defineStore('community', {
  state: () => ({
    community: {} as Community,
    fetching: true,
  }),
  persist: false,

  getters: {
    getFetching: (state) => state.fetching,
  },

  actions: {
    async fetchCommunity(slug: string) {
      this.fetching = true;
      const response = await axios.get(API_URLS.COMMUNITIES + `${slug}/`);
      this.community = response.data;
      this.fetching = false;
    },
  },
});
