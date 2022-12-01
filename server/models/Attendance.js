const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendanceSchema = new Schema({
  date: {
    type: String,
    required: true,
    default: new Date().toLocaleDateString(), //dd-mm-yyyy
  },
  records: {
    type: [
      {
        student: {
          type: Schema.Types.ObjectId,
          ref: "students",
          required: true,
        },
        present: {
          type: Boolean,
          default: false,
        },
      },
    ],
    default: [],
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "courses",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("attendances", attendanceSchema);
