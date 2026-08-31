import ActivityLog from '../models/ActivityLog.js';

export const logActivity = (userId, action, description, entityType, entityId) => {
  ActivityLog.create({ userId, action, description, entityType, entityId }).catch(() => {});
};
