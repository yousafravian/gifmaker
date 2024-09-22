import React, { useCallback, useState } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { toast, ToastContainer } from "react-toastify";
import { FolderClosed } from "lucide-react";
import FilesList from "./FilesList";

function FileDropZone() {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent,
    ) => {
      if (acceptedFiles.length) {
        setFiles([...acceptedFiles]);
      }
      if (fileRejections.length) {
        for (let fileRejection of fileRejections) {
          toast(`${fileRejection.file.name} is of invalid file type`, {
            type: "error",
          });
        }
      }
    },
    [],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".webp",
        ".ico",
        ".tif",
        ".tiff",
        ".raw",
        ".tga",
      ],
      "audio/*": [],
      "video/*": [],
    },
  });

  const onDiscardFile = (index: number) => {
    setFiles((prev) => {
      prev.splice(index, 1);
      return [...prev];
    });
  };

  const dropMode = () => (
    <>
      <div
        className="cursor-pointer bg-black/10 hover:bg-black/20 dark:bg-gray-300/10 hover:dark:bg-gray-600/10 w-[100%] h-[70%] flex justify-center items-center"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div className="mt-[-100px] flex items-center flex-col">
          <FolderClosed className="w-[10rem] h-[10rem]" />
          {isDragActive ? (
            <span className="text-2xl mt-5">Thats it, drop em!</span>
          ) : (
            <span className="text-2xl mt-5">Gimme some files...Grrrr</span>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {files.length ? (
        <FilesList onDiscardFile={onDiscardFile} files={files} />
      ) : (
        dropMode()
      )}
    </>
  );
}

export default FileDropZone;
