<template>
  <q-layout
    view="hHh lpR fFf"
    v-bind:class="[$q.dark.isActive ? 'bg-dark' : 'bg-grey-1']"
  >
    <q-header
      class="q-px-lg"
      elevated
      v-bind:class="[
        $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black',
      ]"
    >
      <q-toolbar>
        <q-toolbar-title style="">
          <q-item
            clickable
            tag="a"
            target="_blank"
            @click="$router.push('/')"
            style="padding: 3px; width: 110px"
          >
            <q-item-section>
              <span class="text-weight-bold">Tech News</span>
            </q-item-section>
          </q-item>
        </q-toolbar-title>
        <div>
          <q-btn
            class="text-weight-bolder"
            style="top: 35px"
            v-bind:label="
              $q.dark.isActive ? 'ダークモード:ON' : 'ダークモード:OFF'
            "
            dense
            flat
            no-caps
            size="11px"
            @click="changeTheme()"
          />
        </div>

        <q-btn icon="las la-plus-circle" flat dense class="q-mx-xs">
          <q-tooltip> 投稿 </q-tooltip>
          <small class="q-px-xs">投稿</small>
        </q-btn>
        <q-btn icon="las la-bell" flat dense class="q-mx-xs">
          <q-tooltip> 通知 </q-tooltip>
          <small class="q-px-xs">通知</small>
        </q-btn>
        <div v-if="isLoggedIn" class="row">
          <q-img
            :src="avatarImage"
            style="height: 30px; width: 30px; border-radius: 50%"
            class="q-mx-xs"
          />
          <br />

          <q-btn color="primary" flat>
            {{ userName }}
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup @click="logout()">
                  <q-item-section>ログアウト</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>New incognito tab</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup>
                  <q-item-section>Recent tabs</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>History</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>Downloads</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup>
                  <q-item-section>Settings</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup>
                  <q-item-section>Help &amp; Feedback</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <q-btn flat to="/auth/login" class="text-weight-bolder" v-else>
          ログイン
        </q-btn>
      </q-toolbar>
    </q-header>

    <!--  <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="250"
      :breakpoint="500"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item clickable dense>
            <q-item-section avatar>
              <q-icon color="grey" name="las la-home" />
            </q-item-section>
            <q-item-section>
              <q-item-label
                ><span class="text-weight-bold text-caption"
                  >今日のトレンド</span
                ></q-item-label
              >
            </q-item-section>
          </q-item>
          <q-item clickable dense>
            <q-item-section avatar>
              <q-icon color="grey" name="las la-plug" />
            </q-item-section>
            <q-item-section>
              <q-item-label
                ><span class="text-weight-bold text-caption"
                  >API</span
                ></q-item-label
              >
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item-label header>コミュニティ</q-item-label>

          <q-item>
            <q-item-section avatar>
              <q-icon color="primary" name="bluetooth" />
            </q-item-section>
            <q-item-section>List item</q-item-section>
            <q-item-section side>
              <q-item-label caption>meta</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer> -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useUserStore } from 'src/stores/user';
import { LocalStorage, useQuasar } from 'quasar';

const $q = useQuasar();
const dark = LocalStorage.getItem('is_dark');
$q.dark.set(dark as boolean);

const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.is_logged_in);
const avatarImage = computed(() => userStore.profile?.avatar_image);
const userName = computed(() => userStore.profile?.username);
const fetchUserInfo = () => userStore.fetchUserInfo();

function changeTheme() {
  if ($q.dark.isActive) {
    $q.dark.set(false);
    LocalStorage.set('is_dark', false);
  } else {
    $q.dark.set(true);
    LocalStorage.set('is_dark', true);
  }
}

function logout() {
  userStore.logout();
  $q.notify({
    message: 'ログアウトしました',
    color: 'green',
    position: 'top',
    timeout: 2000,
  });
}

onMounted(() => {
  if (userStore.is_logged_in) {
    fetchUserInfo();
  }
});

defineOptions({
  name: 'MainLayout',
});
</script>
