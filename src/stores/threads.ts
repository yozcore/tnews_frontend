import { defineStore } from 'pinia';
import { Thread } from '../models';
import { API_URLS } from '../const';
import axios from 'axios';

export const useThreadsStore = defineStore('threads', {
  state: () => ({
    threads: [{}] as Thread[],
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
    async fetchThreads(sort = '', order = '', community = '', user = '') {
      this.fetching = true;
      const response = await axios.get(
        API_URLS.THREADS +
          `?sort=${sort}&order=${order}&community=${community}&user=${user}`
      );
      this.threads = response.data.results;
      this.count = response.data.count;
      this.next = response.data.next;
      this.previous = response.data.previous;
      this.fetching = false;
    },
    increment() {
      this.count++;
    },
  },
});
