const moment = require("moment");
const userSlotModel = require("../model/user-slot.model");
const adminSlotModel = require("../model/admin-slot-model");

const userController = {};

userController.slotBookByUser = async (req, res) => {
  try {
    const { startTime, endTime, date } = req.body;
    const { userId } = req.user;

    const today = moment().startOf("day");
    const maxDate = moment().add(7, "days").endOf("day");
    const requestedDate = moment(date);

    if (requestedDate.isBefore(today) || requestedDate.isAfter(maxDate)) {
      return res.status(400).json({
        msg: `Date must be between today and a maximum of 7 days ahead.`,
      });
    }

    await userSlotModel.create({
      userId,
      startTime: startTime,
      endTime: endTime,
      date: date,
    });

    return res.status(201).json({ msg: "Slot added successfully." });
  } catch (e) {
    console.log("e", e);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

userController.slotBookByAdmin = async (req, res) => {
  try {
    const { userId, date, startTime, endTime } = req.body;

    // Check whether there are any available slot on given date

    const availableSlot = await userSlotModel.findOne({
      userId,
      date: moment(date).startOf("day").format("YYYY/MM/DD")
    });

    if(!availableSlot){
        return res.status(400).json({
            msg: "User haven't book a slot on this date.",
        });
    }

    // check if the startTime and endTime format is valid or not 

    const start = moment(startTime, "hh:mm A");
    const end = moment(endTime, "hh:mm A");

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({
        msg: "Invalid time format. Please use the correct time format (e.g., 12:00 PM).",
      });
    }

    // check if slot booked by admin is between the startTime and endTime or not

    const userSlotStartTime = moment(availableSlot.startTime, "hh:mm A");
    const userSlotEndTime = moment(availableSlot.endTime, "hh:mm A");

    if (start.isBefore(userSlotStartTime) || end.isAfter(userSlotEndTime)) {
        return res.status(400).json({
            msg: `The slot must be between ${availableSlot.startTime} and ${availableSlot.endTime}.`
        });
    }
    
    const existingSlot = await adminSlotModel.findOne({
      userId,
      date: moment(date).startOf("day").toDate(),
    });

    // If a slot already exists for this user on the same date
    if (existingSlot) {
      return res.status(400).json({
        msg: "A slot already exists for this user on the given date.",
      });
    }

    //check a slot between time period is already assigned to another user by admin.
    const existingBooking = await adminSlotModel.findOne({
        date: moment(date).startOf("day").format("YYYY/MM/DD"),
        $or: [
            {
                // Case: Overlapping with an existing booking
                startTime: { $lte: end.toDate() }, 
                endTime: { $gte: start.toDate() }  
            }
        ]
    });    

    if (existingBooking) {
        return res.status(400).json({
            msg: `The slot from ${startTime} to ${endTime} is already booked by another user.`
        });
    }

    const duration = moment.duration(end.diff(start)); // Duration between endTime and startTime    

    if (duration._data.minutes != 30) {
      return res.status(400).json({
        msg: "The difference between startTime and endTime must be exactly 30 minutes.",
      });
    }

    const adminSlot = await adminSlotModel.create({
      userId,
      date,
      startTime,
      endTime,
      addedBy: req.user.userId,
    });

    // update the slot id an status in userslot table

    await userSlotModel.findOneAndUpdate(
        { userId, date },
        { 
            $set: {
                status: "Booked",  
                slotId: adminSlot._id 
            }
        },
        { new: true }  
    );

    return res.status(500).json({ msg: "Admin have added slot succesfully." });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = userController;
