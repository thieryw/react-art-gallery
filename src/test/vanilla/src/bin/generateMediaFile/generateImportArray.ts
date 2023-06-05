import type { Tree } from "../crawl";
import { relative, join, extname } from "path";
import { type } from "os";

export function generateImportArray(params: {
    mediaPath: string;
    tree: Tree;
    generatedFilePath: string;
    acceptedFileExtensions: string[];
}): string[] {
    const { mediaPath, tree, acceptedFileExtensions, generatedFilePath } = params;

    const out: string[] = [];

    const index = ((index: number) => {
        return function () {
            return index++;
        };
    })(0);

    function fillOutArrayRec(mediaPath: string, tree: Tree) {
        if (Object.keys(tree.directories).length === 0) {
            tree.files.forEach(file => {
                if (!acceptedFileExtensions.includes(extname(file))) {
                    return;
                }

                out.push(
                    `import _${index()} from "${type() === "Windows_NT" ? ".\\" : "./"}${relative(
                        generatedFilePath,
                        join(mediaPath, file),
                    )}";`,
                );
            });

            return;
        }

        const directories = tree.directories;

        Object.keys(directories).forEach(key => {
            fillOutArrayRec(join(mediaPath, key), directories[key]);
        });
    }
    fillOutArrayRec(mediaPath, tree);
    return out;
}
