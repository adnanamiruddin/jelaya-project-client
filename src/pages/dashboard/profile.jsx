import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "@/components/functions/Input";
import LoadingButton from "@/components/functions/LoadingButton";
import userApi from "@/api/modules/users.api";
import { selectUser, setUser } from "@/redux/features/userSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { MdErrorOutline } from "react-icons/md";
import ProtectedPage from "@/components/utils/ProtectedPage";
import AnimationLoading from "@/components/layouts/AnimationLoading";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector(selectUser);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isOnRequest, setIsOnRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        profileForm.setValues(user);
        setTimeout(() => {
          setIsDataLoaded(true);
        }, 3000);
      }
    };
    fetchUserProfile();
  }, [user]);

  const profileForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      age: "",
      city: "",
      address: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Nama depan harus diisi"),
      lastName: Yup.string().required("Nama belakang harus diisi"),
      age: Yup.number().required("Umur harus diisi"),
      city: Yup.string().required("Kota harus diisi"),
      address: Yup.string().required("Alamat harus diisi"),
      phoneNumber: Yup.string().required("Nomor telepon (WA) harus diisi"),
    }),
    onSubmit: async (values) => {
      if (isOnRequest) return;
      setIsOnRequest(true);
      const { response, error } = await userApi.updateProfile(values);
      setIsOnRequest(false);
      if (response) {
        profileForm.resetForm();
        dispatch(setUser(response));
        toast.success("Profil berhasil diperbarui");
        router.push("/");
      }
      if (error) setErrorMessage(error.message);
    },
  });

  return (
    <ProtectedPage>
      {isDataLoaded ? (
        <div className="md:mx-64 md:mt-10">
          <h2 className="text-3xl font-bold mt-1 mb-3">Profil</h2>

          <form
            className="flex flex-col gap-3 items-center w-full md:px-20 md:py-8 md:mt-4 md:rounded-md md:bg-gray-100 md:border-2 md:border-gray-300 md:shadow-lg"
            onSubmit={profileForm.handleSubmit}
          >
            <div className="flex gap-3 w-full">
              <Input
                label="Nama Depan"
                name="firstName"
                placeholder="Nama Depan"
                type="text"
                value={profileForm.values.firstName}
                onChange={profileForm.handleChange}
                error={
                  profileForm.touched.firstName &&
                  profileForm.errors.firstName !== undefined
                }
                helperText={
                  profileForm.touched.firstName && profileForm.errors.firstName
                }
              />
              <Input
                label="Nama Belakang"
                name="lastName"
                placeholder="Nama Belakang"
                type="text"
                value={profileForm.values.lastName}
                onChange={profileForm.handleChange}
                error={
                  profileForm.touched.lastName &&
                  profileForm.errors.lastName !== undefined
                }
                helperText={
                  profileForm.touched.lastName && profileForm.errors.lastName
                }
              />
            </div>

            <Input
              label="Umur"
              name="age"
              placeholder="18"
              type="number"
              value={profileForm.values.age}
              onChange={profileForm.handleChange}
              error={
                profileForm.touched.age && profileForm.errors.age !== undefined
              }
              helperText={profileForm.touched.age && profileForm.errors.age}
            />
            <Input
              label="Asal Kota"
              name="city"
              placeholder="Makassar"
              type="text"
              value={profileForm.values.city}
              onChange={profileForm.handleChange}
              error={
                profileForm.touched.city &&
                profileForm.errors.city !== undefined
              }
              helperText={profileForm.touched.city && profileForm.errors.city}
            />
            <Input
              label="Alamat"
              name="address"
              placeholder="Jl. Jendral Sudirman No. 1"
              type="text"
              value={profileForm.values.address}
              onChange={profileForm.handleChange}
              error={
                profileForm.touched.address &&
                profileForm.errors.address !== undefined
              }
              helperText={
                profileForm.touched.address && profileForm.errors.address
              }
            />
            <Input
              label="Nomor (WA)"
              name="phoneNumber"
              placeholder="08123456789"
              type="text"
              value={profileForm.values.phoneNumber}
              onChange={profileForm.handleChange}
              error={
                profileForm.touched.phoneNumber &&
                profileForm.errors.phoneNumber !== undefined
              }
              helperText={
                profileForm.touched.phoneNumber &&
                profileForm.errors.phoneNumber
              }
            />

            <div className="w-full mt-4">
              <LoadingButton loading={isOnRequest}>Simpan</LoadingButton>
            </div>

            {errorMessage ? (
              <div className="alert alert-error mt-4">
                <MdErrorOutline />
                <span>{errorMessage}</span>
              </div>
            ) : null}
          </form>
        </div>
      ) : (
        <AnimationLoading />
      )}
    </ProtectedPage>
  );
}
