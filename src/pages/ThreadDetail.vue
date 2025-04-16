<template>
  <q-page class="row justify-center">
    <div
      class="col-12 col-md-6 col-lg-5"
      :class="[$q.screen.lt.md ? 'q-px-sm' : 'q-px-xl q-mx-lg']"
    >
      <div v-if="fetching">
        <div class="row justify-center">
          <q-spinner-orbit color="primary" size="3em" class="q-my-lg" />
        </div>
      </div>
      <div v-else>
        <div class="text-h4 q-py-xl">{{ thread.title }}</div>
        <div class="text-grey q-pb-md">
          {{ thread.created_at }} {{ thread.user.username }}
        </div>
        <div v-html="thread.body" class="text-body1"></div>
      </div>
      <div v-if="commentFetching">
        <div class="row justify-center">
          <q-spinner-orbit color="primary" size="3em" class="q-my-lg" />
        </div>
      </div>
      <div v-else>
        <div v-for="comment in comments" :key="comment.id">
          <div class="row justify-start items-center q-py-md">
            <q-img
              :src="comment.user.avatar_image"
              class="imagehover"
              style="
                width: 36px;
                height: 36px;
                border-radius: 18px;
                cursor: pointer;
              "
            >
            </q-img>
            <div class="q-pl-md">{{ comment.user.username }}</div>
          </div>
          <div class="text-body1" style="padding-left: 36px">
            {{ comment.body }}
          </div>
        </div>
      </div>
    </div>
    <div class="col-2">
      <div v-if="fetching"></div>
      <div v-else class="q-py-xl">
        <div style="text-align: center" class="justify-center row">
          <q-img
            :src="thread.user.avatar_image"
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
        <div style="text-align: center">{{ thread.user.username }}</div>
        <div style="text-align: center" class="text-gley">
          {{ thread.user.biography }}
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, computed } from 'vue';
import { useThreadStore } from 'stores/thread';

const route = useRoute();
const threadId = route.params.id as string;
console.log('スレッドID:', threadId);
const store = useThreadStore();
const fetching = computed(() => store.getFetching);
const commentFetching = computed(() => store.getCommentFetching);
const thread = computed(() => store.thread);
const comments = computed(() => store.comments);
const fetchThread = () => store.fetchThread(threadId);
const fetchComments = () => store.fetchComments(threadId);

onMounted(() => {
  fetchThread();
  fetchComments();
});

defineOptions({
  name: 'ThreadDetail',
});
</script>
