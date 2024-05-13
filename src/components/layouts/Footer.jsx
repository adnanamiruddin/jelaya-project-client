import Image from "next/image";

export default function Footer() {
  return (
    <div className="flex justify-between items-center bg-gray-900 py-2 px-7">
      <div className="flex gap-5 items-center md:gap-7">
        <Image
          src="/logo-jelaya.jpeg"
          alt="Logo Pantai Marina"
          width={100}
          height={100}
          className="w-14 h-14"
        />

        <p className="text-gray-500 text-sm">
          Copyright © 2024 Jelaya. Developed by Adnan Amiruddin.
        </p>
      </div>
    </div>
  );
}
