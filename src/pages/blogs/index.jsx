import blogsApi from "@/api/modules/blogs.api";
import AnimationLoading from "@/components/layouts/AnimationLoading";
import BlogItem from "@/components/layouts/BlogItem";
import NotFound from "@/components/layouts/NotFound";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Blogs() {
  const router = useRouter();
  const { category } = router.query;

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [provincesApi, setProvincesApi] = useState([]);
  const [citiesApi, setCitiesApi] = useState([]);
  const [isCitiesApiLoading, setIsCitiesApiLoading] = useState(false);

  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [filterValue, setFilterValue] = useState({
    category: category || "",
    province: "",
    city: "",
  });

  useEffect(() => {
    const fetchUserBlogs = async () => {
      const { response, error } = await blogsApi.getAllBlogs();
      if (response) {
        setBlogs(response);
        setFilteredBlogs(response);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
      if (error) toast.error("Gagal mengambil data blog");
    };
    fetchUserBlogs();
  }, []);

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
    setFilterValue({ ...filterValue, province: provinceName });

    setIsCitiesApiLoading(true);
    const response = await axios.get(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
    );
    setCitiesApi(response.data);
    setIsCitiesApiLoading(false);
  };

  const handleCitySelectedChange = (e) => {
    const cityName = e.target.options[e.target.selectedIndex].text;
    setFilterValue({ ...filterValue, city: cityName });
  };

  useEffect(() => {
    const filteredData = blogs.filter((blog) => {
      return (
        (filterValue.category === "" ||
          blog.category === filterValue.category) &&
        (filterValue.province === "" ||
          blog.province === filterValue.province) &&
        (filterValue.city === "" || blog.city === filterValue.city)
      );
    });

    // Jika kategori dipilih sebagai "Semua", tampilkan semua data
    const finalFilteredData =
      filterValue.category === "Semua" ? blogs : filteredData;
    setFilteredBlogs(finalFilteredData);
  }, [filterValue, blogs]);

  return isDataLoaded ? (
    <div className="md:mx-16 md:mt-2">
      <h1 className="text-3xl font-bold">Jelajah Budaya</h1>

      <div className="md:flex items-center gap-3 md:mt-2">
        <div className="mt-2 w-full md:mt-0 md:w-1/3">
          <label className="label">
            <span className="label-text text-black text-lg">Kategori</span>
          </label>
          <select
            onChange={(e) => {
              setFilterValue({ ...filterValue, category: e.target.value });
            }}
            name="category"
            className="select select-accent w-full bg-gray-50"
          >
            <option selected>Semua</option>
            <option>Adat Istiadat</option>
            <option>Bahasa</option>
            <option>Makanan Tradisional</option>
          </select>
        </div>

        {/* Mobile View START */}
        <div className="flex gap-2 md:hidden">
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
        {/* Mobile View END */}

        {/* Tab - Desktop View START */}
        <div className="hidden md:inline-block md:w-1/3">
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

        <div className="hidden md:inline-block md:w-1/3">
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
        {/* Tab - Desktop View END */}
      </div>

      {filteredBlogs.length > 0 ? (
        <div className="mt-6 flex flex-col gap-6 md:flex-row">
          {filteredBlogs.map((blog) => (
            <BlogItem key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center flex-col -mt-12">
          <NotFound />

          <p className="mt-6 text-center font-bold mx-8 text-lg md:text-xl">
            Maaf, kriteria blog yang kamu cari tidak ditemukan
          </p>
        </div>
      )}
    </div>
  ) : (
    <AnimationLoading />
  );
}
