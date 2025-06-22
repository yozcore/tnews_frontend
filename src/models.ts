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
  body: string;
  user: User;
  humanized_created_at: string;
  humanized_updated_at: string;
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
  avatarImage: string;
  avatar_image: string;
  notification_count: number;
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

export interface Community {
  id: number;
  name: string;
  slug: string;
  main_image: string;
  explanation: string;
  thumbnail_image: string;
  humanized_updated_at: string;
}

export interface MyCommunity {
  community: Community;
  position: number;
  is_followed: boolean;
  notification_count: number;
  created_at: string;
  updated_at: string;
  user: string;
  humanized_updated_at: string;
}

export interface Notification {
  created_at: string;
  humanized_created_at: string;
  verb: string;
}
