import privateClient from "../clients/private.client";
import publicClient from "../clients/public.client";

const blogsEndpoint = {
  blogs: "/blogs",
  blogById: ({ blogId }) => `/blogs/${blogId}`,
  userBlogs: "/blogs/user-blogs",
  blogContentById: ({ blogId }) => `/blogs/blog-content/${blogId}`,
};

const blogsApi = {
  createBlog: async ({
    userId,
    title,
    blogImageUrl,
    blogContentsId,
    category,
    city,
    province,
  }) => {
    try {
      const response = await privateClient.post(blogsEndpoint.blogs, {
        userId,
        title,
        blogImageUrl,
        blogContentsId,
        category,
        city,
        province,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getUserBlogs: async () => {
    try {
      const response = await privateClient.get(blogsEndpoint.userBlogs);
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getAllBlogs: async () => {
    try {
      const response = await publicClient.get(blogsEndpoint.blogs);
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getBlogById: async ({ blogId }) => {
    try {
      const response = await publicClient.get(
        blogsEndpoint.blogById({ blogId })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  editBlog: async ({
    blogId,
    userId,
    title,
    blogImageUrl,
    blogContentsId,
    category,
    city,
    province,
  }) => {
    try {
      const response = await privateClient.put(
        blogsEndpoint.blogById({ blogId }),
        {
          userId,
          title,
          blogImageUrl,
          blogContentsId,
          category,
          city,
          province,
        }
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  deleteBlog: async ({ blogId }) => {
    try {
      const response = await privateClient.delete(
        blogsEndpoint.blogById({ blogId })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  addBlogContent: async ({ blogId, blogContent, type }) => {
    try {
      const response = await privateClient.post(
        blogsEndpoint.blogContentById({ blogId }),
        {
          blogContent,
          type,
        }
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  editBlogContent: async ({ blogContentId, blogContent, type }) => {
    try {
      const response = await privateClient.put(
        blogsEndpoint.blogContentById({
          blogId: blogContentId,
        }),
        {
          blogContent,
          type,
        }
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  deleteBlogContent: async ({ blogId, blogContentId, type }) => {
    try {
      const response = await privateClient.delete(
        blogsEndpoint.blogContentById({
          blogId,
        }),
        {
          data: {
            blogContentId,
            type,
          },
        }
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default blogsApi;
