import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
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
    let unsubProfile: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubProfile) { unsubProfile(); unsubProfile = null; }

      if (!user) {
        setState(null);
        return;
      }

      // Real-time listener on user profile — updates instantly when lang/name changes
      unsubProfile = onSnapshot(doc(db, 'users', user.uid), (snap) => {
        if (snap.exists()) {
          setState({ uid: user.uid, email: user.email!, profile: snap.data() as UserProfile });
        } else {
          setState(null);
        }
      });
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
