'use client';

import { useState, useEffect } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  Globe,
  Mail,
  MessageCircle,
  Users,
  UserPlus,
  Shield,
  Trash2,
  Sparkles,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { tripService, notificationService } from '@/lib/services';
import styles from './ShareModal.module.css';

const DEFAULT_COLLABORATORS = [
  {
    id: 'usr-collab-1',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    role: 'Owner',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    status: 'Online',
  },
  {
    id: 'usr-collab-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'Editor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    status: 'Online',
  },
];

export default function ShareModal({ isOpen, onClose, trip, onUpdateTrip }) {
  const [activeTab, setActiveTab] = useState('collaborators'); // 'collaborators' | 'share'
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Collaborators State
  const [collaborators, setCollaborators] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [inviteSuccess, setInviteSuccess] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && trip?.id) {
      setShareUrl(`${window.location.origin}/share/${trip.id}`);
      // Load collaborators from trip or fallback
      if (Array.isArray(trip.collaborators) && trip.collaborators.length > 0) {
        setCollaborators(trip.collaborators);
      } else {
        setCollaborators(DEFAULT_COLLABORATORS);
      }
      // Load registered travelers
      const users = notificationService.getRegisteredUsers();
      setRegisteredUsers(users);
    }
  }, [trip?.id, isOpen]);

  if (!isOpen || !trip) return null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: trip.title || 'GlobeTrotter Trip',
          text: `Check out my journey plan "${trip.title}" on GlobeTrotter! 🌍✈️`,
          url: shareUrl,
        });
      } catch (err) {}
    } else {
      handleCopy();
    }
  };

  // Add / Invite Collaborator with Rigorous Validation & User Check
  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess('');

    const cleanEmail = inviteEmail.trim().toLowerCase();

    // 1. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setInviteError('Please enter a valid email address (e.g. companion@example.com).');
      return;
    }

    // 2. Prevent self-invitation
    let currentEmail = '';
    try {
      const active = localStorage.getItem('gt_active_user');
      if (active) currentEmail = JSON.parse(active).email?.toLowerCase();
    } catch (e) {}

    if (currentEmail && cleanEmail === currentEmail) {
      setInviteError('You cannot invite yourself — you are already the trip owner!');
      return;
    }

    // 3. Prevent duplicate invitation
    if (collaborators.some((c) => c.email.toLowerCase() === cleanEmail)) {
      setInviteError(`"${inviteEmail}" is already added as a collaborator on this trip.`);
      return;
    }

    // 4. Verify & find user (checks local storage, Firestore & registered accounts)
    const targetUser = await notificationService.findUserByEmail(cleanEmail);
    if (!targetUser) {
      setInviteError('Please enter a valid email address to invite.');
      return;
    }

    // 5. Dispatch real invitation & notification
    let myName = 'Aarav Mehta';
    try {
      const active = localStorage.getItem('gt_active_user');
      if (active) myName = JSON.parse(active).name || myName;
    } catch (e) {}

    try {
      await notificationService.sendTripInvite({
        toEmail: targetUser.email,
        senderName: myName,
        tripId: trip.id,
        tripTitle: trip.title,
        role: inviteRole,
      });

      const newCollab = {
        id: targetUser.id || `collab-${Date.now()}`,
        name: targetUser.name,
        email: targetUser.email,
        role: inviteRole,
        avatar: targetUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        status: 'Invited',
      };

      const updated = [...collaborators, newCollab];
      setCollaborators(updated);
      setInviteEmail('');
      setInviteSuccess(
        `Invitation sent to ${targetUser.name} (${targetUser.email}) as ${inviteRole}! Real-time notification delivered.`
      );
      setTimeout(() => setInviteSuccess(''), 5000);

      // Save to trip service & storage
      await tripService.update(trip.id, { collaborators: updated });
      if (onUpdateTrip) onUpdateTrip({ ...trip, collaborators: updated });
    } catch (err) {
      setInviteError(err.message || 'Failed to send invitation.');
    }
  };

  // Remove Collaborator
  const handleRemoveCollaborator = async (collabId) => {
    const updated = collaborators.filter((c) => c.id !== collabId);
    setCollaborators(updated);
    try {
      await tripService.update(trip.id, { collaborators: updated });
      if (onUpdateTrip) onUpdateTrip({ ...trip, collaborators: updated });
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to click suggested companion
  const handleSelectSuggested = (user) => {
    setInviteEmail(user.email);
    setInviteError('');
  };

  const encodedTitle = encodeURIComponent(trip.title || 'My Journey');
  const encodedUrl = encodeURIComponent(shareUrl);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Hey! Check out my trip "${trip.title}" on GlobeTrotter: ${shareUrl}`
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=GlobeTrotter,Travel`;
  const mailUrl = `mailto:?subject=${encodeURIComponent(
    `Travel Itinerary: ${trip.title}`
  )}&body=${encodeURIComponent(
    `Hey,\n\nI planned this journey for ${trip.title} on GlobeTrotter!\nYou can view the full daily itinerary, stops, and activities here:\n${shareUrl}\n\nHave a look!`
  )}`;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.iconBadge}>
              {activeTab === 'collaborators' ? <Users size={20} /> : <Share2 size={20} />}
            </div>
            <div>
              <div className={styles.title}>
                {activeTab === 'collaborators' ? 'Trip Collaboration' : 'Share Trip Plan'}
              </div>
              <div className={styles.subtitle}>{trip.title}</div>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            title="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabBar}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'collaborators' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('collaborators')}
          >
            <Users size={14} />
            <span>Collaborate ({collaborators.length})</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'share' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('share')}
          >
            <Share2 size={14} />
            <span>Public Link & Social</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className={styles.body}>
          {activeTab === 'collaborators' ? (
            /* ── TAB 1: COLLABORATORS & COMPANIONS ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Invite Form */}
              <div className={styles.inviteBox}>
                <div className={styles.sectionLabel}>Invite Registered Companion</div>
                <form onSubmit={handleInvite} className={styles.inviteInputGroup}>
                  <input
                    type="email"
                    required
                    placeholder="Enter registered email (e.g. dev.patil@voyage.in)"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value);
                      if (inviteError) setInviteError('');
                    }}
                    className={styles.inviteInput}
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className={styles.roleSelect}
                  >
                    <option value="Editor">Can Edit</option>
                    <option value="Viewer">Can View</option>
                  </select>
                  <button
                    type="submit"
                    className={styles.copyBtn}
                    style={{ padding: '8px 12px' }}
                  >
                    <UserPlus size={14} />
                    <span>Invite</span>
                  </button>
                </form>

                {/* Validation Error Banner */}
                {inviteError && (
                  <div
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#b91c1c',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 6,
                      marginTop: 4,
                      lineHeight: 1.4,
                    }}
                  >
                    <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span>{inviteError}</span>
                  </div>
                )}

                {/* Success Banner */}
                {inviteSuccess && (
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      color: '#15803d',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 4,
                    }}
                  >
                    <Check size={14} style={{ flexShrink: 0 }} />
                    <span>{inviteSuccess}</span>
                  </div>
                )}

                {/* Suggested Registered Users Quick-Pick Chips */}
                <div style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 11, color: 'var(--gt-text-muted)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <UserCheck size={12} color="var(--gt-blue)" />
                    <span>Quick Invite Registered Travelers:</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {registeredUsers
                      .filter((u) => !collaborators.some((c) => c.email.toLowerCase() === u.email.toLowerCase()))
                      .slice(0, 4)
                      .map((u) => (
                        <button
                          key={u.email}
                          type="button"
                          onClick={() => handleSelectSuggested(u)}
                          style={{
                            background: '#ffffff',
                            border: '1px solid var(--gt-border)',
                            borderRadius: '12px',
                            padding: '2px 8px',
                            fontSize: '11px',
                            color: 'var(--gt-text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--gt-blue)';
                            e.currentTarget.style.color = 'var(--gt-blue)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--gt-border)';
                            e.currentTarget.style.color = 'var(--gt-text-secondary)';
                          }}
                        >
                          <span>+ {u.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* Collaborators List */}
              <div>
                <div className={styles.sectionLabel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Active Travel Planners</span>
                  <span style={{ fontSize: 11, color: 'var(--gt-text-muted)' }}>
                    Real-time visual sync
                  </span>
                </div>

                <div className={styles.collaboratorsList}>
                  {collaborators.map((c) => (
                    <div key={c.id} className={styles.collaboratorRow}>
                      <div className={styles.collaboratorMeta}>
                        <div className={styles.collaboratorAvatarWrap}>
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className={styles.collaboratorAvatar}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop';
                            }}
                          />
                          {c.status === 'Online' && <span className={styles.onlineDot} />}
                        </div>
                        <div className={styles.collaboratorDetails}>
                          <span className={styles.collaboratorName}>{c.name}</span>
                          <span className={styles.collaboratorEmail}>{c.email}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          className={`${styles.rolePill} ${
                            c.role === 'Owner'
                              ? styles.roleOwner
                              : c.role === 'Editor'
                              ? styles.roleEditor
                              : styles.roleViewer
                          }`}
                        >
                          {c.role}
                        </span>

                        {c.role !== 'Owner' && (
                          <button
                            type="button"
                            className={styles.removeCollabBtn}
                            onClick={() => handleRemoveCollaborator(c.id)}
                            title="Remove companion"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Pill */}
              <div className={styles.infoBanner}>
                <Sparkles size={14} style={{ flexShrink: 0, marginTop: 1, color: 'var(--gt-blue)' }} />
                <span>
                  Invited companions receive an instant notification in their GlobeTrotter dashboard to join and edit this canvas.
                </span>
              </div>
            </div>
          ) : (
            /* ── TAB 2: PUBLIC LINK & SOCIAL ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Direct Link Section */}
              <div>
                <div className={styles.sectionLabel}>Direct Share Link</div>
                <div className={styles.linkRow}>
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className={styles.linkInput}
                    onClick={(e) => e.target.select()}
                  />
                  <button
                    type="button"
                    className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ''}`}
                    onClick={handleCopy}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Social Quick Share Grid */}
              <div>
                <div className={styles.sectionLabel}>Quick Share With Friends</div>
                <div className={styles.socialGrid}>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                    title="Share via WhatsApp"
                  >
                    <MessageCircle size={20} className={styles.socialIconWhatsapp} />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialBtn}
                    title="Share on X / Twitter"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={styles.socialIconTwitter}
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>X / Twitter</span>
                  </a>

                  <a
                    href={mailUrl}
                    className={styles.socialBtn}
                    title="Share via Email"
                  >
                    <Mail size={20} className={styles.socialIconEmail} />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* Info Banner */}
              <div className={styles.infoBanner}>
                <Globe size={15} style={{ flexShrink: 0, marginTop: 1, color: 'var(--gt-blue)' }} />
                <span>
                  Anyone with this link can view this public itinerary, destinations, and activities without creating an account.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.previewLink}
          >
            <span>Preview Public View</span>
            <ExternalLink size={12} />
          </a>

          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <button
              type="button"
              className={styles.copyBtn}
              style={{ background: 'var(--gt-surface)', color: 'var(--gt-text-primary)', border: '1px solid var(--gt-border)' }}
              onClick={handleNativeShare}
            >
              <Share2 size={13} />
              <span>More Options</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
