import { Button } from "@headlessui/react";
import clsx from "clsx";
import { CircleX, Speaker, File, FileText, Image, Video } from "lucide-react";
import { useState } from "react";
import {
  audioFormatOptions,
  imageFormatOptions,
  videoFormatOptions,
} from "../constants/formats";
import { useFFmpeg } from "../hooks/useFfmpeg";
import { isAudio, isVideo } from "../lib/utils";
import DropDown from "./DropDown";
import Loader from "./Loader";

export function fileToIcon(file_type: string) {
  if (file_type.includes("video")) return <Video />;
  if (file_type.includes("audio")) return <Speaker />;
  if (file_type.includes("text")) return <FileText />;
  if (file_type.includes("image")) return <Image />;
  return <File />;
}

function FilesList({
  onDiscardFile: onDiscardItem,
  files,
}: {
  onDiscardFile: (index: number) => void;
  files: File[];
}) {
  const [error, loaded, ffmpegService] = useFFmpeg();
  const [filesSelectedFormats, setFilesSelectedFormats] = useState(
    files.map((file) => file.name.split(".").pop() ?? ""),
  );
  const [filesState, setFilesState] = useState(files.map(() => false));
  const onItemSelect = (index: number, value: string) => {
    setFilesSelectedFormats((prev) => {
      const newFormats = [...prev];
      newFormats[index] = value;
      return newFormats;
    });
  };

  const getFileProps = ({ type }: File) => {
    if (isVideo(type)) {
      return videoFormatOptions.concat(audioFormatOptions);
    } else if (isAudio(type)) {
      return audioFormatOptions;
    }
    return imageFormatOptions;
  };

  const convertFile = (index: number) => {
    if (loaded) {
      setFilesState((prev) => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
      ffmpegService
        ?.convertFile(files[index], filesSelectedFormats[index])
        .then((uri: string) => {
          saveFile(uri);
          setFilesState((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
          });
        })
        .catch(console.error);
    }
  };

  const saveFile = (uri: string) => {
    const getFileName = prompt("Enter converted file name");

    const a = document.createElement("a");
    a.href = uri;
    a.download = getFileName ?? `converted-${Date.now()}`;
    a.click();
  };

  return (
    <ul className="p-10 flex flex-col gap-1">
      {files.map((file, index) => {
        return (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-200 dark:bg-white/10 p-2"
          >
            <div className="flex justify-center items-center gap-3">
              {fileToIcon(file.type)}
              {file.name}
            </div>
            <div className="flex items-center">
              <DropDown
                disabled={filesState[index]}
                className={clsx(
                  filesState[index] && "cursor-not-allowed opacity-60",
                )}
                options={getFileProps(file)}
                onChange={(_, value) => onItemSelect(index, value)}
              />
              <Button
                disabled={filesState[index]}
                onClick={() => convertFile(index)}
                className={clsx(
                  "inline-flex items-center gap-2 bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white",
                  filesState[index] && "cursor-not-allowed opacity-60",
                )}
              >
                Convert
                {filesState[index] && <Loader />}
              </Button>
              <Button
                disabled={filesState[index]}
                onClick={() => onDiscardItem(index)}
                className={clsx(
                  "ml-2 inline-flex items-center gap-2 bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white",
                  filesState[index] && "cursor-not-allowed opacity-60",
                )}
              >
                <CircleX />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default FilesList;
