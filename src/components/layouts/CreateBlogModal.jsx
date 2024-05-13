import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../functions/Input";
import axios from "axios";
import LoadingButton from "../functions/LoadingButton";
import { storage } from "@/api/config/firebase.config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import blogsApi from "@/api/modules/blogs.api";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/userSlice";

export default function CreateBlogModal() {
  const router = useRouter();
  const { user } = useSelector(selectUser);

  const [isOnRequest, setIsOnRequest] = useState(false);
  const [provincesApi, setProvincesApi] = useState([]);
  const [citiesApi, setCitiesApi] = useState([]);
  const [isCitiesApiLoading, setIsCitiesApiLoading] = useState(false);
  const [blogImageUpload, setBlogImageUpload] = useState(null);

  const addBlogForm = useFormik({
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
      let newBlogImageUrl = process.env.NEXT_PUBLIC_DEFAULT_BLOG_IMAGE_URL;
      if (blogImageUpload) {
        const storageRef = ref(
          storage,
          `BlogImages/${blogImageUpload.name + v4()}`
        );
        const upload = await uploadBytes(storageRef, blogImageUpload);
        const downloadUrl = await getDownloadURL(upload.ref);
        newBlogImageUrl = downloadUrl;
      }

      const { response, error } = await blogsApi.createBlog({
        userId: user.id,
        title: values.title,
        blogImageUrl: newBlogImageUrl,
        blogContentsId: [],
        category: values.category,
        city: values.city,
        province: values.province,
      });

      if (response) {
        toast.success("Blog berhasil dibuat. Mohon tunggu...");
        document.getElementById("create_blog_modal").close();

        setTimeout(() => {
          router.reload();
          setIsOnRequest(false);
        }, 3000);
      }
      if (error) toast.error(error);
    },
  });

  useEffect(() => {
    const fetchIndonesianTerritoryApi = async () => {
      const response = await axios.get(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      setProvincesApi(response.data);
    };
    fetchIndonesianTerritoryApi();
  }, []);

  const handleProvinceSelectedChange = async (e) => {
    const provinceId = e.target.value;
    const provinceName = e.target.options[e.target.selectedIndex].text;
    addBlogForm.setFieldValue("province", provinceName);

    setIsCitiesApiLoading(true);
    const response = await axios.get(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
    );
    setCitiesApi(response.data);
    setIsCitiesApiLoading(false);
  };

  const handleCitySelectedChange = (e) => {
    const cityName = e.target.options[e.target.selectedIndex].text;
    addBlogForm.setFieldValue("city", cityName);
  };

  return (
    <dialog id="create_blog_modal" className="modal">
      <div className="modal-box bg-gray-100">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-2xl">Buat Blog</h3>

        <form
          onSubmit={addBlogForm.handleSubmit}
          className="mt-3 flex flex-col gap-3"
        >
          <Input
            name="title"
            placeholder="Budaya Indonesia..."
            label="Judul Blog"
            type="text"
            value={addBlogForm.values.title}
            onChange={addBlogForm.handleChange}
            error={
              addBlogForm.touched.title &&
              addBlogForm.errors.title !== undefined
            }
            helperText={addBlogForm.touched.title && addBlogForm.errors.title}
          />

          <div className="w-full">
            <label className="label">
              <span className="label-text text-black text-lg">Kategori</span>
            </label>
            <select
              onChange={(e) => {
                addBlogForm.setFieldValue("category", e.target.value);
              }}
              name="category"
              className="select select-accent w-full bg-gray-50"
            >
              <option disabled selected>
                Kategori
              </option>
              <option>Adat Istiadat</option>
              <option>Bahasa</option>
              <option>Makanan Tradisional</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="label">
                <span className="label-text text-black text-lg">Provinsi</span>
              </label>
              <select
                onChange={handleProvinceSelectedChange}
                name="province"
                className="select select-accent w-full bg-gray-50"
              >
                <option disabled selected>
                  Provinsi
                </option>
                {provincesApi.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/2">
              <label className="label">
                <span className="label-text text-black text-lg">Kota</span>
              </label>
              <select
                disabled={isCitiesApiLoading}
                onChange={handleCitySelectedChange}
                name="city"
                className="select select-accent w-full bg-gray-50"
              >
                <option disabled selected>
                  Kota
                </option>
                {citiesApi.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text text-black text-lg">
                Foto Blog (opsional)
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setBlogImageUpload(e.target.files[0]);
              }}
              className="file-input file-input-bordered file-input-accent w-full bg-gray-50"
            />
          </div>

          <div className="mt-3">
            <LoadingButton loading={isOnRequest}>Buat</LoadingButton>
          </div>
        </form>
      </div>
    </dialog>
  );
}
