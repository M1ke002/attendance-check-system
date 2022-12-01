const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  enrolledCourses: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "courses",
      },
    ],
    default: [],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

// studentSchema.index({ name: "text", studentId: "text" });

module.exports = mongoose.model("students", studentSchema);
