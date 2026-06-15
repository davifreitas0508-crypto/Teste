import { useState, useEffect, useRef, useCallback } from 'react';
import {
  collection, addDoc, onSnapshot, query, orderBy,
  doc, updateDoc, serverTimestamp, deleteField,
} from 'firebase/firestore';
import { db } from '../firebase';
import { translate, LANGUAGES } from '../translate';
import type { AuthUser } from '../AuthContext';
import type { Conversation, Message, UserProfile } from '../types';
import NexoLogo from '../NexoLogo';
import Avatar from '../Avatar';
import { Send, ArrowLeft, Globe, Mic, MicOff } from 'lucide-react';

// Language code map for SpeechRecognition
const SPEECH_LANG_MAP: Record<string, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  it: 'it-IT',
  ja: 'ja-JP',
  zh: 'zh-CN',
  ko: 'ko-KR',
  ru: 'ru-RU',
  ar: 'ar-SA',
  hi: 'hi-IN',
};

interface ChatProps {
  me: AuthUser;
  other: UserProfile;
  conv: Conversation;
  onBack: () => void;
}

function TypingIndicator({ profile }: { profile: UserProfile }) {
  return (
    <div className="flex items-end gap-2 msg-received">
      <Avatar profile={profile} size={28} />
      <div className="flex items-center gap-1 bg-white border border-purple-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-purple-400" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-purple-400" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-purple-400" />
      </div>
      <span className="text-xs text-gray-400 pb-1">Digitando...</span>
    </div>
  );
}

interface RenderedMessage extends Message {
  displayText: string;
}

