<template>
  <q-page class="row justify-start">
    <div
      class="col-12 col-md-7 col-lg-6"
      :class="[$q.screen.lt.md ? 'q-px-sm' : 'q-px-xl q-mx-lg']"
    >
      <q-form
        @click="
          $emit('trigger');
          $router.push('/post/');
        "
        class="q-gutter-md q-mt-md"
      >
        <q-input
          filled
          v-model="text"
          label="何を共有しますか？"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || '何を共有しますか？']"
        />
      </q-form>
      <!-- <q-tabs
        v-if="
          $route.name === 'index' ||
          $route.name === 'follow' ||
          $route.name === 'news' ||
          $route.name === 'meme' ||
          $route.name === 'today_i_learned' ||
          $route.name === 'question' ||
          $route.name === 'off_topic' ||
          $route.name === 'product'
        "
        dense
        align="left"
        :breakpoint="0"
        mobile-arrows
        active-color="primary"
        class="text-black"
        style="z-index: 100; max-width: 100vw"
        v-bind:class="[$q.dark.isActive ? 'bg-dark' : 'bg-grey-1']"
      >
        <q-route-tab name="follow" label="フォロー" to="/follow" />
        <q-route-tab name="news" label="ニュース" to="/" />
        <q-route-tab name="meme" label="ミーム" to="/meme" />
        <q-route-tab name="til" label="TIL" to="/today_i_learned" />
        <q-route-tab name="product" label="プロダクト" to="/product" />
      </q-tabs> -->
      <div v-if="fetching">
        <div class="row justify-center">
          <q-spinner-dots color="primary" size="2em" class="q-my-md" />
        </div>
      </div>

      <div v-else>
        <div v-if="data.getThreads.threads.length === 0">
          <div class="row justify-center">
            <p class="q-my-md">投稿がありません。</p>
          </div>
        </div>
        <div
          v-cloak
          v-for="(thread, index) in data.getThreads.threads"
          v-bind:key="index"
        >
          <ThreadComponent :thread="thread" />
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
import { ref, watch } from 'vue';
import { Todo, Meta } from 'src/models';
import { GET_THREADS } from '../graphql/queries';
import { computed } from 'vue';
import { useQuery, Client, cacheExchange, fetchExchange } from '@urql/vue';
import { OperationContext } from '@urql/vue';
import { useRouter, useRoute } from 'vue-router';
import ThreadComponent from 'components/ThreadComponent.vue';
import { pipe, subscribe } from 'wonka';
import { client } from '../boot/urql';

const router = useRouter();

const route = computed(() => useRoute());

const text = ref('');
const { data, fetching, error, executeQuery } = useQuery({
  query: GET_THREADS,
  variables: {
    limit: 16,
    filter: {
      category: route.value.name,
    },
  },
  requestPolicy: 'network-only',
});

const updateQuery = async (category_name: any) => {
  fetching.value = true;
  try {
    const result = await client.query(GET_THREADS, {
      limit: 16,
      filter: { category: category_name },
    });
    if (result.data) {
      data.value = result.data;
      fetching.value = false;
    }
  } catch (error) {
    console.error('Error querying data:', error);
  }
};

watch(
  () => route.value.name,
  (name) => {
    updateQuery(name);
  }
);

const refetchData = async () => {
  try {
    await executeQuery({
      query: GET_THREADS,
      variables: {
        limit: 15,
      },
      pause: true,
    });
  } catch (err) {
    console.error('Error refetching data:', err);
  }
};

const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

defineOptions({
  name: 'IndexPage',
});
</script>
