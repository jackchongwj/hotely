import HotelSettings from '../models/HotelSettings.js';

export const getHotelSettings = async (req, res) => {
  try {
    let settings = await HotelSettings.findOne().lean();
    if (!settings) {
      settings = await HotelSettings.create({});
    }
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHotelSettings = async (req, res) => {
  try {
    let settings = await HotelSettings.findOne();
    if (!settings) settings = new HotelSettings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json({ message: 'Settings updated', settings });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
