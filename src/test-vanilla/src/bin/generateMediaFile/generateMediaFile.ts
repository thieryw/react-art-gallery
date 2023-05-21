import { existsSync, writeFileSync, appendFileSync } from "fs";
import { join } from "path";
import { crawl } from "../crawl";
import { sortFileArraysNumerically } from "./sortFileArraysNumerically";
import { generateImportArray } from "./generateImportArray";
import { generateExportString } from "./generateExportString";

export function generateMediaFile(params: {
    generatedFilePath: string;
    mediaPath: string;
    acceptedFileExtensions: string[];
    generatedFileName: string;
}) {
    const { generatedFilePath, mediaPath, acceptedFileExtensions, generatedFileName } = params;
    const tree = crawl({ "path": mediaPath });
    const generatedFileCompletePath = join(generatedFilePath.toString(), `${generatedFileName}.ts`);

    sortFileArraysNumerically({ tree });

    if (existsSync(generatedFileCompletePath)) {
        writeFileSync(generatedFileCompletePath, "");
    }

    const imports = generateImportArray({
        "mediaPath": mediaPath,
        "generatedFilePath": generatedFilePath,
        tree,
        acceptedFileExtensions,
    });

    imports.forEach(stringImport => {
        appendFileSync(join(generatedFilePath, `${generatedFileName}.ts`), `${stringImport}\n`);
    });

    const exports = generateExportString({
        tree,
        acceptedFileExtensions,
    });

    appendFileSync(join(generatedFilePath, `${generatedFileName}.ts`), exports);
}
