import blogsApi from "@/api/modules/blogs.api";
import AnimationLoading from "@/components/layouts/AnimationLoading";
import ConfirmDeleteItemModal from "@/components/layouts/ConfirmDeleteItemModal";
import CreateBlogModal from "@/components/layouts/CreateBlogModal";
import EmptyDataButton from "@/components/layouts/EmptyDataButton";
import HomeButton from "@/components/layouts/HomeButton";
import NotFound from "@/components/layouts/NotFound";
import ProtectedPage from "@/components/utils/ProtectedPage";
import { selectUser } from "@/redux/features/userSlice";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function MyBlogs() {
  const { user } = useSelector(selectUser);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [onDeleteProcess, setOnDeleteProcess] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogIdToDelete, setSelectedBlogIdToDelete] = useState(null);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      const { response, error } = await blogsApi.getUserBlogs();
      if (response) {
        setBlogs(response);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) toast.error("Gagal mengambil data blog");
    };
    if (user) fetchUserBlogs();
  }, [user]);

  const handleOpenCreateBlogModal = () => {
    document.getElementById("create_blog_modal").showModal();
  };

  const handleDeleteBlogIconClicked = async (blogId) => {
    setSelectedBlogIdToDelete(blogId);
    document.getElementById("confirm_delete_item_modal").showModal();
  };

  const handleDeleteBlog = async () => {
    if (onDeleteProcess) return;

    setOnDeleteProcess(true);
    const { response, error } = await blogsApi.deleteBlog({
      blogId: selectedBlogIdToDelete,
    });

    if (response) {
      toast.success("Blog berhasil dihapus.");
      setBlogs(blogs.filter((blog) => blog.id !== selectedBlogIdToDelete));
      document.getElementById("confirm_delete_blog_modal").close();
    }
    if (error) toast.error("Gagal menghapus blog");

    setOnDeleteProcess(false);
  };

  return (
    <ProtectedPage>
      {isDataLoaded ? (
        <div className="md:mx-16 md:mt-2">
          <div className="flex justify-between items-center">
            <h1
              className={`text-3xl font-bold ${blogs.length > 1 ? "" : "mt-1"}`}
            >
              Blog Saya
            </h1>

            {blogs.length > 0 ? (
              <button
                onClick={handleOpenCreateBlogModal}
                className="flex items-center bg-teal-500 border-2 border-teal-300 font-semibold text-white px-4 py-2 rounded-md hover:bg-teal-400 hover:border-teal-200 focus:bg-teal-600"
              >
                <IoIosAddCircleOutline className="mr-2 text-2xl" />
                Buat Blog
              </button>
            ) : null}
          </div>

          {blogs.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-base text-black md:text-2xl">
                    <th>No.</th>
                    <th>Gambar</th>
                    <th>Judul</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {blogs.map((blog, index) => (
                    <tr
                      key={blog.id}
                      className="text-base text-black md:text-lg"
                    >
                      <td>{index + 1}</td>
                      <td>
                        <Image
                          width={100}
                          height={100}
                          src={blog.blogImageUrl}
                          alt={blog.title}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </td>
                      <td>{blog.title}</td>
                      <td>
                        <Link
                          href={`/dashboard/my-blogs/${blog.id}`}
                          className="btn text-xl btn-circle btn-ghost"
                        >
                          <FaRegEdit className="text-blue-600 text-2xl" />
                        </Link>
                        <button
                          onClick={() => {
                            handleDeleteBlogIconClicked(blog.id);
                          }}
                          className="btn text-xl btn-circle btn-ghost"
                        >
                          <FaRegTrashAlt className="text-red-600 text-2xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="md:text-base">
                    <th>No.</th>
                    <th>Gambar</th>
                    <th>Judul</th>
                    <th>Aksi</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="flex justify-center items-center flex-col">
              <NotFound />

              <p className="mt-6 text-justify font-bold text-xl md:text-3xl">
                Kamu belum memiliki blog
              </p>

              <EmptyDataButton onClick={handleOpenCreateBlogModal}>
                Yuk buat blog blog pertamamu
              </EmptyDataButton>
            </div>
          )}

          <CreateBlogModal />
          <ConfirmDeleteItemModal
            handleDelete={handleDeleteBlog}
            onDeleteProcess={onDeleteProcess}
            type="blog"
          />
        </div>
      ) : (
        <AnimationLoading />
      )}
    </ProtectedPage>
  );
}
