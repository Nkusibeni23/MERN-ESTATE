import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
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
    avatar: {
      type: String,
      default:
        "https://cdn11.bigcommerce.com/s-balh3740/images/stencil/1280x1280/products/38542/73266/hasbulla_magomedov__37678.1637500127.jpg?c=2",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