export default function Chat({ me, other, conv, onBack }: ChatProps) {
  const [messages, setMessages] = useState<RenderedMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioError, setAudioError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<any>(null);

  const myLang = me.profile.lang;
  const otherLang = other.lang;
  const myLangObj = LANGUAGES.find(l => l.code === myLang) ?? LANGUAGES[0];
  const otherLangObj = LANGUAGES.find(l => l.code === otherLang) ?? LANGUAGES[1];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherTyping]);

  // Listen to messages
  useEffect(() => {
    const q = query(
      collection(db, 'conversations', conv.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, async snap => {
      const rendered: RenderedMessage[] = [];
      const updates: Promise<void>[] = [];

      for (const docSnap of snap.docs) {
        const msg = { id: docSnap.id, ...docSnap.data() } as Message;
        const isMe = msg.senderId === me.uid;
        const targetLang = isMe ? otherLang : myLang;
        let displayText = msg.translations?.[targetLang];

        if (!displayText) {
          const translated = await translate(msg.original, msg.fromLang, targetLang);
          displayText = translated;
          if (translated !== msg.original) {
            updates.push(
              updateDoc(doc(db, 'conversations', conv.id, 'messages', msg.id), {
                [`translations.${targetLang}`]: translated,
              })
            );
          }
        }

        rendered.push({ ...msg, displayText: displayText || msg.original });
      }

      await Promise.all(updates);
      setMessages(rendered);
    });
  }, [conv.id, me.uid, myLang, otherLang]);

  // Listen to conversation doc for typing indicator
  useEffect(() => {
    const convRef = doc(db, 'conversations', conv.id);
    return onSnapshot(convRef, snap => {
      if (!snap.exists()) return;
      const data = snap.data();
      const typingMap = data?.typing as Record<string, { toDate(): Date } | null> | undefined;
      if (!typingMap) {
        setOtherTyping(false);
        return;
      }
      const otherTs = typingMap[other.uid];
      if (!otherTs) {
        setOtherTyping(false);
        return;
      }
      const ts = otherTs.toDate();
      const now = Date.now();
      const diffMs = now - ts.getTime();
      setOtherTyping(diffMs < 5000);
    });
  }, [conv.id, other.uid]);

  // Cleanup typing status and recognition on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      // Clear our typing indicator on unmount
      updateDoc(doc(db, 'conversations', conv.id), {
        [`typing.${me.uid}`]: deleteField(),
      }).catch(() => {});
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [conv.id, me.uid]);

  const updateTyping = useCallback(() => {
    updateDoc(doc(db, 'conversations', conv.id), {
      [`typing.${me.uid}`]: serverTimestamp(),
    }).catch(() => {});

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      updateDoc(doc(db, 'conversations', conv.id), {
        [`typing.${me.uid}`]: deleteField(),
      }).catch(() => {});
    }, 3000);
  }, [conv.id, me.uid]);

  const sendMessage = async (text: string, type: 'text' | 'audio' = 'text') => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setInput('');

    // Clear typing indicator immediately on send
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    updateDoc(doc(db, 'conversations', conv.id), {
      [`typing.${me.uid}`]: deleteField(),
    }).catch(() => {});

    const convRef = doc(db, 'conversations', conv.id);
    const msgRef = collection(db, 'conversations', conv.id, 'messages');

    await addDoc(msgRef, {
      senderId: me.uid,
      original: trimmed,
      fromLang: myLang,
      translations: {},
      createdAt: serverTimestamp(),
      type,
    });

    await updateDoc(convRef, {
      lastMessage: type === 'audio' ? `🎤 ${trimmed}` : trimmed,
      lastMessageAt: serverTimestamp(),
      [`participantProfiles.${me.uid}`]: me.profile,
      [`participantProfiles.${other.uid}`]: other,
    });

    setSending(false);
  };

  const handleTextSend = () => sendMessage(input, 'text');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    updateTyping();
  };

  const toggleRecording = () => {
    setAudioError('');

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ??
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setAudioError('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.lang = SPEECH_LANG_MAP[myLang] ?? 'pt-BR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        sendMessage(transcript, 'audio');
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('SpeechRecognition error', event.error);
      if (event.error !== 'aborted') {
        setAudioError('Erro ao reconhecer voz. Tente novamente.');
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <header className="bg-white border-b border-purple-100 shadow-sm z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-purple-400 hover:bg-purple-50 transition-all"
          >
            <ArrowLeft size={20} />
          </button>

          <Avatar profile={other} size={40} />

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm leading-tight">{other.name}</p>
            <div className="flex items-center gap-1">
              <Globe size={10} className="text-purple-400" />
              <span className="text-xs text-purple-400">
                {otherLangObj.flag} {otherLangObj.name}
              </span>
            </div>
          </div>

          <NexoLogo size={28} showText={false} />
        </div>

        <div className="max-w-3xl mx-auto px-4 pb-2 flex items-center justify-center gap-2 text-xs text-gray-500">
          <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
            {myLangObj.flag} {myLangObj.name}
          </span>
          <span className="text-purple-300">⇆</span>
          <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
            {otherLangObj.flag} {otherLangObj.name}
          </span>
          <span className="text-gray-400">· Tradução automática</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {messages.length === 0 && (
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-purple-100" />
              <span className="text-xs text-purple-300 font-medium">Início da conversa</span>
              <div className="flex-1 h-px bg-purple-100" />
            </div>
          )}

          {messages.map(msg => {
            const isMe = msg.senderId === me.uid;
            const senderLang = isMe ? myLangObj : otherLangObj;
            const targetLang = isMe ? otherLangObj : myLangObj;
            const time = msg.createdAt?.toDate?.();
            const isAudio = msg.type === 'audio';

            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse msg-sent' : 'msg-received'}`}>
                {isMe ? (
                  <Avatar profile={me.profile} size={28} />
                ) : (
                  <Avatar profile={other} size={28} />
                )}

                <div className={`max-w-[72%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isMe
                      ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-br-sm'
                      : 'bg-white border border-purple-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <p>
                      {isAudio && <span className="mr-1">🎤</span>}
                      {msg.displayText}
                    </p>
                    <div className={`flex items-center gap-1 mt-1 text-xs ${isMe ? 'text-purple-200 justify-end' : 'text-gray-400'}`}>
                      <Globe size={10} />
                      <span>{targetLang.flag} {targetLang.name}</span>
                    </div>
                  </div>

                  {msg.original !== msg.displayText && (
                    <div className={`px-3 py-1.5 rounded-xl text-xs text-gray-500 bg-purple-50 border border-purple-100 ${isMe ? 'text-right' : 'text-left'}`}>
                      <span className="font-medium text-purple-400">{senderLang.flag} Original: </span>
                      <span className="italic">"{msg.original}"</span>
                    </div>
                  )}

                  {time && (
                    <span className="text-xs text-gray-400 px-1">
                      {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {otherTyping && <TypingIndicator profile={other} />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white border-t border-purple-100 shadow-lg">
        {audioError && (
          <div className="max-w-3xl mx-auto px-4 pt-2">
            <p className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-xl">{audioError}</p>
          </div>
        )}
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-end gap-2">
          <div className="flex-1 bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3 focus-within:border-purple-400 focus-within:shadow-md focus-within:shadow-purple-100 transition-all duration-200">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Escreva em ${myLangObj.name}…`}
              rows={1}
              autoFocus
              className="w-full bg-transparent text-gray-800 placeholder-purple-300 text-sm resize-none outline-none leading-relaxed"
              style={{ minHeight: '24px', maxHeight: '120px' }}
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-purple-300">
                Enviado em {otherLangObj.flag} {otherLangObj.name}
              </span>
              <span className="text-xs text-purple-300">↵ para enviar</span>
            </div>
          </div>

          {/* Mic button */}
          <button
            onClick={toggleRecording}
            title={isRecording ? 'Parar gravação' : 'Gravar mensagem de voz'}
            className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md transition-all duration-200 ${
              isRecording
                ? 'bg-red-500 text-white shadow-red-200 animate-pulse'
                : 'bg-purple-100 text-purple-500 hover:bg-purple-200'
            }`}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Send button */}
          <button
            onClick={handleTextSend}
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
