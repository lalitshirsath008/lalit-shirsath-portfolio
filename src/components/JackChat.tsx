import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowUp, FaBriefcase, FaCode, FaEnvelope, FaGraduationCap, FaRegEdit, FaStop, FaTimes } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import JackLogo from './JackLogo';

type Message = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS: { icon: IconType; title: string; prompt: string }[] = [
  { icon: FaCode, title: 'Core skills', prompt: 'What are his core skills?' },
  { icon: FaBriefcase, title: 'Work experience', prompt: 'Where has he worked and what did he do there?' },
  { icon: FaGraduationCap, title: 'Projects', prompt: 'Tell me about the projects he has built.' },
  { icon: FaEnvelope, title: 'Get in touch', prompt: 'How can I contact him?' },
];

// URLs and emails in Jack's replies become links, and **bold** becomes <strong>
const renderInline = (text: string, keyBase: string) =>
  text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g).map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={key} className="font-semibold text-neutral-900">{part.slice(2, -2)}</strong>;
    if (/^https?:\/\//.test(part))
      return (
        <a key={key} href={part} target="_blank" rel="noopener noreferrer" className="underline decoration-teal-500/50 hover:decoration-teal-500 break-all">
          {part}
        </a>
      );
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part))
      return (
        <a key={key} href={`mailto:${part}`} className="underline decoration-teal-500/50 hover:decoration-teal-500">
          {part}
        </a>
      );
    return part;
  });

// Light markdown: paragraphs and "- " bullet lists (indented bullets nest one level)
const MessageBody: React.FC<{ text: string }> = ({ text }) => {
  const blocks: React.ReactNode[] = [];
  let items: { text: string; nested: boolean }[] = [];
  const flush = (key: string) => {
    if (!items.length) return;
    blocks.push(
      <ul key={key} className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className={`flex gap-2.5 ${it.nested ? 'pl-5' : ''}`}>
            <span className={`mt-[9px] w-1.5 h-1.5 rounded-full flex-shrink-0 ${it.nested ? 'bg-neutral-300' : 'bg-neutral-500'}`} />
            <span>{renderInline(it.text, `${key}-${i}`)}</span>
          </li>
        ))}
      </ul>
    );
    items = [];
  };
  text.split('\n').forEach((line, i) => {
    const bullet = line.match(/^(\s*)[-*•]\s+(.*)/);
    if (bullet) {
      items.push({ text: bullet[2], nested: bullet[1].length >= 2 });
      return;
    }
    flush(`ul-${i}`);
    if (line.trim()) blocks.push(<p key={`p-${i}`}>{renderInline(line.trim(), `p-${i}`)}</p>);
  });
  flush('ul-end');
  return <div className="space-y-3">{blocks}</div>;
};

const JackAvatar: React.FC<{ active?: boolean }> = ({ active }) => (
  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
    <JackLogo size={26} active={active} />
  </span>
);

