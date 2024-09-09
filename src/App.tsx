import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Button} from "@headlessui/react";
import {FFmpeg} from "@ffmpeg/ffmpeg";
import {fetchFile, toBlobURL} from "@ffmpeg/util";
import {saveAs} from 'file-saver';

function App() {
  const ffmpegRef = useRef(new FFmpeg());
  const [loaded, setLoaded] = useState(false);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const [gif, setGif] = useState<string>();
  const [video, setVideo] = useState<File>();


  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({message}) => {
      console.log(message);
      if (messageRef.current) {
        messageRef.current.innerHTML = message;
      }
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    setLoaded(true);
  }

  const downloadGIF = () => {
    if(gif) {
      saveAs(gif);
    }
  }

  const convert = async () => {
    await ffmpegRef.current.writeFile('test.mp4', await fetchFile(video));
    await ffmpegRef.current.exec(['-i', 'test.mp4', '-t', '3', '-ss', '0', '-r', '30', '-f', 'gif', 'out.gif'])
    // Read the result
    const data = await ffmpegRef.current.readFile('out.gif');

    // Create a URL
    const url = URL.createObjectURL(new Blob([data], {type: 'image/gif'}));
    setGif(url)
  }

  return (
    <div className="App h-[100%] max-w-[960px] mx-auto flex justify-center items-center flex-col gap-3">
      {
        !loaded ?
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-black"
            role="status">
              <span
                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
          </div> :
          <>
            {
              !video && <input type="file" accept=".mp4" onChange={(e) => setVideo(e.target.files?.[0])}/>
            }
            {
              video && !gif &&
                <>
                    <video controls width="100%" src={URL.createObjectURL(video)}></video>
                    <Button
                        onClick={convert}
                        className="mr-auto inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                        Convert to GIF
                    </Button>
                </>
            }
            {!gif && <p ref={messageRef}></p>}
            {gif && <>
                <img src={gif} width="100%"/>
                <Button
                    onClick={downloadGIF}
                    className="mr-auto inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                    Download GIF
                </Button>
            </>}
          </>
      }

    </div>
  );
}

export default App;
