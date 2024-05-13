import privateClient from "../clients/private.client";
import publicClient from "../clients/public.client";

const commentsEndpoint = {
  comments: "/comments",
  commentsById: ({ id }) => `/comments/${id}`,
};

const commentsApi = {
  createComment: async ({ blogId, text }) => {
    try {
      const response = await privateClient.post(commentsEndpoint.comments, {
        blogId,
        text,
      });
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getCommentsByBlogId: async ({ blogId }) => {
    try {
      const response = await publicClient.get(
        commentsEndpoint.commentsById({ id: blogId })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  deleteComment: async ({ commentId }) => {
    try {
      const response = await privateClient.delete(
        commentsEndpoint.commentsById({ id: commentId })
      );
      return { response };
    } catch (error) {
      return { error };
    }
  },

  getUserComments: async () => {
    try {
      const response = await privateClient.get(commentsEndpoint.comments);
      return { response };
    } catch (error) {
      return { error };
    }
  },
};

export default commentsApi;