/** "Ask Jack" button plus a ChatGPT-style chat window. Talks to /api/jack, which streams plain text. */
const JackChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // Focus the input on open, Esc closes; page scroll is only locked on phones, where the chat is full screen
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    if (window.matchMedia('(max-width: 639px)').matches) document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  // Auto-grow the input up to a few lines, like ChatGPT's composer
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input, open]);

  const setReply = (content: string) => setMessages((m) => [...m.slice(0, -1), { role: 'assistant', content }]);

  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    setInput('');
    setBusy(true);
    const history: Message[] = [...messages, { role: 'user', content: question }];
    setMessages([...history, { role: 'assistant', content: '' }]);

    const controller = new AbortController();
    abortRef.current = controller;
    let reply = '';
    try {
      const res = await fetch('/api/jack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const err = (await res.json().catch(() => null)) as { error?: string } | null;
        setReply(err?.error ?? 'Sorry, something went wrong. Please try again.');
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setReply(reply);
      }
      if (!reply.trim()) setReply("Sorry, I couldn't come up with an answer. Please try rephrasing.");
    } catch {
      // Stopped by the user: keep whatever had arrived
      if (controller.signal.aborted) setReply(reply.trim() ? reply : 'Stopped.');
      else setReply("Sorry, I couldn't connect. Please check your internet and try again.");
    } finally {
      abortRef.current = null;
      setBusy(false);
    }
  };

  const stop = () => abortRef.current?.abort();

  const newChat = () => {
    stop();
    setMessages([]);
    setInput('');
    inputRef.current?.focus();
  };

  const last = messages[messages.length - 1];
  const thinking = busy && last?.role === 'assistant' && last.content === '';

  const composer = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send(input);
      }}
      className="relative flex items-end gap-2 rounded-[26px] bg-white ring-1 ring-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)] focus-within:ring-neutral-300 pl-4 pr-1.5 py-1.5"
    >
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send(input);
          }
        }}
        rows={1}
        maxLength={1000}
        placeholder="Ask about Lalit…"
        className="flex-1 resize-none bg-transparent py-2 text-sm leading-6 text-neutral-900 placeholder-neutral-400 focus:outline-none"
      />
      {busy ? (
        <button
          type="button"
          onClick={stop}
          aria-label="Stop generating"
          className="w-9 h-9 mb-0.5 flex-shrink-0 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-black transition-colors duration-200"
        >
          <FaStop className="w-3 h-3" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send"
          className="w-9 h-9 mb-0.5 flex-shrink-0 rounded-full bg-neutral-900 text-white flex items-center justify-center hover:bg-black disabled:bg-neutral-200 disabled:text-neutral-400 transition-colors duration-200"
        >
          <FaArrowUp className="w-3.5 h-3.5" />
        </button>
      )}
    </form>
  );

  // Chatbot-style window anchored above the launcher (full screen on phones)
  const panel = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          role="dialog"
          aria-label="Chat with Jack"
          className="fixed z-[90] inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[400px] sm:h-[min(620px,calc(100vh-8rem))] flex flex-col bg-white sm:rounded-3xl overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.28)] ring-1 ring-black/5 origin-bottom-right font-sans"
        >
            {/* Header */}
            <div className="flex items-center gap-2 px-3 sm:px-4 h-14 border-b border-neutral-100">
              <button
                onClick={newChat}
                aria-label="New chat"
                title="New chat"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-200"
              >
                <FaRegEdit className="w-4 h-4" />
              </button>
              <div className="flex-1 flex items-center justify-center gap-2.5">
                <JackLogo size={22} active={busy} />
                <div className="text-left">
                <p className="font-semibold text-neutral-900 leading-tight">Jack</p>
                <p className="text-[11px] text-neutral-400 leading-tight">Lalit's AI assistant</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-200"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {messages.length === 0 ? (
              // Welcome screen
              <div className="flex-1 overflow-y-auto flex">
                <div className="m-auto w-full px-5 py-6 flex flex-col items-center">
                  <JackLogo size={52} active={busy} />
                  <h2 className="mt-4 text-xl font-semibold text-neutral-900 text-center">How can I help you today?</h2>
                  <p className="mt-1.5 text-sm text-neutral-500 text-center max-w-xs">
                    Ask me about Lalit's skills, projects, experience or how to reach him.
                  </p>
                  <div className="mt-6 w-full space-y-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s.title}
                        onClick={() => send(s.prompt)}
                        className="w-full flex items-center gap-3 text-left rounded-2xl ring-1 ring-neutral-200 px-4 py-3 hover:bg-neutral-50 hover:ring-neutral-300 transition-colors duration-200"
                      >
                        <s.icon className="w-4 h-4 text-teal-600 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{s.prompt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Conversation - centred column, assistant without bubbles, user in grey bubbles
              <div ref={listRef} className="flex-1 overflow-y-auto">
                <div className="px-4 py-5 space-y-5">
                  {messages.map((m, i) =>
                    m.role === 'user' ? (
                      <div key={i} className="flex justify-end">
                        <div className="max-w-[85%] rounded-3xl bg-neutral-100 px-4 py-2 text-sm leading-6 text-neutral-900 whitespace-pre-wrap break-words">
                          {m.content}
                        </div>
                      </div>
                    ) : (
                      <div key={i} className="flex gap-3">
                        <JackAvatar active={busy && i === messages.length - 1} />
                        <div className="flex-1 min-w-0 pt-1 text-sm leading-6 text-neutral-800 break-words">
                          {m.content === '' && thinking && i === messages.length - 1 ? (
                            <span className="inline-block w-2.5 h-2.5 mt-2 rounded-full bg-neutral-900 animate-pulse" />
                          ) : (
                            <>
                              <MessageBody text={m.content} />
                              {busy && i === messages.length - 1 && (
                                <span className="inline-block w-2 h-2 ml-1 rounded-full bg-neutral-900 animate-pulse align-middle" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Composer */}
            <div className="px-3 pb-3 pt-2">
              {composer}
              <p className="mt-2 text-center text-[10px] text-neutral-400">Jack can make mistakes. Check important details with Lalit.</p>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {createPortal(panel, document.body)}
      {/* Launcher: just Jack's animated mark */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? 'Close chat with Jack' : 'Chat with Jack'}
        title="Chat with Jack"
        className="fixed z-[60] bottom-6 right-6 w-14 h-14 flex items-center justify-center rounded-full"
      >
        <JackLogo size={50} active={busy} />
      </motion.button>
    </>
  );
};

export default JackChat;
