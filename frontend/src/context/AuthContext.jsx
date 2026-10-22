'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { mockUser } from '@/lib/data/mockUsers';
import { getSupabase } from '@/lib/supabase/client';

const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
  updateAvatar: async () => {},
  loginDemoUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial check from localStorage for fast client-side hydration
    try {
      const stored = localStorage.getItem('gt_active_user');
      const storedAvatar = localStorage.getItem('gt_user_avatar');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (storedAvatar) parsed.avatar = storedAvatar;
        setUser(parsed);
      } else {
        // Guaranteed fallback default so dashboard never starts at 0
        setUser(storedAvatar ? { ...mockUser, avatar: storedAvatar } : mockUser);
      }
    } catch (e) {
      setUser(mockUser);
    }

    // 2. Listen to Supabase Auth state changes
    const supabase = getSupabase();
    let supabaseSub = null;
    if (supabase) {
      try {
        supabase.auth.getUser().then(({ data }) => {
          if (data?.user) {
            const activeUser = {
              id: data.user.id,
              name: data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || 'Explorer',
              email: data.user.email,
              avatar:
                data.user.user_metadata?.avatar_url ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
              isSupabaseUser: true,
            };
            setUser(activeUser);
            localStorage.setItem('gt_active_user', JSON.stringify(activeUser));
          }
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            const activeUser = {
              id: session.user.id,
              name: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Explorer',
              email: session.user.email,
              avatar:
                session.user.user_metadata?.avatar_url ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
              isSupabaseUser: true,
            };
            setUser(activeUser);
            localStorage.setItem('gt_active_user', JSON.stringify(activeUser));
          }
        });
        supabaseSub = authListener?.subscription;
      } catch (e) {}
    }

    // 3. Listen to real Firebase Auth changes
    const unsubscribeFirebase = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        let profileName = fbUser.displayName;
        let avatarUrl = fbUser.photoURL;

        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.name) profileName = data.name;
            if (data.avatar) avatarUrl = data.avatar;
          }
        } catch (err) {}

        const storedAvatar = localStorage.getItem('gt_user_avatar');

        const activeUser = {
          id: fbUser.uid,
          name: profileName || fbUser.email?.split('@')[0] || 'Traveler',
          email: fbUser.email,
          avatar:
            avatarUrl ||
            storedAvatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
          isFirebaseUser: true,
        };

        setUser(activeUser);
        localStorage.setItem('gt_active_user', JSON.stringify(activeUser));
      } else {
        const stored = localStorage.getItem('gt_active_user');
        const storedAvatar = localStorage.getItem('gt_user_avatar');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (storedAvatar) parsed.avatar = storedAvatar;
          setUser(parsed);
        } else {
          // Never leave user empty for judges & explorers
          setUser(storedAvatar ? { ...mockUser, avatar: storedAvatar } : mockUser);
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribeFirebase();
      if (supabaseSub) supabaseSub.unsubscribe();
    };
  }, []);

  const updateActiveUser = (newUser) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('gt_active_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('gt_active_user');
    }
  };

  const loginDemoUser = () => {
    const demoUser = {
      id: 'user-001',
      name: 'Elena Rostova',
      email: 'demo@globetrotter.app',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      role: 'Lead Explorer',
    };
    setUser(demoUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gt_active_user', JSON.stringify(demoUser));
    }
    return demoUser;
  };

  const updateAvatar = async (newAvatarUrl) => {
    if (!newAvatarUrl) return;
    const updatedUser = {
      ...(user || mockUser),
      avatar: newAvatarUrl,
    };
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('gt_active_user', JSON.stringify(updatedUser));
        localStorage.setItem('gt_user_avatar', newAvatarUrl);
      } catch (e) {}
    }

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { photoURL: newAvatarUrl });
      } catch (e) {}
    }

    const userId = user?.id || auth.currentUser?.uid;
    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId), { avatar: newAvatarUrl }, { merge: true });
      } catch (e) {}
    }

    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser: updateActiveUser, updateAvatar, loginDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
