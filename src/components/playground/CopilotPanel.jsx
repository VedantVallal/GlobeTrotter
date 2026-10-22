'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Plus, X, Bot, User, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { aiService } from '@/lib/services';
import styles from './playground.module.css';

/**
 * Clean helper to render simple markdown formatting (bold, bullet points, linebreaks)
 */
function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  return (
    <div className={styles.formattedText}>
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lIdx} style={{ height: 6 }} />;
        }

        // Bullet point formatting
        const isBullet = trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.replace(/^[•\-\*]\s*/, '') : line;

        // Simple bold parser for **text**
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
                  color: 'var(--gt-blue, #2563eb)',
                  fontWeight: 'bold',
                }}
              >
                •
              </span>
            )}
            {parts.map((p, pIdx) => {
              if (p.startsWith('**') && p.endsWith('**')) {
                return (
                  <strong key={pIdx} style={{ fontWeight: 650, color: 'inherit' }}>
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

export default function CopilotPanel({
  onClose,
  onAddSuggestedPlace,
  trip,
  nodesCount = 0,
  nodes = [],
  initialQuery = '',
}) {
  const primaryDest = trip?.destinations?.[0] || 'your destination';

  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello Alex! I'm your GlobeTrotter AI Copilot. I've analyzed your ${nodesCount || nodes.length || 0} stops in **${primaryDest}** and can suggest optimized timing, hidden gems, or budget tips. How can I assist?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedPlaces, setAddedPlaces] = useState({});

  const chatEndRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle incoming initialQuery from "Ask Copilot about this stop"
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSend(initialQuery.trim());
    }
  }, [initialQuery]);

  // Dynamic context-aware prompt chips
  const promptChips = [
    { label: `🍲 Food gems in ${primaryDest}`, query: `Suggest top authentic food spots and hidden dining gems in ${primaryDest}` },
    { label: '⚡ Optimize route transit', query: 'How should I order my stops for minimal drive time and best pacing?' },
    { label: `🌅 Best sunset spots in ${primaryDest}`, query: `Recommend the best sunset spots and viewpoints in ${primaryDest}` },
    { label: '💰 Budget optimization', query: 'How can I optimize and save money across daily activities and stays?' },
  ];

  const handleSend = async (userQuery) => {
    const text = userQuery || input;
    if (!text.trim() || isTyping) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput('');
    setIsTyping(true);

    try {
      const tripContext = {
        title: trip?.title || `${primaryDest} Trip`,
        destinations: trip?.destinations || [primaryDest],
        stops: nodes.map((n) => n.title || n.name || n.id),
        budget: trip?.budget || 1500,
        currency: trip?.currency || 'USD',
        duration: trip?.duration || 5,
      };

      const res = await aiService.chat(updatedHistory, tripContext);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.content || res.text || "I've reviewed your itinerary structure and have tailored this suggestion.",
        suggestedStop: res.suggestedStop || null,
        provider: res.provider,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Copilot send error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `I'm currently running in local offline mode. Adding relaxed 90-minute buffers between morning visits and sunset viewpoints will keep your ${primaryDest} journey stress-free!`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddStop = (stop, msgId) => {
    if (!stop) return;
    onAddSuggestedPlace(stop);
    setAddedPlaces((prev) => ({ ...prev, [msgId]: true }));
  };

  return (
    <aside className={styles.copilotPanel} aria-label="AI Travel Copilot">
      {/* Header */}
      <div className={styles.copilotHeader}>
        <div className={styles.copilotTitle}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Sparkles size={13} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>AI Travel Copilot</span>
            <span style={{ fontSize: 10, color: 'var(--gt-text-muted, #94a3b8)', fontWeight: 500 }}>
              Gemini Powered
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            type="button"
            className={styles.copilotClearBtn}
            onClick={() => setMessages([messages[0]])}
            title="Reset conversation"
          >
            Clear
          </button>
          {onClose && (
            <button
              type="button"
              className={styles.panelCloseBtn}
              onClick={onClose}
              title="Close panel"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className={styles.copilotChatArea}>
        {/* Suggestion Chips */}
        <div className={styles.promptChips}>
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.promptChip}
              onClick={() => handleSend(chip.query)}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {messages.map((m) => {
          const isAdded = addedPlaces[m.id];
          return (
            <div
              key={m.id}
              className={`${styles.chatBubble} ${m.sender === 'user' ? styles.chatBubbleUser : styles.chatBubbleAi}`}
            >
              <div className={styles.chatBubbleText}>
                <FormattedMessage text={m.text} />
              </div>

              {/* AI Proposed Stop Card */}
              {m.suggestedStop && (
                <div className={styles.suggestedStopCard}>
                  {m.suggestedStop.image && (
                    <img
                      src={m.suggestedStop.image}
                      alt={m.suggestedStop.title}
                      className={styles.suggestedStopThumb}
                    />
                  )}
                  <div className={styles.suggestedStopContent}>
                    <div className={styles.suggestedStopTitle}>{m.suggestedStop.title}</div>
                    <div className={styles.suggestedStopMeta}>
                      <span>{m.suggestedStop.category || 'Spot'}</span>
                      <span>•</span>
                      <span>{m.suggestedStop.estimatedCost ? `$${m.suggestedStop.estimatedCost}` : 'Free'}</span>
                    </div>
                    <Button
                      variant={isAdded ? 'outline' : 'secondary'}
                      size="sm"
                      disabled={isAdded}
                      style={{ marginTop: 6, fontSize: 11, padding: '4px 8px' }}
                      onClick={() => handleAddStop(m.suggestedStop, m.id)}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle2 size={12} color="#16a34a" />
                          <span>Added to Canvas</span>
                        </>
                      ) : (
                        <>
                          <Plus size={12} />
                          <span>Add to Canvas</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className={`${styles.chatBubble} ${styles.chatBubbleAi} ${styles.typingBubble}`}>
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className={styles.copilotInputArea}
      >
        <input
          type="text"
          placeholder={`Ask Copilot about ${primaryDest}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.copilotInput}
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!input.trim() || isTyping}
          style={{ borderRadius: 'var(--gt-radius-full)', padding: '6px 12px' }}
          title="Send"
        >
          <Send size={13} />
        </Button>
      </form>
    </aside>
  );
}
