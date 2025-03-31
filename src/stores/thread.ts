import { defineStore } from 'pinia';
import { Thread } from '../models';
import { API_URLS } from '../const';
import axios from 'axios';

export const useThreadStore = defineStore('thread', {
  state: () => ({
    thread: {},
    fetching: true,
  }),
  persist: false,

  getters: {
    getFetching: (state) => state.fetching,
  },

  actions: {
    async fetchThread(thread_id: string) {
      this.fetching = true;
      const response = await axios.get(API_URLS.THREADS + thread_id);
      this.thread = response.data;
      this.fetching = false;
    },
  },
});
