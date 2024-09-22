import "./App.css";
import { Button } from "@headlessui/react";
import NavBar from "./components/Nav";
import FileDropZone from "./components/FileDropZone";
import { ToastContainer } from "react-toastify";
import { useFFmpeg } from "./hooks/useFfmpeg";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [error, loaded, ffmpegService] = useFFmpeg();

  const loader = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[100%]">
          <h1 className="text-2xl font-bold">Error loading ffmpeg</h1>
          <p className="text-lg">Please refresh the page</p>
        </div>
      );
    } else {
      return (
        <div
          className="fixed left-[50%] top-[50%] inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      );
    }
  };

  return (
    <div className="font-mono p-5 dark:bg-gray-900 dark:text-white h-[100%]">
      <NavBar />
      {!loaded ? (
        loader()
      ) : (
        <>
          <FileDropZone />
          <div>
            <ToastContainer />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
