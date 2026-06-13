import { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Chat from './pages/Chat';
import type { Conversation, UserProfile } from './types';

function NexoApp() {
  const auth = useAuth();
  const [activeChat, setActiveChat] = useState<{ conv: Conversation; other: UserProfile } | null>(null);

  if (auth === undefined) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
          <span className="text-sm text-purple-400 font-medium">Carregando…</span>
        </div>
      </div>
    );
  }

  if (!auth) return <Login />;

  if (activeChat) {
    return (
      <Chat
        me={auth}
        other={activeChat.other}
        conv={activeChat.conv}
        onBack={() => setActiveChat(null)}
      />
    );
  }

  return (
    <Home
      me={auth}
      onOpenChat={(conv, other) => setActiveChat({ conv, other })}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NexoApp />
    </AuthProvider>
  );
}
