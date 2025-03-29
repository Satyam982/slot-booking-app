const mongoose = require("mongoose");

const adminsSlotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin-slot-book", adminsSlotSchema);
