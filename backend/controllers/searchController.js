import userModel from "../models/userModel.js";
import PostModel from "../models/postModel.js";


export const searchController = {
  // finds users / posts by name / content / tags
  // limit to 5 results and paginate, sort by last created
  // api/search?query=searchterm
  // api/search?query=searchterm&page=1
  async search(req, res) {
    try {
      const { query, page = 1 } = req.query; // added page parameter
      console.log("Search query:", query);

      // Find users by name
      const users = await userModel.find({
        name: { $regex: query, $options: "i" },
      }).limit(5); // limit to 5 results

      // Find posts by content or tags
      const posts = await PostModel.find({
        $or: [
          { content: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } },
        ],
      })
        .populate("user", "name tags profileImage")
        .sort({ createdAt: -1 }) // sort by last created
        .skip((page - 1) * 5) // paginate
        .limit(5); // limit to 5 results
      const totalPosts = posts.length;
      const totalPages = Math.ceil(totalPosts / 5);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      const nextPage = hasNextPage ? parseInt(page) + 1 : null;
      const previousPage = hasPreviousPage ? parseInt(page) - 1 : null;
      
      const response = {
        users,
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
      console.error("Error searching:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  async getMostUsedTags(req, res) {
    try {
      // get most used tags from posts and users
      const posts = await PostModel.find({}).select("tags");
      const users = await userModel.find({}).select("tags");
      const allTags = [...posts, ...users].reduce((acc, item) => {
        if (item.tags) {
          item.tags.forEach((tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
          });
        }
        return acc;
      }, {});
      const sortedTags = Object.entries(allTags)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10) // get top 10 tags
        .map((tag) => tag[0]); // get only tag names
      return res.status(200).json(sortedTags);
    } catch (error) {
      console.error("Error fetching most used tags:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}