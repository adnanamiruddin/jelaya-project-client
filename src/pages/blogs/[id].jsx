import blogsApi from "@/api/modules/blogs.api";
import commentsApi from "@/api/modules/comments.api";
import TextAvatar from "@/components/utils/TextAvatar";
import MotionDiv from "@/components/functions/MotionDiv";
import AnimationLoading from "@/components/layouts/AnimationLoading";
import ConfirmDeleteItemModal from "@/components/layouts/ConfirmDeleteItemModal";
import { selectUser } from "@/redux/features/userSlice";
import { capitalizeText } from "@/utils/utils";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaRegPaperPlane, FaRegTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function BlogDetail() {
  const { user } = useSelector(selectUser);

  const router = useRouter();
  const { id } = router.query;

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [blog, setBlog] = useState({
    userId: "",
    title: "",
    blogImageUrl: "",
    blogContentsId: [],
    blogContents: [],
    category: "",
    city: "",
    province: "",
  });

  const [comments, setComments] = useState([]);
  const [isOnRequest, setIsOnRequest] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedCommentIdToDelete, setSelectedCommentIdToDelete] =
    useState(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      const { response, error } = await blogsApi.getBlogById({ blogId: id });
      if (response) {
        setBlog(response);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) toast.error("Gagal mengambil data blog");
    };

    const fetchComments = async () => {
      const { response, error } = await commentsApi.getCommentsByBlogId({
        blogId: id,
      });
      if (response) setComments(response);
      if (error) toast.error("Gagal mengambil data komentar");
    };

    if (id) {
      fetchComments();
      fetchUserBlogs();
    }
  }, [id]);

  const handlePostNewComment = async () => {
    if (isOnRequest) return;
    if (!newComment) {
      toast.error(
        "Komentar tidak boleh kosong. Silahkan mengisi komentar terlebih dahulu ^_^"
      );
      return;
    }

    setIsOnRequest(true);

    const { response, error } = await commentsApi.createComment({
      blogId: id,
      text: newComment,
    });
    if (response) {
      toast.success("Komentar berhasil ditambahkan");
      setNewComment("");

      commentsApi.getCommentsByBlogId({ blogId: id }).then(({ response }) => {
        if (response) setComments(response);
      });
    }
    if (error) toast.error("Gagal menambahkan komentar");

    setIsOnRequest(false);
  };

  const handleDeleteCommentIconClicked = (commentId) => {
    setSelectedCommentIdToDelete(commentId);
    document.getElementById("confirm_delete_item_modal").showModal();
  };

  const handleDeleteComment = async () => {
    if (isOnRequest) return;

    setIsOnRequest(true);
    const { response, error } = await commentsApi.deleteComment({
      commentId: selectedCommentIdToDelete,
    });

    if (response) {
      toast.success("Komentar berhasil dihapus");
      setComments(
        comments.filter((comment) => comment.id !== selectedCommentIdToDelete)
      );
      document.getElementById("confirm_delete_item_modal").close();
    }
    if (error) toast.error("Gagal menghapus komentar");

    setIsOnRequest(false);
  };

  return isDataLoaded ? (
    <div>
      <h1 className="w-full font-bold text-3xl text-center md:mt-6 md:text-5xl">
        {blog.title}
      </h1>

      <MotionDiv y={-100}>
        <div className="flex justify-center">
          <Image
            src={blog.blogImageUrl}
            alt={blog.title}
            width={500}
            height={500}
            className="mt-4 w-full h-full object-cover rounded-md md:mt-6 md:w-[75%] md:object-contain"
          />
        </div>
      </MotionDiv>

      <div className="mt-6 flex flex-col justify-center items-center gap-5">
        {blog.blogContents.map((blogContent) => {
          if (blogContent.type === "text") {
            return (
              <p key={blogContent.id} className="text-justify md:w-[75%]">
                {blogContent.text}
              </p>
            );
          } else if (blogContent.type === "image") {
            return (
              <Image
                key={blogContent.id}
                src={blogContent.imageUrl}
                alt={blogContent.type}
                width={500}
                height={500}
                className="w-full h-full object-cover rounded-md md:w-[75%] md:object-contain"
              />
            );
          }
        })}
      </div>

      <MotionDiv x={-100}>
        <div className="mt-6 md:flex md:justify-center md:items-center">
          <div className="flex flex-col text-sm md:w-[75%]">
            <p>#{blog.category}</p>
            <p>#{capitalizeText(blog.province)}</p>
            <p>#{capitalizeText(blog.city)}</p>
          </div>
        </div>
      </MotionDiv>

      <div className="mt-6 md:flex md:justify-center md:items-center">
        <h1 className="text-2xl font-bold md:w-[75%]">Komentar</h1>
      </div>

      <div className="mt-4 flex flex-col gap-6 mb-4 md:items-center">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-4 md:w-[75%]">
            <TextAvatar
              firstName={comment.user.firstName}
              lastName={comment.user.lastName}
            />

            <div className="w-full relative">
              {user && user.id === comment.user.id ? (
                <button
                  onClick={() => handleDeleteCommentIconClicked(comment.id)}
                  className="absolute right-0 top-0"
                >
                  <FaRegTrashAlt className="text-red-600" />
                </button>
              ) : null}
              <p className="text-lg font-medium">
                {comment.user.firstName + " " + comment.user.lastName}
              </p>
              <p className="text-xs">{comment.createdAt}</p>
              <p className="mt-3 text-justify">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {user ? (
        <div className="mt-8 md:flex md:justify-center md:items-center">
          <div className="border-t border-gray-300 pt-3 flex items-start gap-3 md:w-[75%]">
            <TextAvatar firstName={user.firstName} lastName={user.lastName} />

            <div className="w-full">
              <p className="text-lg font-medium">
                {user.firstName + " " + user.lastName}
              </p>
              <textarea
                value={newComment}
                s
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tulis komentar disini..."
                rows={2}
                className="mt-4 textarea w-full bg-white text-black border border-teal-400 focus:border-teal-300 focus:border-2"
              ></textarea>
              <button
                disabled={isOnRequest}
                onClick={handlePostNewComment}
                className={`mt-3 p-2.5 flex items-center gap-2 rounded-md bg-teal-500 border-0 text-white font-semibold text-lg ${
                  isOnRequest ? "brightness-75 cursor-not-allowed" : ""
                }`}
              >
                {!isOnRequest ? (
                  <>
                    <FaRegPaperPlane className="me-1" />
                    Tambah
                  </>
                ) : (
                  <span className="loading loading-bars loading-md mx-8"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDeleteItemModal
        handleDelete={handleDeleteComment}
        onDeleteProcess={isOnRequest}
        type="komentar"
      />
    </div>
  ) : (
    <AnimationLoading />
  );
}
