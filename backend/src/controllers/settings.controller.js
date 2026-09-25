const Settings = require('../models/Settings.model');

// Get settings (create default if none exist)
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// Update settings
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
      await settings.save();
    } else {
      settings = await Settings.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};
