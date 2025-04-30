import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["musician", "contractor", "both"],
    default: "musician",
  },
  tags: {
    type: [String],
    default: [],
  },
  profileImage: {
    type: String,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: null,
  }
})

// modificar a saída JSON para remover campos sensíveis
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  return userObject;
}

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const userModel = mongoose.model("User", userSchema);
export default userModel;