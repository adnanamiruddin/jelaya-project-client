import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "@/components/functions/Input";
import LoadingButton from "@/components/functions/LoadingButton";
import { selectUser, setUser } from "@/redux/features/userSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/api/config/firebase.config";
import usersApi from "@/api/modules/users.api";
import Link from "next/link";
import { MdErrorOutline } from "react-icons/md";

export default function Register() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector(selectUser);

  const [isOnRequest, setIsOnRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useEffect(() => {
    if (user) {
      toast.info("Anda sudah masuk. Akan diarahkan ke halaman utama");
      router.push("/");
    }
  }, [user]);

  const signUpForm = useFormik({
    initialValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required("Email harus diisi"),
      username: Yup.string().required("Username harus diisi"),
      firstName: Yup.string().required("Nama depan harus diisi"),
      lastName: Yup.string().required("Nama belakang harus diisi"),
      password: Yup.string()
        .min(8, "Setidaknya 8 karakter untuk password")
        .required("Password harus diisi"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Password tidak cocok")
        .min(8, "Setidaknya 8 karakter untuk password")
        .required("Konfirmasi password harus diisi"),
    }),
    onSubmit: async (values) => {
      if (isOnRequest) return;
      setIsOnRequest(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        const { response, error } = await usersApi.signUp({
          userUID: userCredential.user.uid,
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
        });
        if (response) {
          signUpForm.resetForm();
          dispatch(setUser(response));
          toast.success(`Selamat datang ${values.firstName}`);
          router.push("/");
        }
        if (error) setErrorMessage(error.message);
      } catch (error) {
        setErrorMessage("Pendaftaran gagal. Silahkan coba lagi");
      } finally {
        setIsOnRequest(false);
      }
    },
  });

  return (
    <div className="flex justify-center items-center pt-10 px-3 md:mx-64">
      <div className="w-full md:p-24 md:rounded-md md:bg-gray-100 md:border-2 md:border-gray-300 md:shadow-lg">
        <h3 className="text-2xl font-semibold mb-1">Buat Akun</h3>
        <h5 className="mb-5">
          Sudah punya akun?{" "}
          <span className="text-blue-400">
            <Link href="/login">Masuk</Link>
          </span>
        </h5>

        <div className="flex justify-center items-center gap-2 my-5">
          <div className="h-[1px] w-full bg-gray-300 mx-2"></div>
          <p className="text-gray-400">atau</p>
          <div className="h-[1px] w-full bg-gray-300 mx-2"></div>
        </div>

        <form
          className="flex flex-col gap-3"
          onSubmit={signUpForm.handleSubmit}
        >
          <div className="flex gap-2">
            <Input
              name="firstName"
              placeholder="Nama Depan"
              type="text"
              value={signUpForm.values.firstName}
              onChange={signUpForm.handleChange}
              error={
                signUpForm.touched.firstName &&
                signUpForm.errors.firstName !== undefined
              }
              helperText={
                signUpForm.touched.firstName && signUpForm.errors.firstName
              }
            />
            <Input
              name="lastName"
              placeholder="Nama Belakang"
              type="text"
              value={signUpForm.values.lastName}
              onChange={signUpForm.handleChange}
              error={
                signUpForm.touched.lastName &&
                signUpForm.errors.lastName !== undefined
              }
              helperText={
                signUpForm.touched.lastName && signUpForm.errors.lastName
              }
            />
          </div>
          <Input
            name="email"
            placeholder="Email"
            type="email"
            value={signUpForm.values.email}
            onChange={signUpForm.handleChange}
            error={
              signUpForm.touched.email && signUpForm.errors.email !== undefined
            }
            helperText={signUpForm.touched.email && signUpForm.errors.email}
          />
          <Input
            name="username"
            placeholder="Username"
            type="text"
            value={signUpForm.values.username}
            onChange={signUpForm.handleChange}
            error={
              signUpForm.touched.username &&
              signUpForm.errors.username !== undefined
            }
            helperText={
              signUpForm.touched.username && signUpForm.errors.username
            }
          />
          <Input
            name="password"
            placeholder="Kata Sandi"
            type="password"
            value={signUpForm.values.password}
            onChange={signUpForm.handleChange}
            error={
              signUpForm.touched.password &&
              signUpForm.errors.password !== undefined
            }
            helperText={
              signUpForm.touched.password && signUpForm.errors.password
            }
          />
          <Input
            name="confirmPassword"
            placeholder="Konfirmasi Kata Sandi"
            type="password"
            value={signUpForm.values.confirmPassword}
            onChange={signUpForm.handleChange}
            error={
              signUpForm.touched.confirmPassword &&
              signUpForm.errors.confirmPassword !== undefined
            }
            helperText={
              signUpForm.touched.confirmPassword &&
              signUpForm.errors.confirmPassword
            }
          />
          <div></div>
          <LoadingButton loading={isOnRequest}>Buat Akun</LoadingButton>
          <p className="text-justify text-xs text-gray-400">
            Dengan melanjutkan, Anda menyetujui{" "}
            <span className="text-blue-500">
              Syarat Layanan dan Privasi Kebijakan
            </span>{" "}
            Pemulink
          </p>
        </form>

        {errorMessage ? (
          <div className="alert alert-error mt-4 text-white text-sm">
            <MdErrorOutline className="text-3xl" />
            <span>{errorMessage}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
