import { toast } from "react-toastify";

export default function ChooseBlogContentTypeModal({
  setAddBlogContents,
  uploadImage,
  setUploadImage,
}) {
  const handleAddTextContent = () => {
    const blogContentsContainer = document.getElementById("blog_contents");
    const textContent = document.createElement("textarea");
    const id = Date.now();
    textContent.setAttribute("id", id);
    textContent.setAttribute(
      "class",
      "textarea textarea-lg bg-white text-black border-teal-400 md:w-[75%]"
    );
    textContent.setAttribute("placeholder", "Teks Konten Blog...");
    textContent.setAttribute("rows", "4");
    blogContentsContainer.appendChild(textContent);

    setAddBlogContents((prevAddBlogContents) => [
      ...prevAddBlogContents,
      {
        id,
        type: "text",
        text: "",
      },
    ]);
    document.getElementById("choose_blog_content_type_modal").close();
  };

  const handleAddImageContent = () => {
    if (uploadImage !== undefined) {
      document.getElementById("choose_blog_content_type_modal").close();
      toast.warning(
        "Hanya bisa mengunggah satu gambar per upload. Silahkan simpan lalu tambahkan lagi."
      );
      return;
    }
    setUploadImage(null);
    const blogContentsContainer = document.getElementById("blog_contents");
    const imageContent = document.createElement("div");
    const elementId = Date.now();
    imageContent.setAttribute(
      "class",
      "flex items-center justify-center w-full relative"
    );
    imageContent.innerHTML = `
      <label
        htmlFor="dropzone-file"
        class="flex flex-col items-center justify-center w-full h-64 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-2 border-teal-500"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <p class="mb-2 text-sm text-gray-500">
            <span class="font-semibold">Klik untuk upload </span>
            atau seret dan lepaskan foto
          </p>
          <p class="text-xs text-gray-500">
            SVG, PNG, JPG, JPEG, atau WEBP
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          accept="image/*"
          class="hidden"
        />
      </label>
    `;

    const inputElement = imageContent.querySelector("#dropzone-file");
    inputElement.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const imgElement = document.createElement("img");
        imgElement.src = e.target.result;
        imgElement.setAttribute("class", "max-w-full max-h-full");
        imageContent.innerHTML = "";
        imageContent.appendChild(imgElement);

        setUploadImage(file);
      };
      reader.readAsDataURL(file);
    });
    blogContentsContainer.appendChild(imageContent);

    setAddBlogContents((prevAddBlogContents) => [
      ...prevAddBlogContents,
      {
        id: elementId,
        type: "image",
        imageUrl: "",
        imageUpload: null,
      },
    ]);
    document.getElementById("choose_blog_content_type_modal").close();
  };

  return (
    <dialog id="choose_blog_content_type_modal" className="modal">
      <div className="modal-box bg-gray-100">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-2xl">Pilih Tipe Konten Blog</h3>

        <div className="mt-6 flex justify-center items-center gap-3">
          <button
            onClick={handleAddTextContent}
            className="w-1/2 btn bg-slate-600 text-white text-lg"
          >
            Teks
          </button>
          <button
            onClick={handleAddImageContent}
            className="w-1/2 btn bg-teal-600 text-white text-lg"
          >
            Gambar
          </button>
        </div>
      </div>
    </dialog>
  );
}
