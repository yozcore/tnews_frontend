export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Thread {
  id: number;
  title: string;
  contentType: string;
  commentCount: number;
  timeSinceCreated: string;
  user: {
    id: string;
    username: string;
  };
  community: {
    id: string;
    name: string;
    slug: string;
  };
  url: {
    value: string;
    netloc: string;
  };
  thumbnailImage: {
    url: string;
  };
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  biography: string;
  bioImage: string;
  avatar_image: string;
  notificationCount: number;
  commentCount: number;
  threadCount: number;
  communityCount: number;
  point: number;
  followerCount: number;
  followeeCount: number;
  invitationSlot: number;
  isPrivate: boolean;
  hasVerified: boolean;
  isFirstLogin: boolean;
  stopNotification: boolean;
  deactivatedAt: string;
}
