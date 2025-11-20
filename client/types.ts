import React from 'react';

export enum Page {
  Landing = 'LANDING',
  MainApp = 'MAIN_APP',
}

export type InputMode = 'video' | 'upload' | 'text';

export type RecordingStatus = 'idle' | 'countdown' | 'recording' | 'preview';

// FIX: Add User interface to fix import error in AuthPage and FriendsSidebar
export interface User {
  name: string;
  email: string;
  avatarUrl: string;
}

// FIX: Add Friend interface to fix import error in FriendsSidebar and ChatColumn
export interface Friend {
  name: string;
  email: string;
  avatarUrl: string;
  isOnline: boolean;
  lastMessage: string;
}

// FIX: Add ChatMessage interface to fix import error in ChatColumn
export interface ChatMessage {
  id: number | string;
  sender: 'User (AI)' | 'Friend' | 'Summarize Conversation';
  text: string;
  timestamp: string;
}
