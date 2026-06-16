"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { Send, MessageSquare, Loader2 } from "lucide-react";

interface Person { id: string; name: string | null; image: string | null; }
interface Msg {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender: Person;
  receiver: Person;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const me = session?.user?.id;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const load = () => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => setMessages(d?.data?.messages || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  // Build conversation list (the "other" person in each message)
  const conversations = new Map<string, Person>();
  messages.forEach((m) => {
    const other = m.senderId === me ? m.receiver : m.sender;
    if (other?.id) conversations.set(other.id, other);
  });
  const convList = Array.from(conversations.values());

  const thread = messages
    .filter((m) => m.senderId === activeId || m.receiverId === activeId)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));

  useEffect(() => endRef.current?.scrollIntoView(), [activeId, messages.length]);

  async function send() {
    if (!draft.trim() || !activeId) return;
    const content = draft.trim();
    setDraft("");
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId: activeId, content }),
    });
    if (res.ok) {
      const d = await res.json();
      if (d?.data?.message) setMessages((prev) => [...prev, d.data.message]);
    }
  }

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <TopBar title="Messages" subtitle="Chat with recruiters and candidates" />
        <div className="content-area">
          <div className="card-dark grid md:grid-cols-3 overflow-hidden" style={{ height: "calc(100vh - 10rem)" }}>
            {/* Conversation list */}
            <div className="border-r border-[#21262d] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-10 text-slate-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
              ) : convList.length === 0 ? (
                <p className="text-slate-500 text-sm p-4">No conversations yet.</p>
              ) : (
                convList.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveId(p.id)}
                    className={`w-full flex items-center gap-3 p-4 text-left hover:bg-[#161b22] transition-colors ${
                      activeId === p.id ? "bg-[#161b22]" : ""
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                      {p.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-white text-sm truncate">{p.name || "User"}</span>
                  </button>
                ))
              )}
            </div>

            {/* Thread */}
            <div className="md:col-span-2 flex flex-col">
              {!activeId ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                  <MessageSquare className="w-10 h-10 mb-3" />
                  <p className="text-sm">Select a conversation to start chatting</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {thread.map((m) => {
                      const mine = m.senderId === me;
                      return (
                        <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                              mine ? "bg-blue-600 text-white" : "bg-[#21262d] text-slate-200"
                            }`}
                          >
                            {m.content}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={endRef} />
                  </div>
                  <div className="border-t border-[#21262d] p-3 flex items-center gap-2">
                    <input
                      className="input-dark flex-1"
                      placeholder="Type a message..."
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && send()}
                    />
                    <button onClick={send} className="btn-primary p-2.5" disabled={!draft.trim()}>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
