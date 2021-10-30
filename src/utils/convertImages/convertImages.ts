import { crawl } from "../crawl";
import { mkdirSync, rmSync, existsSync } from "fs";
import { convert } from "./convert";

export function convertImages(params: {
    acceptedFileExtensions: string[];
    pathToAssets: string;
    pathToConvertedImages: string;
    convertTo: "png" | "jpeg" | "webp";
    overrideIfConvertedImagesExit: boolean;
}) {
    const {
        acceptedFileExtensions,
        pathToAssets,
        pathToConvertedImages,
        convertTo,
        overrideIfConvertedImagesExit,
    } = params;

    const data = crawl({
        "path": pathToAssets,
    });

    if (existsSync(pathToConvertedImages)) {
        if (!overrideIfConvertedImagesExit) {
            throw new Error("files all ready exist");
        }
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
