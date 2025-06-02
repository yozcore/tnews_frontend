<template>
  <q-page class="row justify-start">
    <div
      class="col-12 col-md-7 col-lg-6"
      :class="[$q.screen.lt.md ? 'q-px-lg' : 'q-px-xl q-mx-lg']"
    >
      <div class="q-pt-md">
        <div class="text-grey">カテゴリ</div>
        <q-radio
          v-model="postType"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="community"
          label="ニュース"
        />
        <q-radio
          v-model="postType"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="meme"
          label="ミーム"
        />
        <q-radio
          v-model="postType"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="til"
          label="TIL"
        />
        <q-radio
          v-model="postType"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="product"
          label="プロダクト"
        />

        <q-radio
          v-model="postType"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="soliloquy"
          label="独り言"
        />
      </div>

      <div class="q-pt-md" v-if="postType == 'community'">
        <div class="text-grey">形式</div>
        <q-radio
          v-model="postFormat"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="link"
          label="リンク"
        />
        <q-radio
          v-model="postFormat"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="article"
          label="記事"
        />
      </div>

      <q-input
        outlined
        class="q-py-md"
        v-model="title"
        dense
        label="タイトル"
        maxlength="100"
        :rules="[
          (title) =>
            (title.length <= 100 && title.length >= 0) ||
            '1文字以上100文字以内',
        ]"
        v-bind:class="[$q.dark.isActive ? 'bg-dark' : 'bg-grey-1']"
      >
      </q-input>
      <q-editor
        class="q-my-md"
        v-model="body"
        min-height="5rem"
        ref="editorRef"
        :definitions="{
          upload: {
            tip: '画像アップロード',
            icon: 'insert_photo',
            handler: insertPicture,
          },
        }"
        :toolbar="[
          [
            'bold',
            ['token'],
            'hr',
            'custom_btn',
            'upload',
            'video',
            'embedlink',
            'embedsocial',

            ['fullscreen'],
          ],
        ]"
        max-height="100%"
      />
      <div class="float-right">
        <q-btn
          v-if="title && body"
          @click="createThread()"
          color="grey"
          class="q-mr-md"
        >
          下書き保存
        </q-btn>
        <q-btn v-if="title && body" @click="createThread()" color="green-9">
          投稿する
        </q-btn>
        <q-btn v-else disable @click="createThread()" color="green-9"
          >投稿する
        </q-btn>
      </div>
    </div>
    <div class="col-2"></div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/user';
import { API_URLS } from '../const';
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter();

const userStore = useUserStore();
const $q = useQuasar();
const editorRef = ref<any>(null);
defineOptions({
  name: 'ThreadPost',
});
const postType = ref('community');
const postFormat = ref('link');
const comment = ref('anyone');
const title = ref('');
const body = ref('');

function insertPicture() {
  const input = document.createElement('input');
  const edit = editorRef.value;

  input.type = 'file';
  input.accept = '.png, .jpg, jpeg, .gif'; // file extensions allowed
  let file;
  input.onchange = function () {
    const files = Array.from(input.files as FileList);
    file = files[0];
    if (file.size > 1024 * 1024 * 5) {
      $q.notify({
        message:
          'ファイルサイズが5MBを超えているため、アップロードできません。',
        color: 'red-5',
        textColor: 'white',
        icon: 'info',
      });
    } else {
      const reader = new FileReader();
      let dataUrl = '';
      reader.onloadend = function () {
        dataUrl = reader.result as string;

        const data = {
          key: dataUrl,
        };
        axios
          .post(process.env.API_URL + '/v1/tempimage/', data, {
            headers: {
              Authorization: 'Bearer ' + userStore.access_token,
            },
          })
          .then((response) => {
            body.value =
              body.value +
              "<br /><div style='text-align: center;'><img src='" +
              response.data.image +
              "' style='width:100%' /></div><br />";

            //images.push(response.data.image);
            //setThumbnail(response.data.image);
          })
          .catch((err) => {
            $q.notify({
              message: err,
              color: 'red-5',
              textColor: 'white',
              icon: 'info',
            });
          });
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

async function createThread() {
  const modifiedBody = body.value.replace(/"/g, "'");
  const modifiedTitle = title.value.replace(/"/g, "'");
  try {
    const response = await axios.post(
      API_URLS.THREADS,
      {
        body: modifiedBody,
        title: modifiedTitle,
      },
      {
        headers: {
          Authorization: 'Bearer ' + userStore.access_token,
        },
      }
    );
    router.push('/');
  } catch (error) {
    console.error(error);
  }
}
</script>
