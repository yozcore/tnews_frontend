import { defineStore } from 'pinia';
import { Thread, User } from '../models';
import { API_URLS } from '../const';
import axios from 'axios';
import { title } from 'process';
import { useQuasar } from 'quasar';

export const useThreadStore = defineStore('thread', {
  state: () => ({
    thread: {} as Thread,
    fetching: true,
    comments: [
      {
        id: '',
        body: '',
        humanized_created_at: '',
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
    async postComment(thread_id: string, body: string, access_token: string) {
      this.comment_fetching = true;
      const response = await axios.post(
        API_URLS.COMMENTS,
        {
          thread: thread_id,
          body: body,
        },
        {
          headers: {
            Authorization: 'Bearer ' + access_token,
          },
        }
      );

      this.comments.push(response.data);
      this.comment_fetching = false;
      return response;
    },
  },
});
