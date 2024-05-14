import commentsApi from "@/api/modules/comments.api";
import AnimationLoading from "@/components/layouts/AnimationLoading";
import ConfirmDeleteItemModal from "@/components/layouts/ConfirmDeleteItemModal";
import HomeButton from "@/components/layouts/HomeButton";
import NotFound from "@/components/layouts/NotFound";
import ProtectedPage from "@/components/utils/ProtectedPage";
import { selectUser } from "@/redux/features/userSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function MyComments() {
  const router = useRouter();

  const { user } = useSelector(selectUser);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [comments, setComments] = useState([]);
  const [isOnRequest, setIsOnRequest] = useState(false);
  const [selectedCommentIdToDelete, setSelectedCommentIdToDelete] =
    useState(null);

  useEffect(() => {
    const fetchUserComments = async () => {
      const { response, error } = await commentsApi.getUserComments();
      if (response) {
        console.log(response);
        setComments(response);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) toast.error("Gagal mengambil data komentar");
    };
    if (user) fetchUserComments();
  }, [user]);

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

  return (
    <ProtectedPage>
      {isDataLoaded ? (
        <div className="md:mx-16 md:mt-2">
          <h1 className="text-3xl font-bold mt-1">Komentar Saya</h1>

          {comments.length > 0 ? (
            <div className="flex flex-col gap-6 mt-6 md:flex-row">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white shadow-lg border-2 rounded-md p-4 md:w-[32%]"
                >
                  <div className="flex items-start gap-4">
                    <Image
                      src={comment.blog.blogImageUrl}
                      alt="Gambar Blog"
                      width={100}
                      height={100}
                      className="w-1/4 object-contain"
                      onClick={() => {
                        router.push(`/blogs/${comment.blog.id}`);
                      }}
                    />

                    <div className="w-full relative">
                      <button
                        onClick={() =>
                          handleDeleteCommentIconClicked(comment.id)
                        }
                        className="absolute right-0 top-0"
                      >
                        <FaRegTrashAlt className="text-red-600 text-lg" />
                      </button>
                      <Link href={`/blogs/${comment.blog.id}`}>
                        <p className="text-xl font-semibold">
                          {comment.blog.title}
                        </p>
                        <p className="text-xs">{comment.createdAt}</p>
                        <p className="mt-3 text-justify">{comment.text}</p>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center flex-col">
              <NotFound />

              <p className="mt-6 text-center font-bold text-xl md:text-2xl">
                Kamu belum pernah memberikan komentar pada Jelaya
              </p>

              <HomeButton href="/blogs">
                Yuk baca blog dan berikan komentar
              </HomeButton>
            </div>
          )}

          <ConfirmDeleteItemModal
            handleDelete={handleDeleteComment}
            onDeleteProcess={isOnRequest}
            type="komentar"
          />
        </div>
      ) : (
        <AnimationLoading />
      )}
    </ProtectedPage>
  );
}
