import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, setDoc, serverTimestamp, getDocs, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { LANGUAGES } from '../translate';
import NexoLogo from '../NexoLogo';
import type { AuthUser } from '../AuthContext';
import type { Conversation, UserProfile } from '../types';
import { LogOut, Plus, Search, MessageCircle, Globe, Settings, X, Check } from 'lucide-react';

interface HomeProps {
  me: AuthUser;
  onOpenChat: (conv: Conversation, other: UserProfile) => void;
}

function ProfileModal({ me, onClose }: { me: AuthUser; onClose: () => void }) {
  const [name, setName] = useState(me.profile.name);
  const [lang, setLang] = useState(me.profile.lang);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name.trim()) { setError('Digite um nome.'); return; }
    setSaving(true); setError('');
    try {
      await updateDoc(doc(db, 'users', me.uid), {
        name: name.trim(),
        lang,
      });
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 800);
    } catch {
      setError('Erro ao salvar. Tente novamente.');
    }
    setSaving(false);
  };

  const selectedLang = LANGUAGES.find(l => l.code === lang)!;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-800 text-lg">Configurações do perfil</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Avatar */}
          <div className="flex items-center gap-3 mb-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{name[0]?.toUpperCase() || '?'}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">{me.email}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-purple-500 mb-1 block">Nome</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-purple-500 mb-1 block">
              <Globe size={11} className="inline mr-1" />
              Minha língua
            </label>
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all bg-white"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Você receberá todas as mensagens em {selectedLang.flag} {selectedLang.name}
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
          )}

          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium text-sm shadow-md shadow-purple-200 hover:shadow-lg transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {saved ? (
              <><Check size={16} /> Salvo!</>
            ) : saving ? (
              'Salvando...'
            ) : (
              'Salvar alterações'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home({ me, onOpenChat }: HomeProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', me.uid)
    );
    return onSnapshot(q, snap => {
      const convs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Conversation));
      convs.sort((a, b) => {
        const ta = a.lastMessageAt?.toDate?.()?.getTime() ?? 0;
        const tb = b.lastMessageAt?.toDate?.()?.getTime() ?? 0;
        return tb - ta;
      });
      setConversations(convs);
    });
  }, [me.uid]);

  const startConversation = async () => {
    const email = searchEmail.trim().toLowerCase();
    if (!email) return;
    if (email === me.email.toLowerCase()) {
      setSearchError('Não é possível conversar consigo mesmo.');
      return;
    }
    setSearchError(''); setSearching(true);

    const usersSnap = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
    if (usersSnap.empty) {
      setSearchError('Usuário não encontrado. Verifique o e-mail.');
      setSearching(false);
      return;
    }

    const otherProfile = usersSnap.docs[0].data() as UserProfile;
    const convId = [me.uid, otherProfile.uid].sort().join('_');
    const convRef = doc(db, 'conversations', convId);
    const convSnap = await getDoc(convRef);

    if (!convSnap.exists()) {
      await setDoc(convRef, {
        participants: [me.uid, otherProfile.uid],
        participantProfiles: {
          [me.uid]: me.profile,
          [otherProfile.uid]: otherProfile,
        },
        lastMessage: '',
        lastMessageAt: serverTimestamp(),
      });
    }

    const conv: Conversation = convSnap.exists()
      ? { id: convId, ...convSnap.data() } as Conversation
      : {
          id: convId,
          participants: [me.uid, otherProfile.uid],
          participantProfiles: { [me.uid]: me.profile, [otherProfile.uid]: otherProfile },
          lastMessage: '',
          lastMessageAt: null,
        };

    setShowNew(false);
    setSearchEmail('');
    setSearching(false);
    onOpenChat(conv, otherProfile);
  };

  const myLang = LANGUAGES.find(l => l.code === me.profile.lang) ?? LANGUAGES[0];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-violet-50 via-white to-purple-50">
      <header className="bg-white border-b border-purple-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <NexoLogo size={32} />
          <div className="flex items-center gap-2">
            <div className="text-right mr-1">
              <p className="text-sm font-semibold text-gray-800">{me.profile.name}</p>
              <p className="text-xs text-purple-400">{myLang.flag} {myLang.name}</p>
            </div>
            <button
              onClick={() => setShowProfile(true)}
              title="Configurações do perfil"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-purple-500 hover:bg-purple-50 transition-all"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => signOut(auth)}
              title="Sair"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-50 transition-all"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-4 flex flex-col gap-2">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
                <MessageCircle size={28} className="text-purple-400" />
              </div>
              <p className="text-gray-600 font-medium">Nenhuma conversa ainda</p>
              <p className="text-gray-400 text-sm mt-1">Toque no + para iniciar uma nova conversa</p>
            </div>
          ) : (
            conversations.map(conv => {
              const otherId = conv.participants.find(p => p !== me.uid)!;
              const other = conv.participantProfiles?.[otherId];
              if (!other) return null;
              const otherLang = LANGUAGES.find(l => l.code === other.lang) ?? LANGUAGES[1];
              const time = conv.lastMessageAt?.toDate?.();
              return (
                <button
                  key={conv.id}
                  onClick={() => onOpenChat(conv, other)}
                  className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 border border-purple-50 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-200 text-left fade-in"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{other.name[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-800 text-sm">{other.name}</p>
                      {time && (
                        <span className="text-xs text-gray-400">
                          {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Globe size={10} className="text-purple-400 flex-shrink-0" />
                      <span className="text-xs text-purple-400">{otherLang.flag} {otherLang.name}</span>
                    </div>
                    {conv.lastMessage && (
                      <p className="text-xs text-gray-500 truncate mt-1">{conv.lastMessage}</p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </main>

      {showProfile && <ProfileModal me={me} onClose={() => setShowProfile(false)} />}

      {showNew && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl fade-in">
            <h2 className="font-bold text-gray-800 text-lg mb-1">Nova conversa</h2>
            <p className="text-sm text-gray-500 mb-4">Digite o e-mail da pessoa com quem deseja conversar</p>

            <div className="flex gap-2">
              <input
                type="email"
                value={searchEmail}
                onChange={e => { setSearchEmail(e.target.value); setSearchError(''); }}
                onKeyDown={e => e.key === 'Enter' && startConversation()}
                placeholder="email@exemplo.com"
                autoFocus
                className="flex-1 px-4 py-2.5 rounded-xl border border-purple-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
              />
              <button
                onClick={startConversation}
                disabled={searching || !searchEmail.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium disabled:opacity-50 transition-all"
              >
                {searching ? '...' : <Search size={16} />}
              </button>
            </div>

            {searchError && (
              <p className="text-xs text-red-500 mt-2 bg-red-50 px-3 py-2 rounded-xl">{searchError}</p>
            )}

            <button
              onClick={() => { setShowNew(false); setSearchEmail(''); setSearchError(''); }}
              className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowNew(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 text-white flex items-center justify-center shadow-xl shadow-purple-300 hover:scale-110 transition-all duration-200"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
