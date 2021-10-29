import type { Tree } from "../crawl";
import { extname } from "path";

export function generateExportString(params: { tree: Tree; acceptedFileExtensions: string[] }): string {
    const { acceptedFileExtensions, /*generatedFilePath,*/ tree } = params;

    const out = "\n\nexport const files = {\n";

    const index = ((index: number) => {
        return () => {
            return index++;
        };
    })(0);

    function appendStringRec(tree: Tree) {
        let out = "";

        if (Object.keys(tree.directories).length === 0) {
            if (tree.files.length === 0) {
                return out;
            }

            out = `"files": [\n`;

            tree.files.forEach(file => {
                if (!acceptedFileExtensions.includes(extname(file))) {
                    return out;
                }

                out = `${out}{
					"url": _${index()},
					"name": "${file.replace(/^\d+-/g, "").replace(/\.\w+$/g, "")}"
				},\n`;
            });

            out = `${out}\n],\n`;

            return out;
        }

        const directories = tree.directories;
        out = `${out}\n "directories": {\n`;

        Object.keys(directories).forEach(key => {
            out = `${out}\n
				"${key}": {
				${appendStringRec(directories[key])}
				},\n
			`;
        });

        out = out + "},\n";
        return out;
    }

    return out + appendStringRec(tree) + "};";
}
