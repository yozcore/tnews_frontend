<template>
  <q-page class="row justify-start">
    <div
      class="col-12 col-md-7 col-lg-6"
      :class="[$q.screen.lt.md ? 'q-px-lg' : 'q-px-xl q-mx-lg']"
    >
      <div v-if="fetching">
        <div class="row justify-center q-my-lg">
          <q-spinner-orbit color="primary" size="3em" />
        </div>
      </div>
      <div v-else>
        <div class="text-h4 q-mb-md q-mt-xl">{{ thread.title }}</div>
        <div class="text-grey q-mb-md">
          {{ thread.humanized_created_at }}
          <a
            class="titlegreyhover"
            style="text-decoration: none"
            :href="'/c/' + thread.community.slug"
            @click.prevent="
              $emit('trigger');
              $router.push('/c/' + thread.community.slug);
            "
          >
            c/{{ thread.community.slug }}
          </a>
          <a
            class="titlegreyhover"
            style="text-decoration: none"
            :href="'/' + thread.user.username"
            @click.prevent="
              $emit('trigger');
              $router.push('/u/' + thread.user.username);
            "
          >
            u/{{ thread.user.username }}
          </a>
        </div>
        <div v-html="thread.body" class="text-body1 q-mb-lg"></div>
      </div>
      <div v-if="commentFetching || fetching">
        <div class="row justify-center q-my-lg"></div>
      </div>
      <div v-else style="width: 100%">
        <div v-for="comment in comments" :key="comment.id" class="q-mb-md">
          <div class="row justify-start items-start q-py-md">
            <q-img
              :src="comment.user.avatar_image"
              class="imagehover"
              style="
                width: 34px;
                height: 34px;
                border-radius: 17px;
                cursor: pointer;
                align-self: flex-start;
              "
            >
            </q-img>

            <div style="width: 90%" class="q-pl-sm">
              <div class="q-mb-xs">{{ comment.user.username }}</div>
              <div class="text-body1 q-mb-sm" style="white-space: pre-wrap">
                {{ comment.body }}
              </div>
              <div class="row justify-between q-mb-sm">
                <small class="text-grey-5">
                  {{ comment.humanized_created_at }} 返信
                </small>
                <q-btn
                  flat
                  dense
                  round
                  color="grey"
                  icon="close"
                  size="xs"
                  style="padding: 0; height: auto; width: auto"
                >
                  <q-menu>
                    <q-list dense style="min-width: 100px">
                      <q-item
                        clickable
                        v-close-popup
                        style="padding: 12px"
                        @click="console.log('clicked')"
                      >
                        <q-item-section
                          >非表示
                          <q-item-label caption
                            >この投稿が表示されなくなります</q-item-label
                          >
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup style="padding: 12px">
                        <q-item-section
                          >このユーザーを表示しない
                          <q-item-label caption
                            >このユーザーの投稿が表示されなくなります</q-item-label
                          >
                        </q-item-section>
                      </q-item>

                      <q-separator />
                      <q-item clickable style="padding: 12px">
                        <q-item-section
                          >報告
                          <q-item-label caption>違反を報告します</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-icon name="keyboard_arrow_right" />
                        </q-item-section>

                        <q-menu anchor="top end" self="top start">
                          <q-list>
                            <q-item clickable style="padding: 9px">
                              <q-item-section>コミュニティ違い</q-item-section>
                            </q-item>
                            <q-item clickable style="padding: 9px">
                              <q-item-section>禁止行為</q-item-section>
                            </q-item>
                            <q-item clickable style="padding: 9px">
                              <q-item-section>スパム/過剰投稿</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-item>
                      <q-separator />
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <q-separator class="q-my-md" />
      <div class="text-weight-bold">コメント</div>
      <div v-if="isLoggedIn">
        <q-input
          v-model="comment"
          outlined
          type="textarea"
          color="blue-12"
          :rows="5"
          class="q-mb-md"
        />
        <div class="float-right">
          <q-btn
            class="q-my-md"
            label="投稿"
            color="green-9"
            @click="postComment"
          />
        </div>
      </div>
      <div v-else>
        <div class="text-weight-bold text-grey">
          ログインしていないため、コメントは投稿できません
        </div>
        <div class="text-weight-bold text-grey">
          コメントを投稿するにはログインしてください
        </div>
      </div>

      <div class="q-my-xl"></div>
      <div class="q-my-xl"></div>
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
import { useUserStore } from 'src/stores/user';
import { useQuasar } from 'quasar';
import { ref } from 'vue';
const $q = useQuasar();
const route = useRoute();
const threadId = route.params.id as string;
const store = useThreadStore();
const userStore = useUserStore();
const access_token = userStore.access_token;
const fetching = computed(() => store.getFetching);
const commentFetching = computed(() => store.getCommentFetching);
const thread = computed(() => store.thread);
const comments = computed(() => store.comments);
const isLoggedIn = computed(() => userStore.is_logged_in);

const comment = ref('');
const username = ref('');
const password = ref('');

const fetchThread = () => store.fetchThread(threadId);
const fetchComments = () => store.fetchComments(threadId);

async function postComment() {
  if (comment.value.length > 0) {
    try {
      const response = await store.postComment(
        threadId,
        comment.value,
        access_token
      );

      if (response.status === 201) {
        comment.value = '';
      } else {
        $q.notify({
          message: `投稿に失敗しました（ステータス: ${response.status}）`,
          color: 'red',
          position: 'bottom',
          timeout: 2000,
        });
      }
    } catch (error) {
      $q.notify({
        message: 'コメント投稿中にエラーが発生しました',
        color: 'red',
        position: 'bottom',
        timeout: 2000,
      });
    }
  } else {
    $q.notify({
      message: 'コメントを入力してください',
      color: 'red',
      position: 'bottom',
      timeout: 2000,
    });
  }
}

onMounted(() => {
  fetchThread();
  fetchComments();
});

defineOptions({
  name: 'ThreadDetail',
});
</script>
