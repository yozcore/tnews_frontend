<template>
  <q-layout
    view="hHh Lpr lFf"
    v-bind:class="[$q.dark.isActive ? 'bg-dark' : 'bg-grey-1']"
  >
    <q-header
      class="q-px-lg"
      bordered
      v-bind:class="[
        $q.dark.isActive ? 'bg-dark text-white' : 'bg-white  text-black',
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
        <q-btn @click="toggleSideBar"> t </q-btn>
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

        <q-btn
          icon="las la-plus-circle"
          flat
          dense
          class="q-mx-xs"
          @click="$router.push('/post')"
        >
          <q-tooltip> 投稿 </q-tooltip>
          <small class="q-px-xs">投稿</small>
        </q-btn>
        <q-btn icon="las la-bell" flat dense class="q-mx-xs">
          <q-tooltip> 通知 </q-tooltip>
          <small class="q-px-xs">通知</small>
          <div v-if="isLoggedIn && notificationCount >= 0">
            通知{{ notificationCount }}件
          </div>
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

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      :overlay="false"
      :width="220"
      :breakpoint="500"
    >
      <q-scroll-area class="fit">
        <!-- <q-list padding v-if="myCommunities && myCommunities.length > 0">
          <q-item-label header>コミュニティ</q-item-label>
          <div
            v-for="community in myCommunities"
            v-bind:key="community.community.id"
          >
            <q-item
              clickable
              @click.prevent="
                $emit('trigger');
                $router.push('/c/' + community.community.slug);
              "
            >
              <q-item-section avatar>
                <q-icon color="primary" name="bluetooth" />
              </q-item-section>
              <q-item-section>{{ community.community.name }}</q-item-section>
            </q-item>
          </div>
        </q-list>
        <div
          v-else-if="myCommunities && myCommunities.length === 0"
          class="q-pa-md text-grey"
        >
          参加中のコミュニティはありません
        </div> -->
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- place QPageScroller at end of page -->
    <q-page-scroller position="top" :scroll-offset="20" :offset="[0, 18]">
      <q-btn
        fab
        dense
        round
        icon="keyboard_arrow_up"
        size="md"
      /> </q-page-scroller
    ><q-page-scroller
      reverse
      position="bottom"
      :scroll-offset="20"
      :offset="[0, 18]"
    >
      <q-btn fab dense round icon="keyboard_arrow_down" size="md" />
    </q-page-scroller>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useUserStore } from 'src/stores/user';

import { useNotificationsStore } from 'src/stores/notifications';
import { LocalStorage, useQuasar } from 'quasar';

const $q = useQuasar();
const dark = LocalStorage.getItem('is_dark');
$q.dark.set(dark as boolean);

const userStore = useUserStore();

const notificationsStore = useNotificationsStore();
const isLoggedIn = computed(() => userStore.is_logged_in);
const avatarImage = computed(() => userStore.profile?.avatarImage);
const userName = computed(() => userStore.profile?.username);
const notificationCount = computed(() => userStore.profile?.notificationCount);
const myCommunities = computed(() => userStore.my_communities);
const myCommunitiesFetching = computed(() => userStore.my_communities_fetching);

const fetchUserInfo = () => userStore.fetchUserInfo();
const fetchNotifications = () => notificationsStore.fetchNotifications();
const fetchMyCommunities = () => userStore.fetchMyCommunities();
const leftDrawerOpen = ref(true);
function toggleSideBar() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

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
    position: 'bottom',
    timeout: 2000,
  });
}

onMounted(() => {
  if (userStore.is_logged_in) {
    fetchUserInfo();
    fetchMyCommunities();
  }
});

defineOptions({
  name: 'MainLayout',
});
</script>
