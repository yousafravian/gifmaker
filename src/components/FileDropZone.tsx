import React, {DragEventHandler, useCallback, useRef, useState} from "react";
import {DropEvent, FileRejection, useDropzone} from "react-dropzone";
import {toast, ToastContainer} from "react-toastify";
import {CircleX, FolderClosed} from "lucide-react";
import {Button} from "@headlessui/react";
import Example from "../components/DropDown";

function FileDropZone(props: { setVideo: (file: File | undefined) => void}) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => {
    if(acceptedFiles.length) {
      setFiles([...acceptedFiles]);
    }
    if(fileRejections.length) {
      for (let fileRejection of fileRejections) {
        toast(`${fileRejection.file.name} is of invalid file type`, {
          type: "error"
        });
      }
    }
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mkv", ".avi", ".mov"]
    },
  });

  const onDiscardItem = (index: number) => {
    setFiles(prev => {
      prev.splice(index, 1);
      return [...prev];
    });
  }

  const dropMode = () => <>
    <div
      className='cursor-pointer bg-black/10 hover:bg-black/20 dark:bg-gray-300/10 hover:dark:bg-gray-600/10 w-[100%] h-[70%] flex justify-center items-center' {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="mt-[-100px] flex items-center flex-col">
        <FolderClosed className="w-[10rem] h-[10rem]"/>
        {
          isDragActive ?
            <span className="text-2xl mt-5">Thats it, drop em!</span> :
            <span className="text-2xl mt-5">Gimme some files...Grrrr</span>
        }
      </div>
    </div>
  </>

  const filesList = () => <>
    <ul className='p-10 flex flex-col gap-2'>
      { files.map((file, index) => {
        return <>
          <li className="flex justify-between items-center">
            <span>{file.name}</span>
            <div className="flex items-center">
              <Example/>
              <Button
                className="inline-flex items-center gap-2 rounded-br-xl rounded-tl-xl bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                Convert
              </Button>
              <Button
                onClick={() => onDiscardItem(index)}
                className="ml-2 inline-flex items-center gap-2 rounded-bl-xl rounded-tr-xl bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                <CircleX />
              </Button>
            </div>
          </li>
          <hr className="dark:border-gray-500"/>
        </>
      })}
    </ul>
  </>

  return <>
    { files.length ? filesList() : dropMode() }

    <div>
      <ToastContainer/>
    </div>
  </>
}

export default FileDropZone;