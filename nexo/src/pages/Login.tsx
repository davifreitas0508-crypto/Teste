import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { LANGUAGES } from '../translate';
import NexoLogo from '../NexoLogo';
import { Globe } from 'lucide-react';

export default function Login() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [lang, setLang] = useState('pt');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('E-mail ou senha incorretos.');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Digite seu nome.'); return; }
    setError(''); setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        name: name.trim(),
        email: email.toLowerCase(),
        lang,
      });
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError('E-mail já cadastrado.');
      else if (err.code === 'auth/weak-password') setError('Senha deve ter pelo menos 6 caracteres.');
      else setError('Erro ao criar conta. Tente novamente.');
    }
    setLoading(false);
  };

  const selectedLang = LANGUAGES.find(l => l.code === lang)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-white to-purple-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <NexoLogo size={56} />
          <p className="text-gray-500 text-sm mt-2">Conecte-se além das fronteiras</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-purple-100 p-6">
          <div className="flex gap-1 bg-purple-50 rounded-2xl p-1 mb-6">
            {(['login', 'register'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  tab === t
                    ? 'bg-white shadow-sm text-purple-700'
                    : 'text-gray-500 hover:text-purple-500'
                }`}
              >
                {t === 'login' ? 'Entrar' : 'Criar conta'}
              </button>
            ))}
          </div>

          <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-4">
            {tab === 'register' && (
              <div>
                <label className="text-xs font-medium text-purple-500 mb-1 block">Seu nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Como quer ser chamado?"
                  className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-purple-500 mb-1 block">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-purple-500 mb-1 block">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2.5 rounded-xl border border-purple-200 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                required
              />
            </div>

            {tab === 'register' && (
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
            )}

            {error && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium text-sm shadow-md shadow-purple-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-1"
            >
              {loading ? 'Aguarde...' : tab === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
