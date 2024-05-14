import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/userSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import AnimationLoading from "../layouts/AnimationLoading";

const ProtectedPage = ({ children }) => {
  const router = useRouter();
  const { user } = useSelector(selectUser);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUser = setTimeout(() => {
      if (!user) {
        router.push("/login");
        toast.error("Anda harus masuk terlebih dahulu");
      }
      setIsChecking(false);
    }, 3000);

    return () => clearTimeout(checkUser);
  }, [user, router]);

  if (isChecking) {
    return <AnimationLoading />;
  }

  return user ? children : null;
};

export default ProtectedPage;
