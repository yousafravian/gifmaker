import { useEffect, useState } from "react";
import { FFmpegService } from "../services/ffmpeg.service";

export function useFFmpeg() {
  const ffmpegService = new FFmpegService();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    ffmpegService
      .loadFFmpeg()
      .then(() => {
        setLoaded(true);
      })
      .catch((e) => {
        setError(e);
        setLoaded(false);
      });
  }, []);

  return [error, loaded, ffmpegService] as const;

  // const downloadGIF = () => {
  //   if (gif) {
  //     saveAs(gif);
  //   }
  // }

  // const convert = async () => {
  //   await ffmpegRef.current.writeFile('test.mp4', await fetchFile(video));
  //   await ffmpegRef.current.exec(['-i', 'test.mp4', '-t', '3', '-ss', '0', '-r', '30', '-f', 'gif', 'out.gif'])
  //   // Read the result
  //   const data = await ffmpegRef.current.readFile('out.gif');

  //   // Create a URL
  //   const url = URL.createObjectURL(new Blob([data], { type: 'image/gif' }));
  //   setGif(url)
  // }
}
