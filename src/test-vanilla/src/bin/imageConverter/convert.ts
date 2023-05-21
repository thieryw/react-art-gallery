import { join, extname } from "path";
import { mkdirSync } from "fs";
import type { Tree } from "../crawl";
import sharp from "sharp";

export function convert(params: {
    data: Tree;
    pathToAssets: string;
    pathToConvertedImages: string;
    acceptedFileExtensions: string[];
    convertTo: "png" | "jpeg" | "webp";
}) {
    const { data, pathToAssets, pathToConvertedImages, acceptedFileExtensions, convertTo } = params;

    data.files.forEach(file => {
        if (!acceptedFileExtensions.includes(extname(file))) {
            return;
        }
        sharp(join(pathToAssets, file))
            [convertTo]()
            .toFile(join(pathToConvertedImages, `${file.replace(/.\w+$/g, "")}.${convertTo}`));
    });

    if (Object.keys(data.directories).length === 0) {
        return;
    }

    Object.values(data.directories).forEach((value, index) => {
        const currentDirName = Object.keys(data.directories)[index];
        const newPath = join(pathToAssets, currentDirName);
        mkdirSync(join(pathToConvertedImages, currentDirName));
        convert({
            "data": value,
            "pathToAssets": newPath,
            "pathToConvertedImages": join(pathToConvertedImages, currentDirName),
            acceptedFileExtensions,
            convertTo,
        });
    });
}
