export interface ReplyData {
  id: string;
  username: string;
  replyingTo?: string;
  text: string;
  timeAgo: string;
  likes: string;
  avatarUrl: string | null;
  isLikedByCreator: boolean;
  isAuthor?: boolean;
  isVerified?: boolean;
}

export interface CommentData {
  username: string;
  commentText: string;
  timeAgo: string;
  likes: string;
  avatarUrl: string | null;
  isVerified: boolean;
  isAuthor: boolean;
  isLikedByCreator: boolean;
  replies: ReplyData[];
}

export interface ExportSettings {
  format: 'png' | 'svg';
  width?: number | string;
  height?: number | string;
  isDark: boolean;
  isTransparent: boolean;
  showWatermark: boolean;
  customSize?: boolean;
}