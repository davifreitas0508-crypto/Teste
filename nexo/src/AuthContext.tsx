import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { UserProfile } from './types';

export interface AuthUser {
  uid: string;
  email: string;
  profile: UserProfile;
}

// undefined = loading, null = not logged in, AuthUser = logged in
const AuthContext = createContext<AuthUser | null | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) { setState(null); return; }
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        setState({ uid: user.uid, email: user.email!, profile: snap.data() as UserProfile });
      } else {
        setState(null);
      }
    });
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
