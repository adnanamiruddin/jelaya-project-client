import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectGlobalLoading } from "@/redux/features/globalLoadingSlice";

export default function GlobalLoading() {
  const { globalLoading } = useSelector(selectGlobalLoading);

  const [isLoading, setIsLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (globalLoading) {
      setIsLoading(true);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);

        setTimeout(() => {
          setIsHidden(true);
        }, 1100);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [globalLoading]);

  return (
    <div
      className={`min-h-screen w-full fixed flex justify-center items-center bg-blue-50 z-[999] transition-all duration-300 ease-in-out ${
        isLoading ? "opacity-100" : "opacity-0"
      } ${isHidden ? "hidden" : ""}`}
    >
      <span className="loading loading-ball loading-lg text-blue-500"></span>
      {/* <Image src={pemulinkLogo} alt="Pemulink Logo" className="w-1/2" /> */}
      <span className="loading loading-ball loading-lg text-yellow-400"></span>
    </div>
  );
}
