import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { getIO } from './socket.service.js';

export const notifyAll = async (type, title, message, link) => {
  const users = await User.find().select('_id');
  const docs = users.map(u => ({ userId: u._id, type, title, message, link }));
  const saved = await Notification.insertMany(docs);

  const io = getIO();
  if (io) {
    // Emit each notification to its owner's personal room
    for (const notif of saved) {
      io.to(notif.userId.toString()).emit('notification:new', {
        _id: notif._id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        link: notif.link,
        read: false,
        createdAt: notif.createdAt,
      });
    }
  }
};
