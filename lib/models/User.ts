import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite during hot reloads
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
