"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useRef } from "react";

function Sidebar({
  chatrooms,
  onNewChat,
  activeId,
  onRename,
  onDelete,
}: {
  chatrooms: { id: string; title: string }[];
  onNewChat: () => void;
  activeId?: string;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
        setEditingId(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <aside className="h-full w-64 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-md rounded-xl mt-4">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 rounded-t-xl">
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow"
          onClick={onNewChat}
        >
          + New chat
        </button>
      </div>
      <div className="px-6 pt-4 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
        Chats
      </div>
      <nav className="flex-1 overflow-y-auto px-4">
        <ul className="py-2 space-y-3">
          {chatrooms.length === 0 ? (
            <li className="text-gray-500 dark:text-gray-400 text-center py-4">No chatrooms</li>
          ) : (
            chatrooms.map((c) => (
              <li key={c.id} className="relative group flex items-center">
                {editingId === c.id ? (
                  <>
                    <input
                      className="flex-1 px-2 py-1 rounded border text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && editTitle.trim()) {
                          onRename(c.id, editTitle.trim());
                          setEditingId(null);
                        } else if (e.key === "Escape") {
                          setEditingId(null);
                        }
                      }}
                      autoFocus
                    />
                    <button
                      className="text-green-600 text-xs ml-1"
                      onClick={() => {
                        if (editTitle.trim()) {
                          onRename(c.id, editTitle.trim());
                          setEditingId(null);
                        }
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="text-gray-500 dark:text-gray-400 text-xs ml-1"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <div
                    className={`flex items-center w-full ${
                      activeId === c.id
                        ? "bg-blue-100 dark:bg-gray-800 font-bold rounded-xl shadow-sm"
                        : "hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl"
                    } transition-all duration-150 gap-2 p-1`}
                  >
                    <Link
                      href={`/dashboard/chatroom/${c.id}`}
                      className={`flex-1 block px-4 py-2 truncate text-gray-900 dark:text-gray-100`}
                    >
                      <span className="flex items-center justify-between w-full">
                        <span className="text-gray-900 dark:text-gray-100">{c.title}</span>
                        <button
                          className="ml-2 px-2 py-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent border-none outline-none"
                          onClick={(e) => {
                            e.preventDefault();
                            setMenuOpen(menuOpen === c.id ? null : c.id);
                          }}
                          aria-label="Chatroom options"
                        >
                          &#8942;
                        </button>
                      </span>
                    </Link>
                    {menuOpen === c.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-8 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md w-32"
                      >
                        <button
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                          onClick={() => {
                            setEditingId(c.id);
                            setEditTitle(c.title);
                            setMenuOpen(null);
                          }}
                        >
                          Rename
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            if (confirm("Delete this chatroom?")) {
                              onDelete(c.id);
                              setMenuOpen(null);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </nav>
      <div className="mt-auto border-t border-gray-200 dark:border-gray-800 p-4 text-xs text-gray-500 dark:text-gray-400 rounded-b-xl">
        <Link href="#" className="text-gray-500 dark:text-gray-400">Settings & help</Link>
      </div>
    </aside>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatrooms, setChatrooms] = useState<{ id: string; title: string }[]>(
    []
  );
  const router = useRouter();
  useEffect(() => {
    const stored = localStorage.getItem("chatrooms");
    if (stored) setChatrooms(JSON.parse(stored));
  }, []);
  const handleNewChat = () => {
    const newRoom = { id: uuidv4(), title: `New Chat ${chatrooms.length + 1}` };
    const updated = [newRoom, ...chatrooms];
    setChatrooms(updated);
    localStorage.setItem("chatrooms", JSON.stringify(updated));
    router.push(`/dashboard/chatroom/${newRoom.id}`);
  };
  const handleRename = (id: string, newTitle: string) => {
    const updated = chatrooms.map((c) =>
      c.id === id ? { ...c, title: newTitle } : c
    );
    setChatrooms(updated);
    localStorage.setItem("chatrooms", JSON.stringify(updated));
  };
  const handleDelete = (id: string) => {
    const updated = chatrooms.filter((c) => c.id !== id);
    setChatrooms(updated);
    localStorage.setItem("chatrooms", JSON.stringify(updated));
    // Optionally, remove messages for this chatroom
    localStorage.removeItem(`chatroom_${id}_messages`);
    // If the deleted chatroom is active, redirect to dashboard
    if (
      typeof window !== "undefined" &&
      window.location.pathname.includes(id)
    ) {
      router.push("/dashboard");
    }
  };
  // Get active chatroom id from URL
  let activeId = undefined;
  if (typeof window !== "undefined") {
    const match = window.location.pathname.match(/chatroom\/([^/]+)/);
    if (match) activeId = match[1];
  }
  return (
    <div className="flex h-screen">
      <Sidebar
        chatrooms={chatrooms}
        onNewChat={handleNewChat}
        activeId={activeId}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      <main className="flex-1 flex flex-col bg-white dark:bg-black overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
