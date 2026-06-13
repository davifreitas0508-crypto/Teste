import { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, Globe, ArrowLeftRight, MessageCircle } from 'lucide-react';
import NexoLogo from './NexoLogo';
import { translate, LANGUAGES, type Language } from './translate';

interface Message {
  id: string;
  sender: 'me' | 'them';
  original: string;
  translated: string;
  fromLang: Language;
  toLang: Language;
  status: 'sending' | 'sent' | 'translated';
  timestamp: Date;
}

function LanguageSelector({
  value,
  onChange,
  label,
  disabled = false,
}: {
  value: Language;
  onChange: (lang: Language) => void;
  label: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="text-xs text-purple-400 font-medium mb-1 text-center">{label}</div>
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-purple-100 shadow-sm hover:border-purple-300 hover:shadow-md transition-all duration-200 min-w-[140px] text-sm font-medium text-gray-700 disabled:opacity-60 disabled:cursor-default"
      >
        <span className="text-base">{value.flag}</span>
        <span className="flex-1 text-left truncate">{value.name}</span>
        {!disabled && (
          <ChevronDown
            size={14}
            className={`text-purple-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden min-w-[180px] fade-in">
          <div className="max-h-64 overflow-y-auto scrollbar-thin">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { onChange(lang); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-purple-50 ${
                  lang.code === value.code ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 msg-received">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center">
        <MessageCircle size={12} className="text-white" />
      </div>
      <div className="flex items-center gap-1 bg-white border border-purple-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-purple-400" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-purple-400" />
        <div className="typing-dot w-1.5 h-1.5 rounded-full bg-purple-400" />
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  const isMe = message.sender === 'me';

  return (
    <div className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse msg-sent' : 'msg-received'}`}>
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          isMe
            ? 'bg-gradient-to-br from-violet-500 to-purple-700'
            : 'bg-gradient-to-br from-purple-400 to-violet-600'
        }`}
      >
        {isMe ? (
          <span className="text-white text-xs font-bold">Eu</span>
        ) : (
          <MessageCircle size={12} className="text-white" />
        )}
      </div>

      <div className={`max-w-[72%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Main message bubble (translated content) */}
        <div
          className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isMe
              ? 'bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-br-sm'
              : 'bg-white border border-purple-100 text-gray-800 rounded-bl-sm'
          }`}
        >
          {message.status === 'sending' ? (
            <span className="opacity-60">Traduzindo...</span>
          ) : (
            <span>{message.translated}</span>
          )}

          <div
            className={`flex items-center gap-1 mt-1 text-xs ${
              isMe ? 'text-purple-200 justify-end' : 'text-gray-400 justify-start'
            }`}
          >
            <Globe size={10} />
            <span>{message.toLang.flag} {message.toLang.name}</span>
          </div>
        </div>

        {/* Original text (if different from translated) */}
        {message.status === 'translated' && message.original !== message.translated && (
          <div
            className={`px-3 py-1.5 rounded-xl text-xs text-gray-500 bg-purple-50 border border-purple-100 max-w-full ${
              isMe ? 'text-right' : 'text-left'
            }`}
          >
            <span className="font-medium text-purple-400">{message.fromLang.flag} Original: </span>
            <span className="italic">"{message.original}"</span>
          </div>
        )}

        <span className="text-xs text-gray-400 px-1">
          {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

const PT = LANGUAGES[0];
const EN = LANGUAGES[1];

export default function App() {
  const myLang = PT;
  const [theirLang, setTheirLang] = useState<Language>(EN);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'them',
      original: 'Hello! I can write in my language and you receive it in yours.',
      translated: 'Olá! Posso escrever na minha língua e você recebe na sua.',
      fromLang: EN,
      toLang: PT,
      status: 'translated',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
    },
  ]);
  const [inputMe, setInputMe] = useState('');
  const [inputThem, setInputThem] = useState('');
  const [typingThem, setTypingThem] = useState(false);
  const [activeInput, setActiveInput] = useState<'me' | 'them'>('me');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputMeRef = useRef<HTMLTextAreaElement>(null);
  const inputThemRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingThem]);

  const sendMessage = async (sender: 'me' | 'them', text: string) => {
    if (!text.trim()) return;

    const fromLang = sender === 'me' ? myLang : theirLang;
    const toLang = sender === 'me' ? theirLang : myLang;

    const msg: Message = {
      id: crypto.randomUUID(),
      sender,
      original: text.trim(),
      translated: '',
      fromLang,
      toLang,
      status: 'sending',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, msg]);

    if (sender === 'me') {
      setInputMe('');
    } else {
      setInputThem('');
      setTypingThem(false);
    }

    const translated = await translate(text.trim(), fromLang.code, toLang.code);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id ? { ...m, translated, status: 'translated' } : m
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, sender: 'me' | 'them') => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(sender, sender === 'me' ? inputMe : inputThem);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-violet-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 shadow-sm z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <NexoLogo size={36} />
            <div className="flex items-center gap-3">
              <LanguageSelector value={myLang} onChange={() => {}} label="Minha língua" disabled />
              <div className="pt-5">
                <ArrowLeftRight size={18} className="text-purple-300" />
              </div>
              <LanguageSelector value={theirLang} onChange={(lang) => setTheirLang(lang)} label="Língua deles" />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
            <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
              {myLang.flag} {myLang.name}
            </span>
            <ArrowLeftRight size={11} className="text-purple-300" />
            <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
              {theirLang.flag} {theirLang.name}
            </span>
            <span className="text-gray-400">· Tradução automática ativa</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-purple-100" />
            <span className="text-xs text-purple-300 font-medium">Hoje</span>
            <div className="flex-1 h-px bg-purple-100" />
          </div>

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {typingThem && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input area */}
      <footer className="bg-white border-t border-purple-100 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-3">
          {/* Tabs */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => { setActiveInput('me'); setTimeout(() => inputMeRef.current?.focus(), 50); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeInput === 'me'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-200'
                  : 'bg-purple-50 text-purple-400 hover:bg-purple-100'
              }`}
            >
              <span>{myLang.flag}</span>
              <span>Eu ({myLang.name})</span>
            </button>
            <button
              onClick={() => { setActiveInput('them'); setTimeout(() => inputThemRef.current?.focus(), 50); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeInput === 'them'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md shadow-purple-200'
                  : 'bg-purple-50 text-purple-400 hover:bg-purple-100'
              }`}
            >
              <span>{theirLang.flag}</span>
              <span>Eles ({theirLang.name})</span>
            </button>
          </div>

          {/* My input */}
          {activeInput === 'me' && (
            <div className="flex items-end gap-3 fade-in">
              <div className="flex-1 bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3 focus-within:border-purple-400 focus-within:shadow-md focus-within:shadow-purple-100 transition-all duration-200">
                <textarea
                  ref={inputMeRef}
                  value={inputMe}
                  onChange={(e) => setInputMe(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, 'me')}
                  placeholder={`Escreva em ${myLang.name}…`}
                  rows={1}
                  autoFocus
                  className="w-full bg-transparent text-gray-800 placeholder-purple-300 text-sm resize-none outline-none leading-relaxed"
                  style={{ minHeight: '24px', maxHeight: '120px' }}
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-purple-300">
                    Enviado em {theirLang.flag} {theirLang.name}
                  </span>
                  <span className="text-xs text-purple-300">↵ para enviar</span>
                </div>
              </div>
              <button
                onClick={() => sendMessage('me', inputMe)}
                disabled={!inputMe.trim()}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              >
                <Send size={18} />
              </button>
            </div>
          )}

          {/* Their input */}
          {activeInput === 'them' && (
            <div className="flex items-end gap-3 fade-in">
              <div className="flex-1 bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3 focus-within:border-purple-400 focus-within:shadow-md focus-within:shadow-purple-100 transition-all duration-200">
                <textarea
                  ref={inputThemRef}
                  value={inputThem}
                  onChange={(e) => {
                    setInputThem(e.target.value);
                    setTypingThem(!!e.target.value);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, 'them')}
                  placeholder={`Escreva em ${theirLang.name}…`}
                  rows={1}
                  autoFocus
                  className="w-full bg-transparent text-gray-800 placeholder-purple-300 text-sm resize-none outline-none leading-relaxed"
                  style={{ minHeight: '24px', maxHeight: '120px' }}
                />
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-purple-300">
                    Chegará em {myLang.flag} {myLang.name}
                  </span>
                  <span className="text-xs text-purple-300">↵ para enviar</span>
                </div>
              </div>
              <button
                onClick={() => sendMessage('them', inputThem)}
                disabled={!inputThem.trim()}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              >
                <Send size={18} />
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
