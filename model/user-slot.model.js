const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: "slot-book-admin", default: null },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Booked"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("slot-book-user", slotSchema);
