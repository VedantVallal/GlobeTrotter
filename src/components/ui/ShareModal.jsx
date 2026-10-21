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
} from 'lucide-react';
import styles from './ShareModal.module.css';

export default function ShareModal({ isOpen, onClose, trip }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && trip?.id) {
      setShareUrl(`${window.location.origin}/share/${trip.id}`);
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
      // Fallback
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
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
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
              <Share2 size={20} />
            </div>
            <div>
              <div className={styles.title}>Share Trip Plan</div>
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

        {/* Modal Body */}
        <div className={styles.body}>
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
