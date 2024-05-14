import Image from "next/image";
import Link from "next/link";
import TextAvatar from "../TextAvatar";
import { capitalizeText } from "@/utils/utils";

export default function BlogItem({ blog }) {
  return (
    <Link
      href={`/blogs/${blog.id}`}
      className="bg-gray-100 rounded-md shadow-xl border border-gray-400 md:w-[32%]"
    >
      <Image
        src={blog.blogImageUrl}
        alt={blog.title}
        width={500}
        height={500}
        className="w-full h-48 object-cover rounded-md rounded-b-none md:h-64"
      />
      <h1 className="mt-3 text-2xl font-bold text-center">{blog.title} </h1>

      <div className="p-4 pt-0 mt-2">
        <div className="flex items-center gap-2">
          <TextAvatar
            firstName={blog.user.firstName}
            lastName={blog.user.lastName}
          />
          <p className="font-medium text-sm">
            {blog.user.firstName + " " + blog.user.lastName}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-1.5">
          <div className="badge bg-teal-600 text-white text-xs border-0">
            {capitalizeText(blog.province)}
          </div>
          <div className="badge bg-teal-600 text-white text-xs border-0">
            {capitalizeText(blog.city)}
          </div>
        </div>

        <p className="text-end text-xs mt-3 italic">{blog.createdAt}</p>
      </div>
    </Link>
  );
}
