import React, { useEffect, useRef, useState } from 'react';
import { MessageSquareIcon, XIcon, SendIcon, HashIcon, SearchIcon } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { staffApi, StaffMember } from '../../services/api';

const initials = (u: { fname: string; lname: string }) =>
  `${u.fname[0]}${u.lname[0]}`.toUpperCase();

const msgTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const dmChannel = (a: string, b: string) =>
  `dm_${[a, b].sort().join('_')}`;

export default function ChatWidget() {
  const { user } = useAuth();
  const { onlineUsers, messages, unreadCounts, sendMessage, fetchHistory, clearUnread } = useSocket();

  const [open, setOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('all');
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [allStaff, setAllStaff] = useState<StaffMember[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);
  const activeMessages = messages[activeChannel] ?? [];
  const onlineIds = new Set(onlineUsers.map(u => u._id));

  // Load full staff list once
  useEffect(() => {
    staffApi.getList()
      .then(({ staff }) => setAllStaff(staff.filter(s => s._id !== user?._id)))
      .catch(() => {});
  }, [user?._id]);

  // Fetch history when switching channels or opening
  useEffect(() => {
    if (!open) return;
    fetchHistory(activeChannel);
    clearUnread(activeChannel);
  }, [activeChannel, open]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length]);

  const openChannel = (ch: string) => {
    setActiveChannel(ch);
    clearUnread(ch);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(activeChannel, input.trim());
    setInput('');
  };

  const channelLabel = (ch: string) => {
    if (ch === 'all') return '# All Staff';
    const otherId = ch.replace('dm_', '').split('_').find(id => id !== user?._id);
    const other = allStaff.find(s => s._id === otherId);
    return other ? `${other.fname} ${other.lname}` : 'Direct Message';
  };

  // Filter staff for sidebar search
  const q = search.toLowerCase();
  const showAll = !q || 'all'.includes(q);
  const filteredStaff = q
    ? allStaff.filter(s => `${s.fname} ${s.lname}`.toLowerCase().includes(q))
    : allStaff;

  // Sort: online first, then alphabetically
  const sortedStaff = [...filteredStaff].sort((a, b) => {
    const aOnline = onlineIds.has(a._id) ? 0 : 1;
    const bOnline = onlineIds.has(b._id) ? 0 : 1;
    if (aOnline !== bOnline) return aOnline - bOnline;
    return `${a.fname} ${a.lname}`.localeCompare(`${b.fname} ${b.lname}`);
  });

  if (!user) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-colors"
        aria-label="Toggle chat"
      >
        {open ? <XIcon className="w-5 h-5" /> : <MessageSquareIcon className="w-5 h-5" />}
        {!open && totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-40 w-[420px] h-[500px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-blue-600 text-white flex items-center justify-between shrink-0">
            <span className="font-semibold text-sm">Team Chat</span>
            <button onClick={() => setOpen(false)} className="p-0.5 hover:bg-blue-500 rounded">
              <XIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Channel sidebar */}
            <div className="w-36 shrink-0 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col min-h-0">
              {/* Search */}
              <div className="px-2 pt-2 pb-1 shrink-0">
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-6 pr-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide py-1">
                {/* All channel */}
                {showAll && (
                  <button
                    onClick={() => openChannel('all')}
                    className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md mx-1 transition-colors ${
                      activeChannel === 'all'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    style={{ width: 'calc(100% - 8px)' }}
                  >
                    <HashIcon className="w-3 h-3 shrink-0" />
                    <span className="truncate flex-1 text-left">All</span>
                    {(unreadCounts['all'] ?? 0) > 0 && activeChannel !== 'all' && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center shrink-0 font-bold">
                        {unreadCounts['all']}
                      </span>
                    )}
                  </button>
                )}

                {/* Staff list */}
                {sortedStaff.length > 0 && (
                  <>
                    <p className="px-2 pt-2 pb-1 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                      Staff
                    </p>
                    {sortedStaff.map(s => {
                      const ch = dmChannel(user._id, s._id);
                      const unread = unreadCounts[ch] ?? 0;
                      const isOnline = onlineIds.has(s._id);
                      return (
                        <button
                          key={s._id}
                          onClick={() => openChannel(ch)}
                          className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-xs rounded-md mx-1 transition-colors ${
                            activeChannel === ch
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          style={{ width: 'calc(100% - 8px)' }}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isOnline ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
                          <span className="truncate flex-1 text-left">{s.fname} {s.lname}</span>
                          {unread > 0 && activeChannel !== ch && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center shrink-0 font-bold">
                              {unread}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </>
                )}

                {sortedStaff.length === 0 && !showAll && (
                  <p className="px-2 py-3 text-xs text-gray-400 text-center">No results</p>
                )}
              </div>
            </div>

            {/* Message area */}
            <div className="flex-1 flex flex-col min-h-0 min-w-0">
              {/* Channel title */}
              <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 shrink-0">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                  {channelLabel(activeChannel)}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto scrollbar-hide overflow-x-hidden px-3 py-2 space-y-3">
                {activeMessages.length === 0 ? (
                  <p className="text-center text-xs text-gray-400 dark:text-gray-500 pt-8">No messages yet. Say hello!</p>
                ) : activeMessages.map((msg, i) => {
                  const isMe = msg.from._id === user._id;
                  const showName = !isMe && (i === 0 || activeMessages[i - 1]?.from._id !== msg.from._id);
                  return (
                    <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {showName && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 mb-0.5 px-1">
                          {msg.from.fname} {msg.from.lname}
                        </span>
                      )}
                      <div className="flex items-end gap-1.5 max-w-[85%]">
                        {!isMe && (
                          <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shrink-0 self-end">
                            {initials(msg.from)}
                          </div>
                        )}
                        <div className={`px-3 py-1.5 rounded-2xl text-sm break-words min-w-0 ${
                          isMe
                            ? 'bg-blue-600 text-white rounded-br-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 px-1 mt-0.5">
                        {msgTime(msg.createdAt)}
                      </span>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="flex items-center gap-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 shrink-0">
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1.5 text-sm outline-none placeholder-gray-400"
                  placeholder="Type a message…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors"
                >
                  <SendIcon className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
