import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/userSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const ProtectedPage = ({ children }) => {
  const router = useRouter();

  const { user } = useSelector(selectUser);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      toast.error("Anda harus masuk terlebih dahulu");
    }
  }, [user, router]);

  return user ? children : null;
};

export default ProtectedPage;
