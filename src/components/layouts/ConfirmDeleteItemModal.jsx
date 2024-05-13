import { IoWarningOutline } from "react-icons/io5";

export default function ConfirmDeleteItemModal({
  handleDelete,
  onDeleteProcess,
  type,
}) {
  return (
    <dialog id="confirm_delete_item_modal" className="modal">
      <div className="modal-box bg-white">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        <IoWarningOutline className="text-center w-full text-6xl" />

        <h4 className="mt-4 text-center text-lg">
          Apakah kamu yakin ingin menghapus {type} ini?
        </h4>

        <div className="mt-4 flex justify-center items-center gap-5">
          <form method="dialog" className="w-1/3">
            <button className="w-full py-2.5 text-gray-900 font-medium text-center bg-gray-100 hover:bg-gray-300 rounded-lg border border-gray-300">
              {!onDeleteProcess ? (
                "Tidak"
              ) : (
                <span className="loading loading-bars loading-md"></span>
              )}
            </button>
          </form>

          <button
            onClick={handleDelete}
            disabled={onDeleteProcess}
            className={`w-1/3 py-2.5 text-white font-medium text-center bg-red-600 hover:bg-red-800 rounded-lg border border-red-700 ${
              onDeleteProcess ? "brightness-75" : ""
            }`}
          >
            {!onDeleteProcess ? (
              "Ya, hapus"
            ) : (
              <span className="loading loading-bars loading-md"></span>
            )}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
