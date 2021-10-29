import { crawl } from "../crawl";
import { mkdirSync, rmSync, existsSync } from "fs";
import { convert } from "./convert";

export function convertImagesToWebp(params: {
    acceptedFileExtensions: string[];
    pathToAssets: string;
    pathToConvertedImages: string;
    convertTo: "png" | "jpeg" | "webp";
}) {
    const { acceptedFileExtensions, pathToAssets, pathToConvertedImages, convertTo } = params;

    const data = crawl({
        "path": pathToAssets,
    });

    if (existsSync(pathToConvertedImages)) {
        rmSync(pathToConvertedImages, { "recursive": true, "force": true });
    }
    mkdirSync(pathToConvertedImages);

    convert({
        acceptedFileExtensions,
        data,
        pathToAssets,
        pathToConvertedImages,
        convertTo,
    });
}
