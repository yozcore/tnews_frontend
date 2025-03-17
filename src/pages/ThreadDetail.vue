<template>
  <q-page class="row justify-start">
    <div
      class="col-12 col-md-7 col-lg-6"
      :class="[$q.screen.lt.md ? 'q-px-sm' : 'q-px-xl q-mx-lg']"
    >
      <div v-if="fetching">
        <div class="row justify-center">
          <q-spinner-orbit color="primary" size="3em" class="q-my-lg" />
        </div>
      </div>
      <div v-else>
        <div class="text-h4 q-py-xl">{{ data.getThread.title }}</div>
        <div class="text-grey q-pb-md">
          {{ data.getThread.createdAt }} {{ data.getThread.user.username }}
        </div>
        <div v-html="data.getThread.body" class="text-body1"></div>
      </div>
    </div>
    <div class="col-2">
      <div v-if="fetching"></div>
      <div v-else class="q-py-xl">
        <div style="text-align: center" class="justify-center row">
          <q-img
            :src="data.getThread.user.avatarImage.url"
            class="imagehover"
            style="
              width: 50px;
              height: 50px;
              border-radius: 25px;
              cursor: pointer;
            "
          >
          </q-img>
        </div>
        <div style="text-align: center">{{ data.getThread.user.username }}</div>
        <div style="text-align: center" class="text-gley">
          {{ data.getThread.user.biography }}
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuery } from '@urql/vue';
import { GET_THREAD } from '../graphql/queries';
import { useRoute } from 'vue-router';

const route = useRoute();
defineOptions({
  name: 'ThreadDetail',
});

const { data, fetching, error, executeQuery } = useQuery({
  query: GET_THREAD,
  variables: {
    id: route.params.id,
  },
  requestPolicy: 'cache-and-network',
});
</script>
