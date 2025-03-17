import { gql } from '@urql/vue';
type ThreadFilterInput = {
  userId: String;
  category: String;
};

const GET_THREADS = gql`
  query getThreads($limit: Int!, $filter: ThreadFilterInput) {
    getThreads(limit: $limit, order: { id: "DESC" }, filter: $filter) {
      pageInfo {
        endCursor
        hasNextPage
      }
      threads {
        id
        title
        contentType
        commentCount
        timeSinceCreated
        user {
          id
          username
        }
        url {
          value
          netloc
        }
        thumbnailImage {
          url
        }
      }
    }
  }
`;

const GET_THREAD = gql`
  query getThread($id: String!) {
    getThread(id: $id) {
      id
      title
      body
      contentType
      commentCount
      timeSinceCreated
      createdAt
      user {
        id
        username
        biography
        avatarImage {
          url
        }
      }
      url {
        value
        netloc
      }
      thumbnailImage {
        url
      }
    }
  }
`;

const GET_COMMUNITIES = gql`
  query getCommunities($limit: Int!) {
    getCommunities(limit: $limit, order: { id: "DESC" }) {
      pageInfo {
        endCursor
        hasNextPage
      }
      communities {
        id
        name
        slug
        createdAt
        timeSinceCreated
        explanation
        thumbnailImage {
          name
          url
          name
          size
          height
          width
        }
        user {
          id
          username
          avatarImage {
            url
          }
        }
      }
    }
  }
`;

export { GET_THREADS, GET_THREAD, GET_COMMUNITIES };
