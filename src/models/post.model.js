import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
  {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
],
  },
  {
    timestamps: true,
  },
  
  
);

export const Post = mongoose.model("Post", postSchema);