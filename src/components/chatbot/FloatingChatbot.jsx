'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Send,
  X,
  Minus,
  Maximize2,
  Trash2,
  MapPin,
  Compass,
} from 'lucide-react';
import { aiService } from '@/lib/services';
import styles from './floatingChatbot.module.css';

/**
 * Renders simple markdown formatting (bullet points, bolding, line breaks)
 */
function FormattedContent({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  return (
    <div className={styles.formattedText}>
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} style={{ height: 6 }} />;
        }

        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.replace(/^[•\-\*]\s*/, '') : line;
        const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

        return (
          <div
            key={lIdx}
            style={{
              paddingLeft: isBullet ? 12 : 0,
              position: 'relative',
              marginBottom: 3,
            }}
          >
            {isBullet && (
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  color: '#2563eb',
                  fontWeight: 'bold',
                }}
              >
                •
              </span>
            )}
            {parts.map((p, pIdx) => {
              if (p.startsWith('**') && p.endsWith('**')) {
                return (
                  <strong key={pIdx} style={{ fontWeight: 650 }}>
                    {p.slice(2, -2)}
                  </strong>
                );
              }
              return <span key={pIdx}>{p}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function FloatingChatbot() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: "👋 Hi! I'm your **GlobeTrotter AI Travel Assistant**. How can I help plan your next journey today?\n\n• Ask about itineraries, top sights, or hidden gems\n• Get food and culinary recommendations\n• Optimize transit and budget allocations",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Hide the floating widget if user is currently inside the Playground
  // (since the Playground already has its own dedicated Copilot right-panel workspace)
  if (pathname && pathname.startsWith('/playground')) {
    return null;
  }

  const quickPrompts = [
    { label: '🗾 3-day Tokyo guide', query: 'Plan an ideal 3-day itinerary for Tokyo focusing on culture and food' },
    { label: '🏖️ Bali hidden beaches', query: 'What are the best tranquil beaches and sunset spots in Bali?' },
    { label: '💰 Europe budget tips', query: 'How to travel across Europe for 2 weeks on a comfortable budget?' },
    { label: '🎒 Smart packing tips', query: 'What are the essential packing tips for multi-city travel?' },
  ];

  const handleSend = async (userQuery) => {
    const text = userQuery || input;
    if (!text.trim() || isTyping) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsTyping(true);

    try {
      const res = await aiService.chat(updated, { source: 'global_floating_bot' });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.content || res.text || "Here's what I recommend for your travels:",
        suggestedStop: res.suggestedStop || null,
        provider: res.provider,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Floating bot chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: "I'm having trouble connecting right now, but I recommend checking out our Visual Playground to assemble and optimize your stops node by node!",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className={styles.floatingContainer} aria-label="GlobeTrotter AI Assistant">
      {!isOpen ? (
        <button
          type="button"
          className={styles.launcherBtn}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          title="Open AI Travel Assistant"
        >
          <span className={styles.pulseDot} />
          <div className={styles.launcherIconWrapper}>
            <Sparkles size={16} />
          </div>
          <span className={styles.launcherText}>AI Assistant</span>
        </button>
      ) : (
        <div className={styles.chatWindow}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerBrand}>
              <div className={styles.brandAvatar}>
                <Sparkles size={17} />
              </div>
              <div className={styles.brandText}>
                <div className={styles.brandTitle}>GlobeTrotter AI</div>
                <div className={styles.brandSubtitle}>
                  <span className={styles.onlineBadge} />
                  <span>Gemini Assistant</span>
                </div>
              </div>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={handleClear}
                title="Clear conversation"
              >
                <Trash2 size={13} />
              </button>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => setIsOpen(false)}
                title="Close chat"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesArea}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.bubble} ${m.sender === 'user' ? styles.userBubble : styles.aiBubble}`}
              >
                <FormattedContent text={m.text} />

                {m.suggestedStop && (
                  <div className={styles.stopCard}>
                    {m.suggestedStop.image && (
                      <img
                        src={m.suggestedStop.image}
                        alt={m.suggestedStop.title}
                        className={styles.stopThumb}
                      />
                    )}
                    <div className={styles.stopInfo}>
                      <div className={styles.stopTitle}>{m.suggestedStop.title}</div>
                      <div className={styles.stopCategory}>
                        {m.suggestedStop.category || 'Spot'} • {m.suggestedStop.estimatedCost ? `$${m.suggestedStop.estimatedCost}` : 'Free'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.bubble} ${styles.aiBubble} ${styles.typingBubble}`}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className={styles.quickPrompts}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.promptChip}
                onClick={() => handleSend(p.query)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className={styles.inputArea}
          >
            <input
              type="text"
              placeholder="Ask anything about your travels..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.inputField}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={styles.sendBtn}
              title="Send message"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
