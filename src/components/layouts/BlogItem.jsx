import Image from "next/image";
import Link from "next/link";

export default function BlogItem({ blog }) {
  return (
    <Link
      href={`/blogs/${blog.id}`}
      className="bg-gray-100 p-3 rounded-md shadow-xl border border-gray-400 md:w-[32%]"
    >
      <Image
        src={blog.blogImageUrl}
        alt={blog.title}
        width={100}
        height={100}
        className="w-full h-48 object-cover rounded-md"
      />
      <h1 className="mt-2 text-2xl font-bold text-center">{blog.title}</h1>

      <p className="text-end text-xs mt-3">{blog.createdAt}</p>
    </Link>
  );
}
