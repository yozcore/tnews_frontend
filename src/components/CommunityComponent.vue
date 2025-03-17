<template>
  <q-item
    clickable
    @click.prevent="
      $emit('trigger');
      $router.push('/' + community.slug);
    "
  >
    <q-item-section v-if="community.thumbnailImage" avatar>
      <q-img
        :src="community?.thumbnailImage.url"
        style="width: 32px; height: 32px; border-radius: 50%"
      />
    </q-item-section>

    <q-item-section>
      <q-item-label caption>{{ community.name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineOptions({
  name: 'CommunityComponent',
});

interface Props {
  community: any;
}

withDefaults(defineProps<Props>(), {
  community: () => [],
});
</script>
