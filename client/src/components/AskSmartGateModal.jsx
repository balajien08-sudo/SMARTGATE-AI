import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { aiApi } from '../services/api.js';
import { DemoBadge } from './DemoBadge.jsx';

export function AskSmartGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'msg-init',
      sender: 'ai',
      text: '👋 Hello! I am **SmartGate AI**. I continuously analyze campus gate telemetry and congestion patterns.\n\nHow can I assist you with traffic monitoring today?',
      suggestedActions: [
        'Why is traffic high?',
        'What action do you recommend?',
        'What is the current gate status?',
        'When is traffic expected to peak?'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim() || loading) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await aiApi.askAssistant(query);
      if (res.success && res.data) {
        const aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: res.data.response,
          suggestedActions: res.data.suggestedActions || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (err) {
      const errorMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: '⚠️ Unable to connect to AI Telemetry engine right now. Please check backend status.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Global Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ask-ai-floating-btn"
          aria-label="Open SmartGate AI Assistant"
        >
          <Sparkles size={18} />
          <span>Ask SmartGate AI</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '420px',
            maxWidth: 'calc(100vw - 48px)',
            height: '600px',
            maxHeight: 'calc(100vh - 100px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-glass-strong)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-modal)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'var(--bg-hero-gradient)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                  SmartGate AI Assistant
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span className="pulse-indicator green" style={{ width: '8px', height: '8px' }} />
                  <span style={{ fontSize: '11px', color: 'var(--emerald-400)', fontFamily: 'var(--font-mono)' }}>
                    Live Telemetry Linked
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'var(--bg-pill)',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <X size={18} />
            </button>
          </div>

          {/* Safety Sub-Banner */}
          <div
            style={{
              padding: '6px 16px',
              background: 'var(--purple-bg)',
              borderBottom: '1px solid var(--purple-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ fontSize: '10px', color: 'var(--purple-400)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              AI ASSISTANT DEMO ENGINE
            </span>
            <DemoBadge size="xs" />
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: 'var(--bg-app)'
            }}
          >
            {messages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isAi ? 'flex-start' : 'flex-end',
                    gap: '4px'
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '12px 16px',
                      borderRadius: isAi ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                      background: isAi ? 'var(--bg-card-solid)' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      color: isAi ? 'var(--text-main)' : '#ffffff',
                      border: isAi ? '1px solid var(--border-subtle)' : 'none',
                      fontSize: '13px',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                      boxShadow: isAi ? 'var(--shadow-card)' : '0 4px 14px rgba(2, 132, 199, 0.3)'
                    }}
                  >
                    {msg.text}
                  </div>

                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', margin: '0 4px' }}>
                    {msg.timestamp}
                  </span>

                  {/* Suggestion Chips */}
                  {isAi && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(action)}
                          style={{
                            background: 'var(--cyan-bg)',
                            border: '1px solid var(--cyan-border)',
                            color: 'var(--cyan-500)',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textAlign: 'left'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 2px 8px var(--cyan-glow)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan-500)', fontSize: '12px', fontWeight: 600 }}>
                <span className="radar-spinner" style={{ display: 'inline-block' }}>⚙️</span>
                <span>Analyzing gate telemetry & pattern models...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-header)',
              display: 'flex',
              gap: '10px'
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about traffic, peak forecasts, gate status..."
              className="form-input"
              style={{
                fontSize: '13px',
                padding: '10px 14px',
                borderRadius: '12px'
              }}
            />

            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="btn-primary"
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                opacity: loading || !inputValue.trim() ? 0.5 : 1
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
