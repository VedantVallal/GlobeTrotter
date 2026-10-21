'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { mockUser } from '@/lib/data/mockUsers';

const AuthContext = createContext({
  user: null,
  loading: true,
  setUser: () => {},
  updateAvatar: async () => {},
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
        // Fallback default for prototype if not logged in
        setUser(storedAvatar ? { ...mockUser, avatar: storedAvatar } : mockUser);
      }
    } catch (e) {
      setUser(mockUser);
    }

    // 2. Listen to real Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        let profileName = fbUser.displayName;
        let avatarUrl = fbUser.photoURL;

        // Try reading Firestore user doc if available
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.name) profileName = data.name;
            if (data.avatar) avatarUrl = data.avatar;
          }
        } catch (err) {
          // Firestore optional/offline
        }

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
        // Check if demo user was explicitly logged in
        const stored = localStorage.getItem('gt_active_user');
        const storedAvatar = localStorage.getItem('gt_user_avatar');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (storedAvatar) parsed.avatar = storedAvatar;
          if (!parsed.isFirebaseUser) {
            setUser(parsed);
          } else {
            setUser(storedAvatar ? { ...mockUser, avatar: storedAvatar } : mockUser);
            localStorage.removeItem('gt_active_user');
          }
        } else {
          setUser(storedAvatar ? { ...mockUser, avatar: storedAvatar } : mockUser);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateActiveUser = (newUser) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('gt_active_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('gt_active_user');
    }
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

    // Direct Firebase Auth synchronization
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { photoURL: newAvatarUrl });
      } catch (e) {
        console.warn('Firebase Auth photoURL update error', e);
      }
    }

    // Direct Firestore database synchronization
    const userId = user?.id || auth.currentUser?.uid;
    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId), { avatar: newAvatarUrl }, { merge: true });
      } catch (e) {
        console.warn('Firestore database avatar save error', e);
      }
    }

    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser: updateActiveUser, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
