import { writeImports } from "./writeImports";
import { writeExport } from "./writeExport";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { generatedFileName } from "./generatedFileName";
import { crawl } from "./crawl";
import { sortFileArraysNumerically } from "./sortFileArraysNumerically";

export function generateMediaFile(params: {
    generatedFilePath: string;
    mediaPath: string;
    acceptedFileExtensions: string[];
}) {
    const { generatedFilePath, mediaPath, acceptedFileExtensions } = params;
    const tree = crawl({ mediaPath });
    const generatedFileCompletePath = join(generatedFilePath.toString(), `${generatedFileName}.ts`);

    sortFileArraysNumerically({ tree });

    if (existsSync(generatedFileCompletePath)) {
        writeFileSync(generatedFileCompletePath, "");
    }

    writeImports({
        "mediaPath": join(__dirname, mediaPath),
        "generatedFilePath": join(__dirname, generatedFilePath),
        tree,
        acceptedFileExtensions,
    });

    writeExport({
        tree,
        "generatedFilePath": join(__dirname, generatedFilePath),
        acceptedFileExtensions,
    });
}
