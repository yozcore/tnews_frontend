<template>
  <q-page class="row justify-center">
    <div
      class="col-12 col-md-6 col-lg-5"
      :class="[$q.screen.lt.md ? 'q-px-sm' : 'q-px-xl q-mx-lg']"
    >
      <div class="q-mt-lg">
        <router-link
          to="/"
          :class="{
            'text-primary': route.path === '/',
            'text-weight-bold': route.path === '/',
            'text-black': route.path !== '/' && !$q.dark.isActive,
            'text-white': route.path !== '/' && $q.dark.isActive,
          }"
          style="margin-right: 25px; position: relative; text-decoration: none"
          >注目度

          <span
            :class="{
              selectedTabUnderline: route.path === '/',
            }"
          ></span
        ></router-link>
        <router-link
          to="/update"
          :class="{
            'text-primary': route.path === '/update',
            'text-weight-bold': route.path === '/update',
            'text-black': route.path !== '/update' && !$q.dark.isActive,
            'text-white': route.path !== '/update' && $q.dark.isActive,
          }"
          style="position: relative; text-decoration: none"
          >更新順<span
            :class="{
              selectedTabUnderline: route.path === '/update',
            }"
          ></span>
        </router-link>
      </div>

      <div v-if="fetching">
        <div class="row justify-center">
          <q-spinner-dots color="primary" size="2em" class="q-my-md" />
        </div>
      </div>

      <div v-else>
        <div v-if="threads">
          <div v-cloak v-for="(thread, index) in threads" v-bind:key="index">
            <ThreadComponent :thread="thread" />
          </div>
        </div>
      </div>
    </div>

    <div class="col-2"></div>
    <q-page-sticky position="bottom-right" :offset="[18, 88]">
      <q-btn @click="scrollTop()" round>
        <q-icon name="keyboard_arrow_up" />
        <q-tooltip>ページ上部へ</q-tooltip>
      </q-btn>
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[18, 28]">
      <q-btn @click="refetchData()" round>
        <q-icon name="update" />
        <q-tooltip>更新</q-tooltip>
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Todo, Meta } from 'src/models';
import { computed } from 'vue';
import { useQuery, Client, cacheExchange, fetchExchange } from '@urql/vue';
import { OperationContext } from '@urql/vue';
import { useRouter, useRoute } from 'vue-router';
import ThreadComponent from 'components/ThreadComponent.vue';
import { pipe, subscribe } from 'wonka';
import { client } from '../boot/urql';
import { useThreadsStore } from 'stores/threads';
import { useUserStore } from 'stores/user';
import { storeToRefs } from 'pinia';

const router = useRouter();
const store = useThreadsStore();
const user_store = useUserStore();
const route = useRoute();
const fetching = computed(() => store.getFetching);
const threads = computed(() => store.threads);
const updated_threads_is_unread = computed(
  () => user_store.updated_threads_is_unread
);
const fetchThreads = (sort = '', order = '') => store.fetchThreads(sort, order);
const setUpdatedThreadsIsUnread = (value: boolean) =>
  user_store.setUpdatedThreadsIsUnread(value);
const text = ref('');

onMounted(() => {
  fetchThreads();
});

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const reloadThreads = () => {
  if (route.name === 'top') {
    fetchThreads();
    setUpdatedThreadsIsUnread(true);
  } else if (route.name === 'update') {
    fetchThreads('updated_at', 'desc');
    setUpdatedThreadsIsUnread(false);
  }
};

function refetchData() {
  reloadThreads();
}

watch(
  () => route.fullPath, // パス or パラメータ or クエリに応じて調整
  () => {
    reloadThreads();
  },
  { immediate: true }
);

defineOptions({
  name: 'IndexPage',
});
</script>
