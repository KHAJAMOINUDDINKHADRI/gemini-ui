"use client";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: number;
  image?: string;
}

const PAGE_SIZE = 20;

function generateDummyMessages(
  count: number,
  beforeTimestamp?: number
): Message[] {
  const now = beforeTimestamp || Date.now();
  return Array.from({ length: count }, (_, i) => ({
    id: (now - (i + 1) * 60000).toString(),
    sender: (i % 2 === 0 ? "ai" : "user") as "user" | "ai",
    content: `Dummy message ${i + 1}`,
    timestamp: now - (i + 1) * 60000,
  })).reverse();
}

function MessageSkeleton({ align }: { align: "left" | "right" }) {
  return (
    <div
      className={`flex ${
        align === "right" ? "justify-end" : "justify-start"
      } mb-2`}
    >
      <div
        className={`rounded px-4 py-2 max-w-xs w-40 h-8 bg-gray-200 dark:bg-gray-800 animate-pulse`}
      />
    </div>
  );
}

export default function ChatroomPage() {
  const { id } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0); // Start at 0, load on demand
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allMsgs, setAllMsgs] = useState<Message[]>([]);
  const [chatroomTitle, setChatroomTitle] = useState<string>("");

  useEffect(() => {
    // Load all messages from localStorage or dummy data, but don't show any yet
    const stored = localStorage.getItem(`chatroom_${id}_messages`);
    let initial: Message[] = [];
    if (stored) initial = JSON.parse(stored);
    if (initial.length === 0) {
      initial = generateDummyMessages(PAGE_SIZE * 5);
    }
    setAllMsgs(initial);
    setMessages([]);
    setPage(0);
    setHasMore(initial.length > 0);
  }, [id]);

  useEffect(() => {
    // Save messages to localStorage
    localStorage.setItem(`chatroom_${id}_messages`, JSON.stringify(allMsgs));
  }, [allMsgs, id]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Fetch chatroom title from localStorage
    const stored = localStorage.getItem("chatrooms");
    if (stored) {
      try {
        const rooms = JSON.parse(stored);
        const found = rooms.find((r: { id: string }) => r.id === id);
        if (found) setChatroomTitle(found.title);
      } catch {}
    }
  }, [id]);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const start = Math.max(0, allMsgs.length - nextPage * PAGE_SIZE);
      const end = allMsgs.length - page * PAGE_SIZE;
      const more = allMsgs.slice(start, end);
      setMessages((msgs) => [...more, ...msgs]);
      setPage(nextPage);
      setHasMore(start > 0);
      setLoadingMore(false);
    }, 800);
  }, [allMsgs, page]);

  const sendMessage = () => {
    if (!input.trim() && !image) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: input,
      timestamp: Date.now(),
      image: image ?? undefined,
    };
    setAllMsgs((msgs) => [...msgs, newMsg]);
    setMessages((msgs) => [...msgs, newMsg]);
    setInput("");
    setImage(undefined);
    setAiTyping(true);
    // Simulate AI response with throttling
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: "This is a simulated Gemini AI reply!",
        timestamp: Date.now(),
      };
      setAllMsgs((msgs) => [...msgs, aiMsg]);
      setMessages((msgs) => [...msgs, aiMsg]);
      setAiTyping(false);
    }, 1200);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Copy-to-clipboard
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-transparent p-4">
      <div className="w-full max-w-3.5xl flex flex-col flex-1 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-0 border border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 rounded-t-xl">
          <h2
            className="text-xl font-bold truncate text-gray-900 dark:text-gray-100"
            title={chatroomTitle}
          >
            {chatroomTitle || "Chatroom"}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto mb-0 px-6 py-4 space-y-2 relative flex flex-col bg-white dark:bg-gray-900">
          {messages.length === 0 && hasMore && !loadingMore && (
            <button
              className="mx-auto bg-gray-200 dark:bg-gray-700 text-foreground border border-gray-300 dark:border-gray-600 text-xs px-3 py-1 rounded shadow z-10"
              onClick={loadMore}
              disabled={loadingMore}
            >
              Load messages
            </button>
          )}
          {loadingMore && (
            <>
              <MessageSkeleton align="left" />
              <MessageSkeleton align="right" />
              <MessageSkeleton align="left" />
            </>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
              onMouseEnter={(e) => e.currentTarget.classList.add("group")}
              onMouseLeave={(e) => e.currentTarget.classList.remove("group")}
            >
              <div
                className={`rounded px-4 py-2 max-w-xs break-words shadow text-sm relative group-hover:bg-opacity-90 ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                {msg.image && (
                  <Image
                    src={msg.image}
                    alt="uploaded"
                    width={150}
                    height={150}
                    className="mb-2 max-w-[150px] rounded"
                  />
                )}
                {msg.content}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
                <button
                  className="absolute top-1 right-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-gray-300 dark:bg-gray-700 rounded px-1 py-0.5"
                  title="Copy"
                  onClick={() => handleCopy(msg.content)}
                >
                  📋
                </button>
              </div>
            </div>
          ))}
          {aiTyping && <MessageSkeleton align="left" />}
          {messages.length > 0 && hasMore && !loadingMore && (
            <button
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-300 dark:bg-gray-700 text-xs px-3 py-1 rounded shadow z-10"
              onClick={loadMore}
              disabled={loadingMore}
            >
              Load older messages
            </button>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Move image preview above the input form */}
        {image && (
          <div className="mb-2 flex items-center gap-2 px-6">
            <Image
              src={image}
              alt="preview"
              width={80}
              height={80}
              className="max-w-[80px] rounded"
            />
            <button
              className="text-red-500 text-xs hover:underline"
              onClick={() => setImage(undefined)}
            >
              Remove
            </button>
          </div>
        )}
        <form
          className="flex gap-2 items-end px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 rounded-b-xl"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            disabled={aiTyping}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="img-upload"
            disabled={aiTyping}
          />
          <label
            htmlFor="img-upload"
            className="cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded border border-gray-300 dark:border-gray-600"
          >
            📷
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={aiTyping}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
