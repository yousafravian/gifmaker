import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { toast } from "react-toastify";
import {
  audioFormatOptions,
  imageFormatOptions,
  videoFormatOptions,
} from "../constants/formats";
import { isAudio, isImage, isVideo } from "../lib/utils";

export class FFmpegService {
  static ffmpeg = new FFmpeg();
  static loaded = false;

  async loadFFmpeg() {
    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await FFmpegService.ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript",
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm",
        ),
      });

      FFmpegService.ffmpeg.on("log", (e) =>
        console.log("LOG:", e.message, e.type),
      );

      FFmpegService.ffmpeg.on("progress", (e) =>
        console.log("Progress:", e.progress, e.time),
      );

      FFmpegService.loaded = true;
      return true;
    } catch (error) {
      toast.error("Failed to load FFmpeg, please reload the page.");
      console.error(error);
      throw error;
    }
  }

  async convertFile(file: File, format: string) {
    this.initialCheck();
    // Use ffmpeg to convert the file to the desired format
    const { name, type } = file;
    if (!this.isCorrectConversion(file, format)) {
      throw new Error("Invalid conversion");
    }

    const extension = name.split(".").pop() ?? "";
    const outputFileName = `${name.replace(extension, format)}`;
    await FFmpegService.ffmpeg.writeFile(name, await fetchFile(file));
    await FFmpegService.ffmpeg.exec([
      "-i",
      name,
      "-f",
      format,
      `${outputFileName}.${format}`,
    ]);
    // Read the result
    const data = await FFmpegService.ffmpeg.readFile(
      `${outputFileName}.${format}`,
    );

    // Create a URL
    const types = this.getType(format);
    const url = URL.createObjectURL(new Blob([data], { type: types }));
    return url;
  }

  getType(type: string) {
    const audioFormats = audioFormatOptions.map((option) => option.value);
    const videoFormats = videoFormatOptions.map((option) => option.value);

    if (videoFormats.includes(type)) {
      return `video/${type}`;
    } else if (audioFormats.includes(type)) {
      return `audio/${type}`;
    }
    return `image/${type}`;
  }

  // async convertFile(file, format) {
  //   const { name, type } = file;
  //   const extension = name.split(".").pop();
  //   const outputFileName = `${name.replace(extension, format)}`;
  //   const output = `output/${outputFileName}`;
  //   await this.ffmpeg.write(name, file);
  //   await this.ffmpeg.run("-i", name, output);
  //   const data = this.ffmpeg.read(output);
  //   return new File([data], outputFileName, { type });
  // }

  private initialCheck() {
    if (!FFmpegService.loaded) {
      throw new Error("FFmpeg is not loaded");
    }
  }

  private isCorrectConversion(file: File, format: string): boolean {
    const fileType = file.type;

    const audioFormats = audioFormatOptions.map((option) => option.value);
    const imageFormats = imageFormatOptions.map((option) => option.value);
    const videoFormats = videoFormatOptions.map((option) => option.value);

    if (isVideo(fileType)) {
      return videoFormats.includes(format) || audioFormats.includes(format);
    } else if (isImage(fileType)) {
      return imageFormats.includes(format);
    } else if (isAudio(fileType)) {
      return audioFormats.includes(format);
    }

    // If the file type is not recognized, return false
    return false;
  }
}
