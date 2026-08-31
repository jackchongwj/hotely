import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Message from './models/Message.js';
import Notification from './models/Notification.js';

const parseAccessToken = (cookieStr) => {
  if (!cookieStr) return null;
  const match = cookieStr.match(/accessToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

// userId → Set<socketId>
const onlineUsers = new Map();
// userId → { _id, fname, lname, role }
const userInfo = new Map();

export const initSocket = (io) => {
  io.use(async (socket, next) => {
    const token = parseAccessToken(socket.handshake.headers.cookie);
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new Error('User not found'));
      socket.user = { _id: user._id.toString(), fname: user.fname, lname: user.lname, role: user.role };
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  const broadcastOnline = () => {
    const list = [...userInfo.values()];
    io.emit('users:online', list);
  };

  io.on('connection', async (socket) => {
    const { _id, fname, lname, role } = socket.user;

    // Join personal room and the all-channel room
    socket.join(_id);
    socket.join('all');

    // Track presence
    if (!onlineUsers.has(_id)) onlineUsers.set(_id, new Set());
    onlineUsers.get(_id).add(socket.id);
    userInfo.set(_id, { _id, fname, lname, role });
    broadcastOnline();

    // Send last 50 unread notifications on connect
    const notifications = await Notification.find({ userId: _id })
      .sort({ createdAt: -1 }).limit(50);
    socket.emit('notification:history', notifications.reverse());

    // ── Chat ──────────────────────────────────────────────────────────────────

    socket.on('chat:join', ({ channel }) => {
      if (channel === 'all') return;
      if (channel.startsWith('dm_')) {
        const ids = channel.replace('dm_', '').split('_');
        if (ids.includes(_id)) socket.join(channel);
      }
    });

    socket.on('chat:send', async ({ channel, content }) => {
      if (!content?.trim()) return;
      // Validate access
      if (channel !== 'all') {
        if (!channel.startsWith('dm_')) return;
        const ids = channel.replace('dm_', '').split('_');
        if (!ids.includes(_id)) return;
      }
      const msg = await Message.create({ from: _id, channel, content: content.trim() });
      const populated = await msg.populate('from', 'fname lname');
      io.to(channel).emit('chat:message', populated);
    });

    socket.on('chat:history', async ({ channel }) => {
      // Validate access before returning history
      if (channel !== 'all') {
        if (!channel.startsWith('dm_')) return;
        const ids = channel.replace('dm_', '').split('_');
        if (!ids.includes(_id)) return;
        socket.join(channel); // ensure joined for future messages
      }
      const messages = await Message.find({ channel })
        .populate('from', 'fname lname')
        .sort({ createdAt: -1 })
        .limit(50);
      socket.emit('chat:history', { channel, messages: messages.reverse() });
    });

    // ── Notifications ─────────────────────────────────────────────────────────

    socket.on('notification:read', async ({ id }) => {
      await Notification.findOneAndUpdate({ _id: id, userId: _id }, { read: true });
    });

    socket.on('notification:read-all', async () => {
      await Notification.updateMany({ userId: _id, read: false }, { read: true });
    });

    // ── Disconnect ────────────────────────────────────────────────────────────

    socket.on('disconnect', () => {
      const sockets = onlineUsers.get(_id);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(_id);
          userInfo.delete(_id);
        }
      }
      broadcastOnline();
    });
  });
};
