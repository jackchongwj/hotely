import User from "../models/User.js";
import Room from "../models/Room.js";
import Reservation from "../models/Reservation.js";

export const dashboard = async (req, res) => {
  try {
    // Retrieve user details from the database using the authenticated user ID
    const user = await User.findById(req.user.id);

    // Send user details to the dashboard view
    res.status(200).json({
      user: {
        displayName: user.fname,
        id: user._id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOccupancy = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments(); // Get the total number of rooms
    const occupiedRooms = await Room.countDocuments({ roomStatus: "Occupied" }); // Get the count of occupied rooms

    const occupancyPercentage = (occupiedRooms / totalRooms) * 100;

    res.status(200).json({
      total: totalRooms,
      occupied: occupiedRooms,
      rate: Math.round(occupancyPercentage),
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching room occupancy data." });
  }
};

export const getCurrentGuests = async (req, res) => {
  try {
    const today = new Date();

    const currentGuestsData = await Reservation.aggregate([
      {
        $match: {
          checkedIn: true,
          checkedOut: false,
        },
      },
      {
        $group: {
          _id: null,
          totalAdults: { $sum: "$numAdults" },
          totalChildren: { $sum: "$numChildren" },
          totalGuests: { $sum: { $add: ["$numAdults", "$numChildren"] } }, // Total guests = adults + children
        },
      },
    ]);

    const { totalAdults = 0, totalChildren = 0, totalGuests = 0 } = currentGuestsData[0] || {};

    res.status(200).json({ count: totalGuests, adults: totalAdults, children: totalChildren });
  } catch (error) {
    res.status(500).json({ error: "Error fetching current guests data." });
  }
};



export const getExpectedArrivals = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'

    const expectedArrivals = await Reservation.find({
      arrivalDate: { $eq: new Date(today) }, // Match today's arrival date
      checkedIn: false, // Only include reservations that haven't checked in
    });

    res.status(200).json({ count: expectedArrivals.length });
  } catch (error) {
    res.status(500).json({ error: "Error fetching expected arrivals data." });
  }
};

export const getExpectedDepartures = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'

    const expectedDepartures = await Reservation.find({
      departureDate: { $eq: new Date(today) }, // Match today's departure date
      checkedOut: false, // Only include reservations that haven't checked out
    });

    res.status(200).json({ count: expectedDepartures.length });
  } catch (error) {
    res.status(500).json({ error: "Error fetching expected departures data." });
  }
};


export const getDailyRevenue = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await Reservation.aggregate([
      {
        $match: {
          checkedIn: true,
          checkedOut: true,
          departureDate: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $lookup: {
          from: "roomdetails",
          localField: "roomType",
          foreignField: "_id",
          as: "roomInfo",
        },
      },
      { $unwind: "$roomInfo" },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $multiply: ["$daysOfStay", "$roomInfo.price"] } },
        },
      },
    ]);

    res.status(200).json({ revenue: result[0]?.revenue ?? 0 });
  } catch (error) {
    res.status(500).json({ error: "Error calculating daily revenue" });
  }
};
