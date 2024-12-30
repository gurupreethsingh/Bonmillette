const mongoose = require("mongoose");

const rawMaterialSchema = new mongoose.Schema({
  raw_material_name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity_history: [
    {
      quantity: { type: Number, required: true },
      unit: {
        type: String,
        enum: ["kg", "litre", "pieces", "bags", "boxes", "meters", "other"],
        required: true,
      },
      date: { type: Date, default: Date.now },
    },
  ],
  ordered_history: [
    {
      ordered_date: { type: Date, default: Date.now },
      quantity: { type: Number, required: true },
      total_cost: { type: Number, required: true },
    },
  ],
  reorder_history: [
    {
      reorder_date: { type: Date, default: Date.now },
      quantity: { type: Number, required: true },
    },
  ],
  refilling_history: [
    {
      refilling_date: { type: Date, default: Date.now },
      quantity: { type: Number, required: true },
    },
  ],
  expire_history: [
    {
      expire_date: { type: Date, required: true },
      status: {
        type: String,
        enum: ["expired", "near-expiry"],
        default: "expired",
      },
    },
  ],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  price_per_unit: {
    type: Number,
    required: true,
    min: 0,
  },
  status_history: [
    {
      status: {
        type: String,
        enum: ["ordered", "in-stock", "refilled", "expired"],
      },
      updated_at: { type: Date, default: Date.now },
      notes: { type: String, trim: true },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const RawMaterial = mongoose.model("RawMaterial", rawMaterialSchema);

module.exports = RawMaterial;
