import Housekeeping from "../models/Housekeeping.js";
import Room from "../models/Room.js";
import { notifyAll } from "../services/notification.service.js";

export const createTask = async (req, res) => {
  try {
    const { type, description, status, priority, assignedTo, roomId, dueDate } = req.body;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    const newTask = new Housekeeping({ type, description, status, priority, assignedTo, roomId, dueDate });
    await newTask.save();

    notifyAll('housekeeping_created', 'Housekeeping Task',
      `New ${priority?.toLowerCase() ?? ''} priority task: ${type} for Room #${room.roomNumber}`,
      '/rooms/housekeeping').catch(() => {});

    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const tasks = await Housekeeping.find(filter).populate("assignedTo roomId");
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

export const getTasksByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;
    const tasks = await Housekeeping.find({ roomId }).populate("assignedTo");
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks for room:", error);
    res.status(500).json({ error: "Failed to fetch tasks for room" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const before = await Housekeeping.findById(id);

    const updatedTask = await Housekeeping.findByIdAndUpdate(id, req.body, { new: true })
      .populate("assignedTo roomId");

    if (!updatedTask) return res.status(404).json({ error: "Task not found" });

    // Notify when status transitions to Completed
    if (before?.status !== 'Completed' && updatedTask.status === 'Completed') {
      const roomNum = updatedTask.roomId?.roomNumber ?? '?';
      notifyAll('housekeeping_completed', 'Housekeeping Completed',
        `Task completed: ${updatedTask.type} for Room #${roomNum}`,
        '/rooms/housekeeping').catch(() => {});
    }

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Housekeeping.findByIdAndDelete(id);
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
