<template>
  <q-page class="row justify-center">
    <div
      class="q-py-xl q-px-md col-12 col-md-4 col-lg-3"
      style="max-width: 360px"
    >
      <div
        style="border-color: grey; border: solid 0.5px grey; border-radius: 5px"
        class="q-pa-md bg-white"
      >
        <div class="column items-center">
          <div class="text-h6 q-py-sm">ログイン</div>
        </div>
        <q-form bordered @submit="login">
          <q-input
            filled
            v-model="username"
            label="ユーザー名"
            lazy-rules
            dense
            :rules="[
              (val) =>
                (val && val.length > 0) || 'ユーザー名を入力してください',
            ]"
          />

          <q-input
            filled
            type="password"
            v-model="password"
            label="パスワード"
            lazy-rules
            dense
            :rules="[
              (val) =>
                (val && val.length > 0) || 'パスワードを入力してください',
            ]"
          />
          <q-btn
            color="primary"
            label="ログイン"
            class="full-width"
            dense
            type="submit"
          />
        </q-form>

        <div class="text-primary q-py-sm">パスワードをお忘れの場合</div>
      </div>

      <!-- <div class="row no-wrap justify-start items-center q-py-lg">
        <q-separator class="col q-ml-lg" />
        <small class="col-grow">または</small>
        <q-separator inset class="col" />
      </div>
      <div
        style="border-color: grey; border: solid 0.5px grey; border-radius: 5px"
        class="q-pa-md bg-white"
      >
        <div class="column items-center">
          <div class="text-h6 q-py-sm">アカウント作成</div>
        </div>
        <q-form>
          <q-input
            filled
            v-model="email"
            label="メールアドレス"
            lazy-rules
            dense
            :rules="[
              (val) =>
                (val && val.length > 0) || 'メールアドレスを入力してください',
            ]"
          />

          <q-input
            filled
            type="password"
            v-model="password"
            label="パスワード"
            lazy-rules
            dense
            :rules="[
              (val) =>
                (val && val.length > 0) || 'パスワードを入力してください',
            ]"
          />
          <q-btn
            color="primary"
            label="アカウントの作成"
            class="full-width"
            dense
          />
        </q-form>
      </div> -->
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from 'src/stores/user';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
const router = useRouter();

const $q = useQuasar();
const userStore = useUserStore();

const username = ref('');
const password = ref('');
const password2 = ref('');
async function login() {
  const formData = new FormData();
  const clientId = process.env.CLIENT_ID;

  formData.append('client_id', clientId ? clientId : '');
  formData.append('username', username.value);
  formData.append('password', password.value);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axios.post(
    process.env.API_URL + '/auth/login/',
    formData,
    config
  );

  if (response.data.access) {
    $q.notify('ログインしました。');
    userStore.setAccessToken(response.data.access);
    userStore.setRefreshToken(response.data.refresh);
    userStore.setIsLoggedIn(true);
    const user = await axios.get(process.env.API_URL + '0.1/me/account/', {
      headers: {
        Authorization: response.data.access,
      },
    });
    if (user.data) {
      userStore.setProfile(user.data);
    }
    router.push('/');
  } else {
    $q.notify('ログインできませんでした。');
  }
}
defineOptions({
  name: 'authLogin',
});
</script>
