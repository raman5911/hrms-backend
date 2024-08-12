const Asset = require("../models/AssetModel");

module.exports.getAll = async (req, res, next) => {
  try {
    const data = await Asset.find({});

    res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching assets", error);
    res.status(500).json({
      message: "Error fetching assets",
      error: error.message,
    });
  }
};
