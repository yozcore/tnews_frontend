import { Client, cacheExchange, fetchExchange, provideClient } from '@urql/vue';

const client = new Client({
  url: process.env.API_URL + '/graphql/',
  exchanges: [cacheExchange, fetchExchange],
  //fetchOptions: () => {
  // const token = getToken();
  // return {
  //   headers: { authorization: token ? `Bearer ${token}` : '' },
  // };
  //},
});
provideClient(client);

export { client };
