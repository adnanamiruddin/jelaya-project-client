import Image from "next/image";

export default function CarouselItem({
  slide,
  title,
  desc,
  image,
  prevSlide,
  nextSlide,
}) {
  return (
    <div id={slide} className="carousel-item relative w-full">
      <Image
        src={image}
        width={1920}
        height={1080}
        alt={title}
        className="w-full object-cover brightness-75 md:brightness-50 md:blur-sm"
      />

      {/* Tab - Desktop View START */}
      <div className="hidden md:flex absolute justify-end items-end w-full h-full brightness-100">
        <div className="absolute top-1/3 w-3/12 md:left-14 xl:left-20">
          <h3 className="font-bold text-3xl mb-10">{title}</h3>
          <p className="text-justify sm:text-sm">{desc}</p>
        </div>
        <Image
          src={image}
          width={1920}
          height={1080}
          alt="carousel"
          className="w-10/12 h-4/6 object-cover md:w-8/12 md:h-5/6"
        />
      </div>
      {/* Tab - Desktop View END */}

      {/* Mobile View START */}
      <div className="md:hidden absolute flex justify-center items-end pb-8 w-full h-full">
        <h3 className="font-bold text-2xl">{title}</h3>
      </div>
      {/* Mobile View END */}

      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href={`#${prevSlide}`} className="btn btn-circle btn-ghost text-lg">
          ❮
        </a>
        <a href={`#${nextSlide}`} className="btn btn-circle btn-ghost text-lg">
          ❯
        </a>
      </div>
    </div>
  );
}
