import { Link } from "react-router-dom";
import CameraRecorder from "../components/camera/CameraRecorder";

function Record() {
  return (
    <div>
      <div className="p-4">
        <Link
          to="/"
          className="inline-block bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 text-sm rounded no-underline"
        >
          ← Back to Home
        </Link>
      </div>
      <CameraRecorder />
    </div>
  );
}

export default Record;
