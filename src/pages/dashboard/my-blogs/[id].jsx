import blogsApi from "@/api/modules/blogs.api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { IoIosAddCircleOutline } from "react-icons/io";
import ChooseBlogContentTypeModal from "@/components/layouts/ChooseBlogContentTypeModal";
import { FaRegSave } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/api/config/firebase.config";
import { v4 } from "uuid";
import { MdDeleteForever } from "react-icons/md";
import AnimationLoading from "@/components/layouts/AnimationLoading";
import axios from "axios";
import ProtectedPage from "@/components/utils/ProtectedPage";

export default function MyBlogDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [isOnRequest, setIsOnRequest] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [provincesApi, setProvincesApi] = useState([]);
  const [citiesApi, setCitiesApi] = useState([]);
  const [isCitiesApiLoading, setIsCitiesApiLoading] = useState(false);

  const [addBlogContents, setAddBlogContents] = useState([]);
  const [uploadImage, setUploadImage] = useState(undefined);
  const [existingBlogContents, setExistingBlogContents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchUserBlogs = async () => {
      const { response, error } = await blogsApi.getBlogById({ blogId: id });
      if (response) {
        editBlogForm.setValues({
          userId: response.userId,
          title: response.title,
          blogImageUrl: response.blogImageUrl,
          blogContentsId: response.blogContentsId,
          category: response.category,
          city: response.city,
          province: response.province,
        });
        setExistingBlogContents(response.blogContents);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) toast.error("Gagal mengambil data blog");
    };
    if (id) fetchUserBlogs();
  }, [id]);

  useEffect(() => {
    const fetchIndonesianTerritoryApi = async () => {
      const response = await axios.get(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      setProvincesApi(response.data);
    };
    fetchIndonesianTerritoryApi();
  }, []);

  const editBlogForm = useFormik({
    initialValues: {
      userId: "",
      title: "",
      blogImageUrl: "",
      blogContentsId: "",
      category: "",
      city: "",
      province: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Judul harus diisi"),
      category: Yup.string().required("Kategori harus diisi"),
      city: Yup.string().required("Kota harus diisi"),
      province: Yup.string().required("Provinsi harus diisi"),
    }),
    onSubmit: async (values) => {
      if (isOnRequest) return;
      setIsOnRequest(true);

      // Add new blog contents START
      const newBlogContents = [];
      addBlogContents.map((blogContent) => {
        const blogContentElement = document.getElementById(blogContent.id);
        if (blogContent.type === "text") {
          newBlogContents.push({
            type: "text",
            content: blogContentElement.value,
          });
        } else if (blogContent.type === "image") {
          newBlogContents.push({
            type: "image",
            content: uploadImage,
          });
        }
      });
      const isAddContentMode = newBlogContents.length > 0;

      let isSuccessAddNewBlogContents = true;
      for (const blogContent of newBlogContents) {
        if (blogContent.type === "image") {
          const storageRef = ref(
            storage,
            `BlogContentImages/${blogContent.content.name + v4()}`
          );
          const upload = await uploadBytes(storageRef, blogContent.content);
          const downloadUrl = await getDownloadURL(upload.ref);
          blogContent.content = downloadUrl;
        }

        const { response, error } = await blogsApi.addBlogContent({
          blogId: id,
          blogContent: blogContent.content,
          type: blogContent.type,
        });
        if (!response || error) {
          isSuccessAddNewBlogContents = false;
          break;
        }
      }

      if (isAddContentMode) {
        if (isSuccessAddNewBlogContents) {
          toast.success("Konten blog berhasil ditambahkan. Mohon tunggu...");
          setTimeout(() => {
            router.reload();
          }, 3000);
        } else {
          toast.error("Gagal menambahkan konten blog");
        }
      }
      // Add new blog contents END

      // Edit blog START
      if (isEditMode) {
        let isSuccessEditExistingBlogContents = true;

        const { response, error } = await blogsApi.editBlog({
          blogId: id,
          userId: values.userId,
          title: values.title,
          blogImageUrl: values.blogImageUrl,
          blogContentsId: values.blogContentsId,
          category: values.category,
          city: values.city,
          province: values.province,
        });
        if (!response || error) isSuccessEditExistingBlogContents = false;

        for (const blogContent of existingBlogContents) {
          const { response, error } = await blogsApi.editBlogContent({
            blogContentId: blogContent.id,
            blogContent: blogContent.text || blogContent.imageUrl,
            type: blogContent.type,
          });
          if (!response || error) {
            isSuccessEditExistingBlogContents = false;
            break;
          }
        }

        if (isSuccessEditExistingBlogContents) {
          toast.success("Blog berhasil diperbarui. Mohon tunggu...");
          setTimeout(() => {
            router.reload();
          }, 3000);
        }
      }
      // Edit blog END

      setIsOnRequest(false);
    },
  });

  const handleProvinceSelectedChange = async (e) => {
    const provinceId = e.target.value;
    const provinceName = e.target.options[e.target.selectedIndex].text;
    editBlogForm.setFieldValue("province", provinceName);

    setIsCitiesApiLoading(true);
    const response = await axios.get(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
    );
    setCitiesApi(response.data);
    setIsCitiesApiLoading(false);
  };

  const handleCitySelectedChange = (e) => {
    const cityName = e.target.options[e.target.selectedIndex].text;
    editBlogForm.setFieldValue("city", cityName);
  };

  const handleDeleteBlogContent = async (blogId, blogContentId, type) => {
    if (isOnRequest) return;
    setIsOnRequest(true);

    if (!isEditMode) {
      toast.error("Mode edit harus diaktifkan terlebih dahulu");
      setIsOnRequest(false);
      return;
    }

    const { response, error } = await blogsApi.deleteBlogContent({
      blogId,
      blogContentId,
      type,
    });
    if (response) {
      toast.success("Konten blog berhasil dihapus");
      setExistingBlogContents(
        existingBlogContents.filter(
          (existingBlogContent) => existingBlogContent.id !== blogContentId
        )
      );
    }
    if (error) toast.error("Gagal menghapus konten blog");

    setIsOnRequest(false);
  };

  return (
    <ProtectedPage>
      {isDataLoaded ? (
        <ProtectedPage>
          <div className="md:px-12 md:mt-6">
            <div className="mb-6 flex flex-col justify-center items-center">
              <div className="flex ms-auto items-center gap-4">
                <h5 className="font-bold text-xl">Edit Mode</h5>
                <label class="switch">
                  <input
                    class="cb"
                    type="checkbox"
                    onChange={(e) => {
                      setIsEditMode(e.target.checked);
                    }}
                  />
                  <span class="toggle">
                    <span class="left">off</span>
                    <span class="right">on</span>
                  </span>
                </label>
              </div>
            </div>

            <form onSubmit={editBlogForm.handleSubmit}>
              <input
                type="text"
                name="title"
                disabled={!isEditMode}
                placeholder="Budaya Indonesia..."
                value={editBlogForm.values.title}
                onChange={editBlogForm.handleChange}
                className={`w-full bg-white text-black text-2xl text-center font-bold border-2 rounded-md py-2.5 md:text-5xl ${
                  !isEditMode
                    ? "cursor-not-allowed border-white"
                    : "border-teal-500"
                }`}
              />

              {isEditMode ? (
                <>
                  <div className="mt-2 w-full">
                    <label className="label">
                      <span className="label-text text-black text-lg">
                        Kategori
                      </span>
                    </label>
                    <select
                      onChange={(e) => {
                        editBlogForm.setFieldValue("category", e.target.value);
                      }}
                      name="category"
                      className="select select-accent w-full bg-gray-50"
                    >
                      <option selected>{editBlogForm.values.category}</option>
                      <option disabled>---</option>
                      <option>Adat Istiadat</option>
                      <option>Bahasa</option>
                      <option>Makanan Tradisional</option>
                    </select>
                  </div>

                  <div className="mt-2 mb-6 flex gap-2">
                    <div className="w-1/2">
                      <label className="label">
                        <span className="label-text text-black text-lg">
                          Provinsi
                        </span>
                      </label>
                      <select
                        onChange={handleProvinceSelectedChange}
                        name="province"
                        className="select select-accent w-full bg-gray-50"
                      >
                        <option
                          selected
                          disabled={editBlogForm.values.province !== ""}
                        >
                          {editBlogForm.values.province}
                        </option>
                        <option disabled>---</option>
                        {provincesApi.map((province) => (
                          <option key={province.id} value={province.id}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-1/2">
                      <label className="label">
                        <span className="label-text text-black text-lg">
                          Kota
                        </span>
                      </label>
                      <select
                        disabled={isCitiesApiLoading}
                        onChange={handleCitySelectedChange}
                        name="city"
                        className="select select-accent w-full bg-gray-50"
                      >
                        <option selected hidden={citiesApi.length > 0}>
                          {editBlogForm.values.city}
                        </option>
                        <option disabled>---</option>
                        {citiesApi.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : null}

              <div className="flex justify-center">
                <Image
                  src={editBlogForm.values.blogImageUrl}
                  alt={editBlogForm.values.title}
                  width={500}
                  height={500}
                  className="mt-2 w-full h-full object-cover rounded-md md:mt-6 md:w-[75%] md:object-contain"
                />
              </div>

              <div className="mt-8 flex flex-col justify-center items-center gap-5">
                {existingBlogContents.map((blogContent) => {
                  if (blogContent.type === "text") {
                    return (
                      <div
                        key={blogContent.id}
                        className="relative w-full md:w-[75%]"
                      >
                        <MdDeleteForever
                          onClick={() => {
                            handleDeleteBlogContent(
                              blogContent.blogId,
                              blogContent.id,
                              blogContent.type
                            );
                          }}
                          className="absolute top-2 right-2 text-2xl text-red-600"
                        />
                        <textarea
                          defaultValue={blogContent.text}
                          onChange={(e) => {
                            const updatedBlogContents =
                              existingBlogContents.map(
                                (existingBlogContent) => {
                                  if (
                                    existingBlogContent.id === blogContent.id
                                  ) {
                                    return {
                                      ...existingBlogContent,
                                      text: e.target.value,
                                    };
                                  }
                                  return existingBlogContent;
                                }
                              );
                            setExistingBlogContents(updatedBlogContents);
                          }}
                          rows={4}
                          className="textarea textarea-lg w-full bg-white text-black border-teal-400"
                        ></textarea>
                      </div>
                    );
                  } else if (blogContent.type === "image") {
                    return (
                      <div
                        key={blogContent.id}
                        className="relative w-full md:w-[75%] md:object-contain"
                      >
                        <MdDeleteForever
                          onClick={() => {
                            handleDeleteBlogContent(
                              blogContent.blogId,
                              blogContent.id,
                              blogContent.type
                            );
                          }}
                          className="absolute top-2 right-2 text-2xl text-white bg-red-600 rounded p-0.5"
                        />
                        <Image
                          src={blogContent.imageUrl}
                          alt={blogContent.type}
                          width={500}
                          height={500}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    );
                  }
                })}
              </div>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("choose_blog_content_type_modal")
                    .showModal()
                }
                className="mt-4 flex items-center bg-teal-500 text-white px-4 py-2 rounded-md md:mx-[10%]"
              >
                <IoIosAddCircleOutline className="mr-2 text-2xl" />
                Tambah Konten Blog
              </button>

              <div
                id="blog_contents"
                className="mt-4 flex flex-col gap-8 md:items-center md:justify-center"
              ></div>

              <button
                type="submit"
                className={`mt-6 flex items-center bg-teal-500 text-white px-4 py-2 rounded-md w-full justify-center md:w-max md:mx-[10%] ${
                  isOnRequest ? "bg-teal-700" : ""
                }`}
              >
                {!isOnRequest ? (
                  <>
                    <FaRegSave className="mr-2 text-2xl" />
                    Simpan
                  </>
                ) : (
                  <span className="loading loading-bars loading-md"></span>
                )}
              </button>
            </form>

            <ChooseBlogContentTypeModal
              setAddBlogContents={setAddBlogContents}
              uploadImage={uploadImage}
              setUploadImage={setUploadImage}
            />
          </div>
        </ProtectedPage>
      ) : (
        <AnimationLoading />
      )}
    </ProtectedPage>
  );
}
