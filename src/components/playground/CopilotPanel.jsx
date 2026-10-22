'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Plus, X, Bot, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './playground.module.css';

export default function CopilotPanel({
  onClose,
  onAddSuggestedPlace,
  trip,
  nodesCount,
}) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello Alex! I'm your GlobeTrotter AI Copilot. I've analyzed your ${nodesCount} stops and can suggest optimized timing, hidden gems, or budget tips. How can I assist?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const promptChips = [
    { label: '🍲 Hidden Goan food spots', query: 'Suggest authentic Goan food spots' },
    { label: '⚡ Optimize route transit', query: 'How should I order my stops for minimal drive time?' },
    { label: '🌅 Best sunset viewpoints', query: 'Recommend the best sunset spots for evening photography' },
    { label: '💰 Budget optimization', query: 'How can I save $100 across activities?' },
  ];

  const handleSend = (userQuery) => {
    const text = userQuery || input;
    if (!text.trim() || isTyping) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock realistic AI response
    setTimeout(() => {
      let aiText = "I've reviewed your itinerary structure and have tailored this suggestion:";
      let suggestedStop = null;

      const lower = text.toLowerCase();
      if (lower.includes('food') || lower.includes('curry') || lower.includes('dish')) {
        aiText = "For an authentic coastal culinary experience in Goa, add Vinayak Family Restaurant in Assagao for fresh fish thali, or Ritz Classic in Panjim.";
        suggestedStop = {
          title: 'Vinayak Family Restaurant',
          type: 'activity',
          category: 'Food',
          duration: '1.5 hours',
          estimatedCost: 20,
          description: 'Famous local hub for authentic Konkani seafood thali.',
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop',
        };
      } else if (lower.includes('sunset') || lower.includes('view') || lower.includes('beach')) {
        aiText = "Chapora Fort (Dil Chahta Hai point) offers panoramic sunset vistas over the Chapora River mouth and Arabian Sea. Highly recommended on Day 2.";
        suggestedStop = {
          title: 'Chapora Fort Sunset',
          type: 'destination',
          category: 'Sightseeing',
          duration: '2 hours',
          estimatedCost: 0,
          description: 'Dramatic laterite cliff fortress ruins with 360-degree ocean views.',
          image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=500&h=300&fit=crop',
        };
      } else if (lower.includes('route') || lower.includes('transit') || lower.includes('pacing')) {
        aiText = "Tip: Keep North Goa stops (Baga, Fort Aguada) together on Days 1-2, and cross the Zuari river to South Goa (Palolem, Margao) on Day 3 onwards to avoid repeated 2-hour cab rides.";
      } else {
        aiText = "Based on your journey pace, adding a 2-hour relaxed buffer between morning sightseeing and afternoon beach visits keeps your itinerary stress-free.";
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        suggestedStop,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <aside className={styles.copilotPanel} aria-label="AI Travel Copilot">
      {/* Header */}
      <div className={styles.copilotHeader}>
        <div className={styles.copilotTitle}>
          <Sparkles size={16} color="var(--gt-blue)" />
          <span>AI Travel Copilot</span>
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

        {messages.map((m) => (
          <div
            key={m.id}
            className={`${styles.chatBubble} ${m.sender === 'user' ? styles.chatBubbleUser : styles.chatBubbleAi}`}
          >
            <div className={styles.chatBubbleText}>{m.text}</div>

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
                    <span>{m.suggestedStop.category}</span>
                    <span>•</span>
                    <span>{m.suggestedStop.estimatedCost ? `$${m.suggestedStop.estimatedCost}` : 'Free'}</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    style={{ marginTop: 6, fontSize: 11 }}
                    onClick={() => onAddSuggestedPlace(m.suggestedStop)}
                  >
                    <Plus size={12} />
                    <span>Add to Canvas</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.chatBubble} ${styles.chatBubbleAi} ${styles.typingBubble}`}>
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
          </div>
        )}
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
          placeholder="Ask Copilot for advice or recommendations..."
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
