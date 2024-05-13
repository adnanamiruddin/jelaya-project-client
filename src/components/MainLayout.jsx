import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import usersApi from "@/api/modules/users.api";
// import Navbar from "@/components/layouts/NavbarOld";
import Navbar from "./layouts/Navbar";
import { setUser } from "@/redux/features/userSlice";
import { ToastContainer } from "react-toastify";
import GlobalLoading from "@/components/layouts/GlobalLoading";
import Footer from "@/components/layouts/Footer";

import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Carousel from "./layouts/Carousel";

export default function MainLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isCarouselPassed, setIsCarouselPassed] = useState(false);

  useEffect(() => {
    const authUser = async () => {
      const { response, error } = await usersApi.getProfile();
      if (response) dispatch(setUser(response));
      if (error) dispatch(setUser(null));
    };
    authUser();
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= window.innerHeight) {
        setIsCarouselPassed(true);
      } else {
        setIsCarouselPassed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Global Loading START */}
      <GlobalLoading />
      {/* Global Loading END */}

      {/* Config React Toastify START */}
      <ToastContainer
        position="top-center"
        autoClose={4000}
        theme="light"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        limit={1}
      />
      {/* Config React Toastify END */}

      <div>
        <Navbar isCarouselPassed={isCarouselPassed} />
      </div>

      {router.asPath === "/" ? (
        <>
          <Carousel />

          <div className="bg-white text-black p-6 min-h-screen">{children}</div>
        </>
      ) : (
        <div className="bg-white text-black p-6 pt-24 min-h-screen">
          {children}
        </div>
      )}

      <Footer />
    </>
  );
}
