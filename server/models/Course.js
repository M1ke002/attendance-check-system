const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  students: {
    //students of that year
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "students",
      },
    ],
    default: [],
  },
  attendances: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "attendances",
      },
    ],
    default: [],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

module.exports = mongoose.model("courses", courseSchema);
