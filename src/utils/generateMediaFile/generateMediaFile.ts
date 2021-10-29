import { existsSync, writeFileSync, appendFileSync } from "fs";
import { join } from "path";
import { generatedFileName } from "./generatedFileName";
import { crawl } from "../crawl";
import { sortFileArraysNumerically } from "./sortFileArraysNumerically";
import { generateImportArray } from "./generateImportArray";
import { generateExportString } from "./generateExportString";

export function generateMediaFile(params: {
    generatedFilePath: string;
    mediaPath: string;
    acceptedFileExtensions: string[];
}) {
    const { generatedFilePath, mediaPath, acceptedFileExtensions } = params;
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
