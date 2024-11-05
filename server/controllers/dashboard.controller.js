import User from "../models/User.js";
import Room from "../models/Room.js";
import Reservation from "../models/Reservation.js";

export const dashboard = async (req, res) => {
  try {
    // Retrieve user details from the database using the authenticated user ID
    const user = await User.findById(req.user);

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
      totalRooms,
      occupiedRooms,
      occupancyPercentage: Math.round(occupancyPercentage),
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
          arrivalDate: { $lte: today },
          departureDate: { $gt: today }, // Ensures the reservation hasn't checked out
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

    res.status(200).json({
      totalAdults,
      totalChildren,
      totalGuests,
    });
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

    res.status(200).json({
      totalArrivals: expectedArrivals.length, // Return the count of expected arrivals
    });
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

    res.status(200).json({
      totalDepartures: expectedDepartures.length, // Return the count of expected departures
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching expected departures data." });
  }
};


export const getDailyRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dailyRevenue = await Reservation.aggregate([
      {
        $match: {
          checkedIn: true,
          checkedOut: true,
          departureDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      // Lookup RoomDetails to get the room price
      {
        $lookup: {
          from: "roomdetails", // Collection name for RoomDetails
          localField: "roomType",
          foreignField: "_id",
          as: "roomInfo",
        },
      },
      // Unwind roomInfo array to access room price
      { $unwind: "$roomInfo" },
      // Calculate revenue for each reservation
      {
        $project: {
          reservationDate: { $dateToString: { format: "%Y-%m-%d", date: "$departureDate" } },
          revenue: { $multiply: ["$daysOfStay", "$roomInfo.price"] },
        },
      },
      // Group by reservation date and sum the revenue
      {
        $group: {
          _id: "$reservationDate",
          totalRevenue: { $sum: "$revenue" },
        },
      },
      // Sort by date
      { $sort: { _id: 1 } },
    ]);

    // Send the response back to the client
    res.status(200).json(dailyRevenue);
  } catch (error) {
    console.error("Error calculating daily revenue:", error);
    res.status(500).json({ error: "Error calculating daily revenue" });
  }
};
