<template>
  <q-page class="row justify-center">
    <div
      class="col-12 col-md-6 col-lg-5"
      :class="[$q.screen.lt.md ? 'q-px-sm' : 'q-px-xl q-mx-lg']"
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
      <div class="q-py-md" v-if="postType == 'community'">
        <div class="text-grey">コメント</div>
        <q-radio
          v-model="comment"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="anyone"
          label="誰でも"
        />
        <q-radio
          v-model="comment"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          val="prohibited"
          label="コメント不可"
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
            (title.length <= 100 && title.length >= 1) ||
            '1文字以上100文字以内',
        ]"
        v-bind:class="[$q.dark.isActive ? 'bg-dark' : 'bg-grey-1']"
      >
      </q-input>
      <q-editor
        class="q-my-md bg-grey-1"
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
          dense
          class="q-mr-md"
        >
          <small class="text-weight-bolder">下書き保存</small>
        </q-btn>
        <q-btn
          v-if="title && body"
          @click="createThread()"
          color="green-9"
          dense
        >
          <small class="text-weight-bolder">投稿する</small>
        </q-btn>
        <q-btn v-else disable @click="createThread()" color="green-9" dense
          ><small class="text-weight-bolder">投稿する</small>
        </q-btn>
      </div>
    </div>
    <div class="col-2"></div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/user';
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
    const files = Array.from(input.files);
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
            console.log(response.data);
            console.log('Editor reference:', edit);
            body.value =
              body.value +
              "<br /><div style='text-align: center;'><img src='" +
              response.data.image +
              "' style='width:100%' /></div><br />";

            console.log('after');
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
  const modifiedString = body.value.replace(/"/g, "'");
  try {
    const response = await axios.post(
      process.env.API_URL + '/graphql/',
      {
        query: `
        mutation {
          createThread(data: { title: \"${title.value}\", body: \"${modifiedString}\", communityId: \"\", contentType:0 }) { id title }
        }
      `,
      },
      {
        headers: {
          Authorization: 'Bearer ' + userStore.access_token,
        },
      }
    );

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
</script>
