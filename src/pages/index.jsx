import MotionDiv from "@/components/functions/MotionDiv";
import HomeButton from "@/components/layouts/HomeButton";
import HomeCard from "@/components/layouts/HomeCard";
import { selectUser } from "@/redux/features/userSlice";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function Home() {
  const { user } = useSelector(selectUser);

  return (
    <div className="md:mx-24">
      <h3 className="font-bold text-3xl text-center md:text-4xl">
        Jelajah Budaya
      </h3>

      <MotionDiv x={-100}>
        <p className="mt-6 text-justify md:mt-8">
          Indonesia adalah rumah bagi lebih dari 300 kelompok etnis yang
          berbeda, masing-masing dengan warisan budaya dan tradisi yang unik.
          Dari Sabang hingga Merauke, setiap wilayah di Indonesia memiliki
          kekayaan budaya yang memikat, mulai dari kebiasaan adat istiadat yang
          khas, bahasa-bahasa daerah yang beragam, hingga seni dan kerajinan
          tradisional yang mempesona. Setiap etnis dan suku bangsa memberikan
          kontribusi yang berharga terhadap keragaman budaya Indonesia.
        </p>
      </MotionDiv>

      <MotionDiv x={100}>
        <p className="mt-6 text-justify">
          Budaya Indonesia tercermin dalam keterikatan yang erat dengan alam dan
          ritual kepercayaan yang mendalam. Berbagai ritual adat, seperti
          upacara keagamaan, festival budaya, dan perayaan tradisional, menjadi
          wujud penghormatan terhadap alam dan leluhur. Dari upacara panen
          hingga ritual penyambutan musim, setiap kegiatan memiliki makna dan
          simbolis yang dalam, memperkuat hubungan antara manusia, alam, dan roh
          nenek moyang.
        </p>
      </MotionDiv>

      <MotionDiv x={-100}>
        <p className="mt-6 text-justify">
          Meskipun dihadapkan dengan arus modernisasi yang kuat, masyarakat
          Indonesia tetap berkomitmen untuk melestarikan dan menghidupkan
          kembali warisan budaya mereka. Melalui berbagai inisiatif, seperti
          festival seni, pembelajaran budaya di sekolah, dan program-program
          komunitas, upaya pelestarian budaya terus dilakukan untuk memastikan
          bahwa generasi mendatang tetap terhubung dengan akar budaya mereka.
          Jelajahi kekayaan budaya Indonesia yang tak ternilai melalui mata dan
          hati yang terbuka, dan rasakan keindahan serta kedalaman yang
          tersembunyi di setiap sudut negeri ini.
        </p>
      </MotionDiv>

      <div className="mt-6 md:flex">
        <div class="card-container">
          <div class="card">
            <div class="img-content">
              <Image
                src="/logo-jelaya.jpeg"
                alt="Logo Pantai Marina"
                width={100}
                height={100}
                className="w-1/3"
              />
            </div>
            <div class="content">
              <p class="heading text-xl">Jelaya</p>
              <p className="font-semibold text-justify text-base mt-1">
                Jelajah Budaya Indonesia dan Mari Berdiskusi
              </p>
            </div>
          </div>
        </div>

        <MotionDiv x={-100}>
          <div className="mt-6 md:mt-0 md:ms-6">
            <p className="text-justify">
              Jelaya yang merupakan singkatan dari Jelajah Budaya merupakan
              situs web yang berisi informasi tentang kekayaan budaya Indonesia.
              Situs web ini menyajikan berbagai artikel, foto, dan diskusi
              terbuka yang menggambarkan keberagaman budaya Indonesia, mulai
              dari seni tradisional, kuliner, hingga kebiasaan adat istiadat
              yang unik.
            </p>

            <div className="hidden md:inline-block">
              <HomeButton href="/blogs">Yuk Baca Blog Budaya</HomeButton>
            </div>
          </div>
        </MotionDiv>
      </div>

      <MotionDiv x={-100} optionalStyling="md:hidden">
        <div className="mt-2"></div>
        <HomeButton href="/blogs">Yuk Baca Blog Budaya</HomeButton>
      </MotionDiv>

      {!user ? (
        <div className="md:flex md:justify-center md:items-start md:gap-8">
          <MotionDiv x={-100}>
            <HomeCard
              title="Daftar"
              description="Ingin menjadi bagian dari Jelaya? Yuk buat akun Jelaya kamu terlebih dahulu"
              buttonLink="/register"
            />
          </MotionDiv>

          <MotionDiv x={-100} optionalStyling="md:hidden">
            <p className="mt-4">atau</p>
          </MotionDiv>

          <MotionDiv x={-100}>
            <HomeCard
              title="Login"
              description="Sudah punya akun? Yuk langsung login untuk mengakses berbagai fitur menarik"
              buttonLink="/login"
            />
          </MotionDiv>
        </div>
      ) : null}
    </div>
  );
}
