import Swal from "sweetalert2";

const BulkStatusUpdate = ({ selectedApps, onBulkUpdate }) => {
  const confirmAction = async (status) => {
    if (selectedApps.length === 0) {
      return Swal.fire("No selection", "Select applications first", "warning");
    }

    const res = await Swal.fire({
      title: `Update ${selectedApps.length} applications`,
      text: `Set status to "${status}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    });
// NUR Mohammod
    if (res.isConfirmed) {
      onBulkUpdate(status);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => confirmAction("approved")}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Approve
      </button>
      <button
        onClick={() => confirmAction("rejected")}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Reject
      </button>
    </div>
  );
};

export default BulkStatusUpdate;
