import Link from "next/link";
import { useRouter } from "next/router";
import { IoMenu } from "react-icons/io5";
import {
  FaHome,
  FaRegAddressBook,
  FaRegCommentDots,
  FaRegNewspaper,
} from "react-icons/fa";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { BiCategoryAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUser } from "@/redux/features/userSlice";
import { toast } from "react-toastify";
import { auth } from "@/api/config/firebase.config";
import { MdAccountCircle } from "react-icons/md";

const generalLinks = [
  {
    href: "/",
    label: "Beranda",
    icon: <FaHome className="text-2xl me-1" />,
  },
  {
    href: "/blogs",
    label: "Blog",
    icon: <BiCategoryAlt className="text-2xl me-1" />,
  },
];

const categoriesLinks = ["Adat Istiadat", "Bahasa", "Kuliner"];

const notLoggedInLinks = [
  {
    href: "/login",
    label: "Login",
    icon: <FiLogIn className="text-2xl me-1" />,
  },
  {
    href: "/register",
    label: "Register",
    icon: <FaRegAddressBook className="text-2xl me-1" />,
  },
];

const loggedInLinks = [
  {
    href: "/dashboard/profile",
    label: "Profil",
    icon: <MdAccountCircle className="text-2xl me-1" />,
  },
  {
    href: "/dashboard/my-blogs",
    label: "Blog Saya",
    icon: <FaRegNewspaper className="text-2xl me-1" />,
  },
  {
    href: "/dashboard/my-comments",
    label: "Komentar Saya",
    icon: <FaRegCommentDots className="text-2xl me-1" />,
  },
];

export default function Navbar({ isCarouselPassed }) {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);

  const router = useRouter();

  const handleDrawerClose = () => {
    document.getElementById("navbar_drawer").checked = false;
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      dispatch(setUser(null));
      document.getElementById("navbar_drawer").checked = false;
      toast.info("Bye bye 👋");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* Mobile View START */}
      <div className="md:hidden navbar fixed z-[999] transition-all ease-in duration-300 bg-gradient-to-br from-teal-400 to-teal-700">
        <input id="navbar_drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label
            htmlFor="navbar_drawer"
            className="ms-1 flex justify-center items-center"
          >
            <IoMenu className="w-9 h-9 text-white" />
          </label>
        </div>

        <div className="drawer-side">
          <label
            htmlFor="navbar_drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-white text-black gap-3">
            <li className="-ms-2 mb-2">
              <div class="shine">Jelaya</div>
            </li>

            {generalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={handleDrawerClose}
                  className={`text-lg font-semibold ${
                    router.pathname === link.href ? "bg-teal-300" : ""
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}

            <li className="mt-auto"></li>
            {!user ? (
              <>
                {notLoggedInLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={handleDrawerClose}
                      className={`text-lg font-semibold ${
                        router.pathname === link.href ? "bg-teal-300" : ""
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </>
            ) : (
              <>
                {loggedInLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={handleDrawerClose}
                      className={`text-lg font-semibold ${
                        router.pathname === link.href ? "bg-teal-300" : ""
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-4">
                  <button
                    onClick={handleLogout}
                    className="text-lg font-semibold bg-red-600 text-white"
                  >
                    <FiLogOut className="text-2xl me-1" />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>

        <h1 className="text-3xl text-white font-bold ms-4 mb-0.5 italic">
          Jelaya
        </h1>

        {!user ? (
          <Link
            href="/login"
            className="ms-auto btn btn-accent text-white shadow-lg border-2 border-teal-300"
          >
            MASUK
          </Link>
        ) : (
          <Link
            href="/dashboard/profile"
            className="ms-auto btn btn-accent text-white shadow-lg border-2 border-teal-300 p-2"
          >
            <MdAccountCircle className="text-2xl" />
            {user.firstName}
          </Link>
        )}
      </div>
      {/* Mobile View END */}

      {/* Tab - Desktop View START */}
      <div
        className={`hidden md:navbar fixed z-[999] transition-all ease-in-out duration-300 ${
          isCarouselPassed || router.asPath !== "/"
            ? "bg-gradient-to-br from-teal-400 to-teal-700"
            : "bg-transparent"
        }`}
      >
        <div className="navbar-start">
          <h1 className="text-3xl text-white font-bold ms-4 mb-0.5 italic">
            Jelaya
          </h1>
        </div>

        <div
          className={`navbar-center flex transition-all delay-500 ${
            router.pathname === "/blogs" ? "ms-24" : ""
          }`}
        >
          <ul className="menu menu-horizontal px-1 gap-2 text-lg font-semibold">
            {generalLinks.map((link) => (
              <li
                key={link.href}
                className={`rounded-md border-2 border-transparent hover:bg-teal-500 hover:border-teal-300 focus:bg-teal-300 ${
                  router.pathname === link.href
                    ? "bg-teal-400 border-teal-200"
                    : ""
                }`}
              >
                <Link href={link.href} className="text-white focus:text-white">
                  {link.label}
                </Link>
              </li>
            ))}

            <li
              tabIndex={0}
              className={`transition-all delay-300 ${
                router.pathname === "/blogs" ? "opacity-0" : ""
              }`}
            >
              <details>
                <summary>Kategori</summary>
                <ul
                  className={`p-2 border-2 border-gray-100 w-max ${
                    router.pathname === "/blogs" ? "hidden" : ""
                  }`}
                >
                  {categoriesLinks.map((category) => (
                    <li key={category}>
                      <Link
                        href={`/blogs?category=${category}`}
                        className="text-white text-sm hover:bg-teal-500 hover:text-white"
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>
        </div>

        <div className="navbar-end me-2">
          {!user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className={`btn text-white font-bold text-lg shadow-lg border-2 py-2 px-4 hover:bg-teal-600 hover:border-teal-100 ${
                  isCarouselPassed || router.asPath !== "/"
                    ? "bg-teal-500 border-teal-300"
                    : "bg-transparent border-transparent"
                }`}
              >
                Masuk
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-teal-500"
              >
                {notLoggedInLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white font-semibold hover:bg-teal-300"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className={`btn text-white font-bold text-lg shadow-lg border-2 p-2 hover:bg-teal-600 hover:border-teal-100 ${
                  isCarouselPassed || router.asPath !== "/"
                    ? "bg-teal-500 border-teal-300"
                    : "bg-transparent border-transparent"
                }`}
              >
                <MdAccountCircle className="text-2xl" />
                {user.firstName}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow rounded-box w-52 bg-teal-500"
              >
                {loggedInLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white font-semibold hover:bg-teal-300"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </li>
                ))}

                <li>
                  <button
                    onClick={handleLogout}
                    className="text-white font-semibold mt-2 bg-red-600 hover:bg-red-500 focus:bg-red-700"
                  >
                    <FiLogOut className="text-2xl me-1" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Tab - Desktop View END */}
    </>
  );
}
