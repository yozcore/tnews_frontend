<template>
  <router-view />
</template>

<script setup lang="ts">
defineOptions({
  name: 'App',
});
import { Client, provideClient, cacheExchange, fetchExchange } from '@urql/vue';
const client = new Client({
  url: process.env.API_URL + '/graphql/',
  exchanges: [cacheExchange, fetchExchange],
});

provideClient(client);
</script>
