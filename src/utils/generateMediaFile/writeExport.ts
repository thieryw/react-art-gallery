import type { Tree } from "./crawl";
import { appendFileSync } from "fs";
import type { PathLike } from "fs";
import { join, extname } from "path";
import { generatedFileName } from "./generatedFileName";

export function writeExport(params: {
    tree: Tree;
    generatedFilePath: PathLike;
    acceptedFileExtensions: string[];
}) {
    const { generatedFilePath, tree, acceptedFileExtensions } = params;
    const path = join(generatedFilePath.toString(), `${generatedFileName}.ts`);
    let index = 0;

    appendFileSync(path, "\n\nexport const files = {\n");

    function generateStringRec(dirArborescence: Tree): string {
        let str = `"files": [\n`;

        dirArborescence.files.forEach(file => {
            if (!acceptedFileExtensions.includes(extname(file))) {
                return;
            }
            str = `${str}{
				"url": _${index++},
				"name": "${file.replace(/^\d+-/g, "").replace(/\.\w+$/g, "")}"
			},\n`;
        });

        str = `${str}\n],\n`;

        if (Object.keys(dirArborescence.directories).length === 0) {
            return str;
        }

        const directories = dirArborescence.directories;

        str = `${str}\n "directories": {\n`;

        Object.keys(directories).forEach(key => {
            str = `${str}\n
				"${key}": {
				${generateStringRec(directories[key])}
				},\n
			`;
        });

        str = str + "},";

        return str;
    }

    appendFileSync(path, `${generateStringRec(tree)}}`);
}
