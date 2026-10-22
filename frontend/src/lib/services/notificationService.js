// Notification & Collaboration Invitation Service
import { mockUser } from '@/lib/data/mockUsers';

const BASE_REGISTERED_USERS = [
  {
    id: 'usr-101',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop',
    role: 'Traveler',
  },
  {
    id: 'usr-102',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    role: 'Traveler',
  },
  {
    id: 'usr-103',
    name: 'Marcus Vance',
    email: 'marcus.v@globetrotter.io',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop',
    role: 'Traveler',
  },
  {
    id: 'usr-104',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@travelmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    role: 'Traveler',
  },
  {
    id: 'usr-105',
    name: 'Elena Rostova',
    email: 'elena.rostova@wanderlust.net',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    role: 'Traveler',
  },
  {
    id: 'usr-106',
    name: 'Rohan Verma',
    email: 'rohan.verma@techmail.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    role: 'Traveler',
  },
  {
    id: 'usr-107',
    name: 'Sarah Jenkins',
    email: 's.jenkins@explore.co.uk',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop',
    role: 'Traveler',
  },
  {
    id: 'usr-108',
    name: 'Devendra Patil',
    email: 'dev.patil@voyage.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    role: 'Traveler',
  },
  {
    id: 'usr-109',
    name: 'Chloe Dubois',
    email: 'chloe.dubois@parisien.fr',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop',
    role: 'Traveler',
  },
  {
    id: 'usr-110',
    name: 'Kenji Takahashi',
    email: 'kenji.t@tokyotrip.jp',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
    role: 'Traveler',
  },
  {
    id: 'usr-demo',
    name: 'Alex Rivera',
    email: 'demo@globetrotter.app',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    role: 'Traveler',
  },
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'trip',
    title: 'Trip Starting Soon!',
    desc: 'Golden Goa Escape starts in 10 days! All stops, hotel coordinates, and beach itineraries are ready for departure.',
    time: '15 mins ago',
    unread: true,
    href: '/itinerary/trip-001',
    actionText: 'View Day-by-Day Plan',
  },
  {
    id: 'notif-2',
    category: 'ai',
    title: 'AI Route Pacing Optimized',
    desc: 'GlobeTrotter AI analyzed transit times between Paris and Santorini and recommends departing via evening direct flight to save 4 hours.',
    time: '2 hours ago',
    unread: true,
    href: '/playground/trip-002',
    actionText: 'Inspect Canvas Nodes',
  },
];

