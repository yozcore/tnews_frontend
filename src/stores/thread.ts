import { defineStore } from 'pinia';
import { Thread } from '../models';
import { API_URLS } from '../const';
import axios from 'axios';
import { title } from 'process';

export const useThreadStore = defineStore('thread', {
  state: () => ({
    thread: {
      body: '',
      title: '',
      created_at: '',
      user: {
        id: '',
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        avatar_image: '',
        biography: '',
        location: '',
        website: '',
        date_joined: '',
        is_active: false,
        is_staff: false,
      },
    },
    fetching: true,
    comments: [
      {
        id: '',
        body: '',
        user: {
          id: '',
          username: '',
          avatar_image: '',
        },
      },
    ],
    comment_fetching: true,
  }),
  persist: false,

  getters: {
    getFetching: (state) => state.fetching,
    getComments: (state) => state.comments,
    getCommentFetching: (state) => state.comment_fetching,
  },

  actions: {
    async fetchThread(thread_id: string) {
      this.fetching = true;
      const response = await axios.get(API_URLS.THREADS + thread_id);
      this.thread = response.data;
      this.fetching = false;
    },
    async fetchComments(thread_id: string) {
      this.fetching = true;
      const response = await axios.get(
        API_URLS.COMMENTS + `?thread=${thread_id}`
      );
      this.comments = response.data.results;
      this.comment_fetching = false;
    },
  },
});
