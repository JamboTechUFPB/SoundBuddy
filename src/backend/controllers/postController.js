import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";

export const postController = {
  async createPost(req, res) {
    try {
      const userId = req.user.id ? req.user.id : req.user._id;
      const { content }  = req.body;

      let post = null;

      if (req.file) {
        // could be one of image, video, audio
        const mediaType = req.file.mimetype.split("/")[0]; // image, video, audio
        const mediaName = req.file.filename;
        // new media url will be 'data/uploads/medianame.ext'
        const mediaUrl = `/data/uploads/${mediaName}`;
        post = new PostModel({
          content: content,
          user: userId,
          media: {
            type: mediaType,
            url: mediaUrl,
            name: mediaName,
          }
        });
      } else {
        console.log("No media file provided");
        post = new PostModel({
          content: content,
          user: userId,
          media: null,
        });
      }
      // Save the post to the database
      await post.save();

      return res.status(201).json(await post.populate("user", "name tags profileImage"));
    } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getPosts(req, res) {
    try {
      // logica de pageamento e limite
      // limite de no máximo 10, mas o usuário pode pedir menos
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;
      
      const posts = await PostModel.find({})
        .populate("user", "name tags profileImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      const totalPosts = await PostModel.countDocuments({});
      const totalPages = Math.ceil(totalPosts / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      const nextPage = hasNextPage ? page + 1 : null;
      const previousPage = hasPreviousPage ? page - 1 : null;
      const response = {
        posts,
        totalPosts,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching posts:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  async getUserPosts(req, res) {
    try {
      const userId = req.user.id ? req.user.id : req.user._id;
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;

      const posts = await PostModel.find({ user: userId })
        .populate("user", "name tags profileImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalPosts = await PostModel.countDocuments({ user: userId });
      const totalPages = Math.ceil(totalPosts / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      const nextPage = hasNextPage ? page + 1 : null;
      const previousPage = hasPreviousPage ? page - 1 : null;
      const response = {
        posts,
        totalPosts,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  async getPublicUserPosts(req, res) {
    try {
      // get public user posts from username
      const { username } = req.query;
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
      const user = await UserModel.findOne({
        username: username
      })
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1) * limit;
      const posts = await PostModel.find({ user: user._id })
        .populate("user", "name tags profileImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const totalPosts = await PostModel.countDocuments({ user: user._id });
      const totalPages = Math.ceil(totalPosts / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      const nextPage = hasNextPage ? page + 1 : null;
      const previousPage = hasPreviousPage ? page - 1 : null;
      const response = {
        posts,
        totalPosts,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
      };
      return res.status(200).json(response);

    } catch (error) {
      console.error("Error fetching public user posts:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}