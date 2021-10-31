import { crawl } from "../crawl";
import { mkdirSync, rmSync, existsSync, readdirSync } from "fs";
import { convert } from "./convert";
import { join } from "path";

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

    let path = pathToConvertedImages;

    (() => {
        if (!existsSync(pathToConvertedImages)) {
            mkdirSync(pathToConvertedImages);
            return;
        }
        if (overrideIfConvertedImagesExit) {
            rmSync(pathToConvertedImages, { "recursive": true, "force": true });
            mkdirSync(pathToConvertedImages);
            return;
        }

        const newPath = path.substring(0, path.search(/\w+$/g));
        const copies = readdirSync(newPath).filter(file => {
            return file.search(/^convertedImage/g) !== -1;
        });

        path = join(
            newPath,
            `convertedImage(${(() => {
                if (copies.length === 0) {
                    return 0;
                }

                return copies.length;
            })()})`,
        );

        mkdirSync(path);
    })();

    convert({
        acceptedFileExtensions,
        data,
        pathToAssets,
        "pathToConvertedImages": path,
        convertTo,
    });
}