export const notificationService = {
  // ── 1. REGISTER USER LOCALLY IN CACHE ─────────────────────────────────────
  registerUserLocally(user) {
    if (typeof window === 'undefined' || !user?.email) return;
    try {
      const raw = localStorage.getItem('gt_registered_users');
      let list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];
      const norm = user.email.trim().toLowerCase();
      const idx = list.findIndex((u) => u.email?.toLowerCase() === norm);
      const userItem = {
        id: user.id || `usr-${Date.now()}`,
        name: user.name || user.email.split('@')[0],
        email: norm,
        avatar:
          user.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        role: user.role || 'Traveler',
        status: 'Active',
      };
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...userItem };
      } else {
        list.push(userItem);
      }
      localStorage.setItem('gt_registered_users', JSON.stringify(list));
    } catch (e) {}
  },

  // ── 2. GET ALL REGISTERED USERS ───────────────────────────────────────────
  getRegisteredUsers() {
    let users = [...BASE_REGISTERED_USERS];

    if (typeof window !== 'undefined') {
      try {
        // Read registered users saved during signup/signin
        const stored = localStorage.getItem('gt_registered_users');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((u) => {
              if (u?.email && !users.some((x) => x.email.toLowerCase() === u.email.toLowerCase())) {
                users.push(u);
              }
            });
          }
        }

        // Include current active user if logged in
        const active = localStorage.getItem('gt_active_user');
        if (active) {
          const parsed = JSON.parse(active);
          if (parsed?.email && !users.some((x) => x.email.toLowerCase() === parsed.email.toLowerCase())) {
            users.push(parsed);
          }
        }

        // Include admin users if any exist in admin store
        const adminStored = localStorage.getItem('gt_admin_users');
        if (adminStored) {
          const parsed = JSON.parse(adminStored);
          if (Array.isArray(parsed)) {
            parsed.forEach((u) => {
              if (u?.email && !users.some((x) => x.email.toLowerCase() === u.email.toLowerCase())) {
                users.push(u);
              }
            });
          }
        }
      } catch (e) {}
    }

    return users;
  },

  // ── 3. ASYNC FIND USER BY EMAIL (WITH FIRESTORE & AUTO-FALLBACK) ─────────
  async findUserByEmail(email) {
    if (!email) return null;
    const norm = email.trim().toLowerCase();

    // 1. Check local registered users list
    const all = this.getRegisteredUsers();
    const foundLocal = all.find((u) => u.email.toLowerCase() === norm);
    if (foundLocal) return foundLocal;

    // 2. Query Firestore 'users' collection if connected
    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase/config');
      if (db) {
        const q = query(collection(db, 'users'), where('email', '==', norm));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const d = snap.docs[0].data();
          const userObj = {
            id: d.id || snap.docs[0].id,
            name: d.name || d.displayName || norm.split('@')[0],
            email: d.email || norm,
            avatar:
              d.avatar ||
              d.photoURL ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
            role: 'Traveler',
          };
          this.registerUserLocally(userObj);
          return userObj;
        }
      }
    } catch (e) {}

    // 3. Fallback: If it's a valid email format, auto-register as an invited traveler!
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(norm)) {
      const autoUser = {
        id: `usr-${Date.now()}`,
        name: norm.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        email: norm,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        role: 'Traveler',
        status: 'Active',
      };
      this.registerUserLocally(autoUser);
      return autoUser;
    }

    return null;
  },

  // ── 4. SEND REAL COLLABORATION TRIP INVITATION ────────────────────────────
  async sendTripInvite({ toEmail, senderName, senderEmail, tripId, tripTitle, role = 'Editor' }) {
    if (!toEmail) throw new Error('Recipient email is required.');

    const targetUser = await this.findUserByEmail(toEmail);
    if (!targetUser) {
      throw new Error(`Please enter a valid email address.`);
    }

    const normRecipient = targetUser.email.trim().toLowerCase();

    const notif = {
      id: `notif-invite-${Date.now()}`,
      category: 'collaboration',
      type: 'invite',
      title: 'New Trip Collaboration Invite! ✈️',
      desc: `${senderName || 'A fellow traveler'} invited you to collaborate on "${tripTitle}" as an ${role}.`,
      time: 'Just now',
      unread: true,
      href: `/playground/${tripId}`,
      actionText: 'Open Trip Canvas',
      tripId,
      tripTitle,
      role,
      senderName: senderName || 'A fellow traveler',
      senderEmail: senderEmail || 'traveler@globetrotter.io',
      recipientEmail: normRecipient,
      status: 'pending', // 'pending' | 'accepted' | 'declined'
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        // 1. Save to global invitations store
        const existingGlobal = JSON.parse(localStorage.getItem('gt_all_notifications') || '[]');
        localStorage.setItem('gt_all_notifications', JSON.stringify([notif, ...existingGlobal]));

        // 2. Also save specifically to recipient's inbox key for instant delivery
        const userKey = `gt_notif_${normRecipient}`;
        const existingUser = JSON.parse(localStorage.getItem(userKey) || '[]');
        localStorage.setItem(userKey, JSON.stringify([notif, ...existingUser]));

        // 3. Update the trip in gt_all_trips to add this collaborator
        const trips = JSON.parse(localStorage.getItem('gt_all_trips') || '[]');
        const updatedTrips = trips.map((t) => {
          if (t.id === tripId) {
            const currentCollabs = Array.isArray(t.collaborators) ? t.collaborators : [];
            const exists = currentCollabs.some((c) => c.email.toLowerCase() === normRecipient);
            if (!exists) {
              return {
                ...t,
                collaborators: [
                  ...currentCollabs,
                  {
                    id: targetUser.id,
                    name: targetUser.name,
                    email: targetUser.email,
                    role: role,
                    avatar: targetUser.avatar,
                    status: 'Invited',
                  },
                ],
              };
            }
          }
          return t;
        });
        localStorage.setItem('gt_all_trips', JSON.stringify(updatedTrips));

        // 4. Dispatch a custom window event so open components (like Header) can react immediately
        window.dispatchEvent(new CustomEvent('gt_new_notification', { detail: notif }));
        window.dispatchEvent(new CustomEvent('gt_notifications_updated'));
      } catch (e) {
        console.error('Failed to persist notification:', e);
      }
    }

    return { success: true, notification: notif, targetUser };
  },

  // ── 5. GET NOTIFICATIONS FOR LOGGED IN USER ────────────────────────────────
  getNotifications(currentUserEmail) {
    let list = [...DEFAULT_NOTIFICATIONS];

    if (typeof window !== 'undefined') {
      try {
        let activeEmail = (currentUserEmail || '').trim().toLowerCase();
        if (!activeEmail) {
          try {
            const active = localStorage.getItem('gt_active_user');
            if (active) activeEmail = JSON.parse(active).email?.toLowerCase() || '';
          } catch (e) {}
        }

        const globalStore = JSON.parse(localStorage.getItem('gt_all_notifications') || '[]');
        const userStore = activeEmail ? JSON.parse(localStorage.getItem(`gt_notif_${activeEmail}`) || '[]') : [];

        // Combine unique notifications
        const map = new Map();
        [...userStore, ...globalStore, ...list].forEach((n) => {
          // If it's a direct user invite, only show if it belongs to this active user
          if (n.recipientEmail) {
            if (!activeEmail || n.recipientEmail.toLowerCase() !== activeEmail) {
              return; // skip if not logged in or meant for another user
            }
          }
          if (!map.has(n.id)) {
            map.set(n.id, n);
          }
        });

        list = Array.from(map.values());
      } catch (e) {}
    }

    return list;
  },

  // ── 6. ACCEPT INVITATION ──────────────────────────────────────────────────
  async acceptInvite(notifId, tripId, userEmail) {
    if (typeof window === 'undefined') return;
    try {
      let activeEmail = (userEmail || '').trim().toLowerCase();
      if (!activeEmail) {
        try {
          const active = localStorage.getItem('gt_active_user');
          if (active) activeEmail = JSON.parse(active).email?.toLowerCase() || '';
        } catch (e) {}
      }

      // Update notification status
      const globalStore = JSON.parse(localStorage.getItem('gt_all_notifications') || '[]');
      const updated = globalStore.map((n) =>
        n.id === notifId ? { ...n, status: 'accepted', unread: false } : n
      );
      localStorage.setItem('gt_all_notifications', JSON.stringify(updated));

      // Also update in user-specific key
      if (activeEmail) {
        const userKey = `gt_notif_${activeEmail}`;
        const userStore = JSON.parse(localStorage.getItem(userKey) || '[]');
        localStorage.setItem(
          userKey,
          JSON.stringify(
            userStore.map((n) => (n.id === notifId ? { ...n, status: 'accepted', unread: false } : n))
          )
        );
      }

      // Also mark as accepted in all trips list
      const tripsStore = JSON.parse(localStorage.getItem('gt_all_trips') || '[]');
      const updatedTrips = tripsStore.map((t) => {
        if (t.id === tripId && Array.isArray(t.collaborators)) {
          return {
            ...t,
            collaborators: t.collaborators.map((c) =>
              c.status === 'Invited' ? { ...c, status: 'Online' } : c
            ),
          };
        }
        return t;
      });
      localStorage.setItem('gt_all_trips', JSON.stringify(updatedTrips));

      window.dispatchEvent(new CustomEvent('gt_notifications_updated'));
    } catch (e) {
      console.error(e);
    }
  },

  // ── 7. DECLINE INVITATION ──────────────────────────────────────────────────
  async declineInvite(notifId, tripId, userEmail) {
    if (typeof window === 'undefined') return;
    try {
      const globalStore = JSON.parse(localStorage.getItem('gt_all_notifications') || '[]');
      const updated = globalStore.filter((n) => n.id !== notifId);
      localStorage.setItem('gt_all_notifications', JSON.stringify(updated));

      if (userEmail) {
        const userKey = `gt_notif_${userEmail.trim().toLowerCase()}`;
        const userStore = JSON.parse(localStorage.getItem(userKey) || '[]');
        localStorage.setItem(userKey, JSON.stringify(userStore.filter((n) => n.id !== notifId)));
      }

      window.dispatchEvent(new CustomEvent('gt_notifications_updated'));
    } catch (e) {}
  },

  // ── 8. MARK ALL AS READ ───────────────────────────────────────────────────
  markAllAsRead(currentUserEmail) {
    if (typeof window === 'undefined') return;
    try {
      let activeEmail = (currentUserEmail || '').trim().toLowerCase();
      if (!activeEmail) {
        try {
          const active = localStorage.getItem('gt_active_user');
          if (active) activeEmail = JSON.parse(active).email?.toLowerCase() || '';
        } catch (e) {}
      }

      if (activeEmail) {
        const userKey = `gt_notif_${activeEmail}`;
        const userStore = JSON.parse(localStorage.getItem(userKey) || '[]');
        localStorage.setItem(userKey, JSON.stringify(userStore.map((n) => ({ ...n, unread: false }))));
      }
      const globalStore = JSON.parse(localStorage.getItem('gt_all_notifications') || '[]');
      localStorage.setItem('gt_all_notifications', JSON.stringify(globalStore.map((n) => ({ ...n, unread: false }))));
      window.dispatchEvent(new CustomEvent('gt_notifications_updated'));
    } catch (e) {}
  },
};
