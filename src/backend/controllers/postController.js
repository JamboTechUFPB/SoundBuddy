import PostModel from "../models/postModel.js";

export const postController = {
  async createPost(req, res) {
    try {
      const userId = req.user.id ? req.user.id : req.user._id;
      const { content }  = req.body;

      let post = null;

      if (req.file) {
        // could be one of image, video, audio
        const mediaType = req.file.mimetype.split("/")[0]; // image, video, audio
        const mediaUrl = req.file.path.replace(/\\/g, "/"); // Normalize path for cross-platform compatibility
        const mediaName = req.file.filename;
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
      // get 5 most recent posts
      const posts = await PostModel.find().populate("user", "name tags profileImage").sort({ createdAt: -1 }).limit(5);
      return res.status(200).json(posts.map(post => {
        post.user = {
          name: post.user.name,
          tags: post.user.tags,
          profileImage: post.user.profileImage
        };
        return post;
      }));
    } catch (error) {
      console.error("Error fetching posts:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
}