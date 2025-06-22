<template>
  <div class="q-my-md q-pa-sm">
    <div style="width: 100%">
      <div class="row justify-between">
        <q-item-section>
          <div>
            <a
              v-bind:class="[
                $q.dark.isActive ? 'titlehoverdark' : 'titlehover',
              ]"
              class="line-clamp-body"
              :href="'/thread/' + thread.id"
              style="cursor: pointer; font-size: 16px"
              @click.prevent="
                $emit('trigger');
                $router.push('/thread/' + thread.id);
              "
            >
              {{ thread.title }}
              <small class="text-grey" v-if="thread.contentType == 1"
                >({{ thread.url?.netloc }})</small
              >
            </a>
            <div class="row justify-between">
              <small class="text-grey">
                <a
                  class="titlegreyhover"
                  v-if="thread.community"
                  style="text-decoration: none"
                  :href="'/c/' + thread.community.slug"
                  @click.prevent="
                    $emit('trigger');
                    $router.push('/c/' + thread.community.slug);
                  "
                >
                  c/{{ thread.community.slug }}
                </a>
                &nbsp;
                <a
                  class="titlegreyhover"
                  style="text-decoration: none"
                  :href="'/u/' + thread.user.username"
                  @click.prevent="
                    $emit('trigger');
                    $router.push('/u/' + thread.user.username);
                  "
                >
                  u/{{ thread.user.username }}
                </a>
                &nbsp;
                <a
                  class="titlegreyhover"
                  :href="'/thread/' + thread.id"
                  style="cursor: pointer; text-decoration: none"
                  @click.prevent="
                    $emit('trigger');
                    $router.push('/thread/' + thread.id);
                  "
                  >{{ thread.comment_count }}コメント</a
                >
                &nbsp;{{ thread.humanized_updated_at }}&nbsp;
              </small>
              <div>
                <q-btn
                  flat
                  dense
                  round
                  color="grey"
                  icon="close"
                  size="xs"
                  style="padding: 5px"
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
        </q-item-section>

        <q-item-section
          side
          v-if="thread.thumbnail_image"
          @click="$emit('trigger')"
        >
          <div style="overflow: hidden; width: 100%; height: 100%">
            <q-img
              :src="thread.thumbnail_image"
              class="imagehover"
              style="
                width: 130px;
                height: 85px;
                border-radius: 5px;
                cursor: pointer;
              "
            >
              <div class="absolute-bottom text-center" v-if="thread.type == 2">
                <small>{{ thread.netloc }}</small>
              </div>
            </q-img>
          </div>
        </q-item-section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ThreadComponent',
});

interface Props {
  thread: any;
}

withDefaults(defineProps<Props>(), {
  thread: () => [],
});
</script>
