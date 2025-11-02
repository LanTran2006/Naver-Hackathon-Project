import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import CameraRecorder from "./components/CameraRecorder";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <CameraRecorder />
    </>
  );
}

export default App;
