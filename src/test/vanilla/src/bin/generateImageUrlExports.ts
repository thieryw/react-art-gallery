import { generateMediaFile } from "./generateMediaFile";
import { join } from "path";

generateMediaFile({
    "acceptedFileExtensions": [".webp"],
    "mediaPath": join(__dirname, "..", "assets", "webp"),
    "generatedFilePath": join(__dirname, ".."),
    "generatedFileName": "generatedWebpExports",
});

generateMediaFile({
    "acceptedFileExtensions": [".jpg", ".png"],
    "mediaPath": join(__dirname, "..", "assets", "img"),
    "generatedFilePath": join(__dirname, ".."),
    "generatedFileName": "generatedImgExports",
});
