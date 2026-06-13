export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  lang: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantProfiles: Record<string, UserProfile>;
  lastMessage: string;
  lastMessageAt: { toDate(): Date } | null;
}

export interface Message {
  id: string;
  senderId: string;
  original: string;
  fromLang: string;
  translations: Record<string, string>;
  createdAt: { toDate(): Date } | null;
}
