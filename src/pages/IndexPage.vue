<template>
  <q-page class="row justify-start">
    <div
      class="col-12 col-md-7 col-lg-6"
      :class="[$q.screen.lt.md ? 'q-px-lg' : 'q-px-xl q-mx-lg']"
    >
      <div v-if="route.name == 'community'" class="q-mt-md">
        <div v-if="!community_fetching">
          <div style="text-align: center">
            <div>
              <q-img
                :src="community.thumbnail_image"
                style="
                  width: 85px;
                  height: 85px;
                  border-radius: 42.5px;
                  cursor: pointer;
                "
              >
              </q-img>
            </div>
            <div>
              {{ community.name }}
            </div>
            <div class="text-grey">/c/{{ community.slug }}</div>
          </div>
        </div>
      </div>
      <div v-else-if="route.name == 'user'">user</div>
      <div v-else-if="route.name == 'top'">
        <div class="q-mt-lg">
          <router-link
            to="/"
            :class="{
              'text-primary': route.path === '/',
              'text-weight-bold': route.path === '/',
              'text-black': route.path !== '/' && !$q.dark.isActive,
              'text-white': route.path !== '/' && $q.dark.isActive,
            }"
            style="position: relative; text-decoration: none"
            >トレンド<span
              :class="{
                selectedTabUnderline: route.path === '/',
              }"
            ></span>
          </router-link>
        </div>
      </div>

      <div v-if="fetching">
        <div class="row justify-center">
          <q-spinner-orbit color="primary" size="3em" />
        </div>
      </div>

      <div v-else>
        <div v-if="threads && threads.length > 0">
          <div v-cloak v-for="(thread, index) in threads" v-bind:key="index">
            <ThreadComponent :thread="thread" />
          </div>
        </div>
        <div v-else>
          <div class="row justify-center q-pa-md">投稿がありませんでした。</div>
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
import { useRouter, useRoute } from 'vue-router';
import ThreadComponent from 'components/ThreadComponent.vue';
import { useThreadsStore } from 'stores/threads';
import { useCommunityStore } from 'stores/community';
import { useUserStore } from 'stores/user';
import { useOtherUserStore } from 'stores/otherUser';
import { storeToRefs } from 'pinia';

const store = useThreadsStore();
const communityStore = useCommunityStore();
const route = useRoute();
const fetching = computed(() => store.getFetching);
const threads = computed(() => store.threads);
const community_fetching = computed(() => communityStore.getFetching);
const community = computed(() => communityStore.community);

const fetchThreads = (sort = '', order = '', community = '', user = '') =>
  store.fetchThreads(sort, order, community, user);

const fetchCommunity = (slug: string) => communityStore.fetchCommunity(slug);
const fetchUser = (username: string) => {
  const otherUserStore = useOtherUserStore();
  otherUserStore.fetchUser(username);
};

onMounted(() => {
  reloadThreads();
});

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const reloadThreads = () => {
  if (route.name === 'top') {
    fetchThreads();
  } else if (route.name === 'update') {
    fetchThreads('updated_at', 'desc');
  } else if (route.name === 'community') {
    fetchThreads(
      'updated_at',
      'desc',
      typeof route.params.slug === 'string' ? route.params.slug : ''
    );
    fetchCommunity(
      typeof route.params.slug === 'string' ? route.params.slug : ''
    );
  } else if (route.name === 'user') {
    fetchThreads(
      'updated_at',
      'desk',
      '',
      typeof route.params.username == 'string' ? route.params.username : ''
    );
    fetchUser(
      typeof route.params.username == 'string' ? route.params.username : ''
    );
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
