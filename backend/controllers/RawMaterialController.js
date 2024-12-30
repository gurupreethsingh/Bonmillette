const RawMaterial = require("../models/RawMaterialModel");
const Vendor = require("../models/VendorModel");

// Fetch all vendors (for dropdown selection)
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({}, "vendor_name _id");
    res.status(200).json(vendors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vendors", error: error.message });
  }
};

// Add a new raw material
const addRawMaterial = async (req, res) => {
  try {
    console.log("Received Payload:", req.body);

    // Validate vendor ID
    const vendorExists = await Vendor.findById(req.body.vendor);
    if (!vendorExists) {
      return res.status(400).json({ message: "Invalid Vendor ID" });
    }

    // Create and save raw material
    const rawMaterial = new RawMaterial(req.body);
    await rawMaterial.save();

    res
      .status(201)
      .json({ message: "Raw material added successfully", rawMaterial });
  } catch (error) {
    console.error("Error adding raw material:", error.message);
    res
      .status(500)
      .json({ message: "Error adding raw material", error: error.message });
  }
};

// Update a raw material
const updateRawMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRawMaterial = await RawMaterial.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!updatedRawMaterial) {
      return res.status(404).json({ message: "Raw material not found" });
    }
    res.status(200).json({
      message: "Raw material updated successfully",
      updatedRawMaterial,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating raw material", error: error.message });
  }
};

// Delete a raw material
const deleteRawMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRawMaterial = await RawMaterial.findByIdAndDelete(id);
    if (!deletedRawMaterial) {
      return res.status(404).json({ message: "Raw material not found" });
    }
    res.status(200).json({ message: "Raw material deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting raw material", error: error.message });
  }
};

// View all raw materials
const getAllRawMaterials = async (req, res) => {
  try {
    const rawMaterials = await RawMaterial.find().populate(
      "vendor",
      "vendor_name"
    );
    res.status(200).json(rawMaterials);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching raw materials", error: error.message });
  }
};

// View single raw material
const getRawMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const rawMaterial = await RawMaterial.findById(id).populate(
      "vendor",
      "vendor_name"
    );
    if (!rawMaterial) {
      return res.status(404).json({ message: "Raw material not found" });
    }
    res.status(200).json(rawMaterial);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching raw material", error: error.message });
  }
};

// Count of all raw materials
const getRawMaterialCount = async (req, res) => {
  try {
    const count = await RawMaterial.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error counting raw materials", error: error.message });
  }
};

// Expiry notifications (materials expiring soon within 7 days)
const getExpiringRawMaterials = async (req, res) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const expiringMaterials = await RawMaterial.find({
      expire_date: { $gte: today, $lte: nextWeek },
    });

    res.status(200).json({
      message: "Raw materials expiring soon",
      expiringMaterials,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching expiring raw materials",
      error: error.message,
    });
  }
};

// mail option to send to the vendor if the quantity is less.
const sendReorderEmail = async (req, res) => {
  try {
    const { materialId, reorderDate } = req.body;

    // Fetch raw material details
    const material = await RawMaterial.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: "Raw material not found" });
    }

    // Prepare the email content
    const email = material.vendorEmail; // Assuming vendor email is stored
    const subject = "Reorder Request for Raw Material";
    const message = `Dear Vendor,\n\nWe request to reorder the raw material "${material.name}" by ${reorderDate}.\n\nThank you.`;

    // Use your existing sendEmail helper
    sendEmail(email, subject, message);

    res.status(200).json({ message: "Reorder email sent successfully" });
  } catch (error) {
    console.error("Error sending reorder email:", error);
    res.status(500).json({ message: "Failed to send reorder email", error });
  }
};

// Add or Append to Ordered History
const updateOrderedHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, total_cost, unit } = req.body;

    const updatedMaterial = await RawMaterial.findByIdAndUpdate(
      id,
      {
        $push: {
          ordered_history: {
            ordered_date: new Date(),
            quantity,
            total_cost,
          },
          quantity_history: {
            quantity,
            unit,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ message: "Raw material not found" });
    }

    return res
      .status(200)
      .json({ message: "Ordered history updated", updatedMaterial });
  } catch (error) {
    console.error("Error updating ordered history:", error.message);
    return res.status(500).json({
      message: "Error updating ordered history",
      error: error.message,
    });
  }
};

// Add to Reorder History
const updateReorderHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, unit } = req.body;

    const updatedMaterial = await RawMaterial.findByIdAndUpdate(
      id,
      {
        $push: {
          reorder_history: {
            reorder_date: new Date(),
            quantity,
          },
          quantity_history: {
            quantity,
            unit,
            date: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ message: "Raw material not found" });
    }

    return res
      .status(200)
      .json({ message: "Reorder history updated", updatedMaterial });
  } catch (error) {
    console.error("Error updating reorder history:", error.message);
    return res.status(500).json({
      message: "Error updating reorder history",
      error: error.message,
    });
  }
};

// Add to Refilling History
const updateRefillingHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const updatedMaterial = await RawMaterial.findByIdAndUpdate(
      id,
      {
        $push: {
          refilling_history: {
            refilling_date: new Date(),
            quantity,
          },
        },
      },
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ message: "Raw material not found" });
    }

    return res
      .status(200)
      .json({ message: "Refilling history updated", updatedMaterial });
  } catch (error) {
    console.error("Error updating refilling history:", error.message);
    return res.status(500).json({
      message: "Error updating refilling history",
      error: error.message,
    });
  }
};

// Add or Append to Status History
const updateStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updatedMaterial = await RawMaterial.findByIdAndUpdate(
      id,
      {
        $push: {
          status_history: {
            status,
            updated_at: new Date(),
            notes: notes || "",
          },
        },
      },
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ message: "Raw material not found" });
    }

    return res
      .status(200)
      .json({ message: "Status history updated", updatedMaterial });
  } catch (error) {
    console.error("Error updating status history:", error.message);
    return res.status(500).json({
      message: "Error updating status history",
      error: error.message,
    });
  }
};

// count the number of raw materials.
// Count all raw materials
const countAllRawMaterials = async (req, res) => {
  try {
    const totalRawMaterials = await RawMaterial.countDocuments();
    res.status(200).json({ total: totalRawMaterials });
  } catch (error) {
    res.status(500).json({
      message: "Error counting raw materials",
      error: error.message,
    });
  }
};

module.exports = {
  getAllVendors,
  addRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  getAllRawMaterials,
  getRawMaterialById,
  getRawMaterialCount,
  getExpiringRawMaterials,
  sendReorderEmail,
  updateOrderedHistory,
  updateReorderHistory,
  updateRefillingHistory,
  updateStatusHistory,
  countAllRawMaterials,
};
