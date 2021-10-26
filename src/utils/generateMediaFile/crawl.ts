import { readdirSync, statSync } from "fs";
import { join } from "path";
import type { PathLike } from "fs";

export type Tree = {
    files: string[];
    directories: Record<string, Tree>;
};

function crawlRec(mediaPath: PathLike): Tree {
    const files: string[] = [];
    const directories: Tree["directories"] = {};

    readdirSync(mediaPath).forEach(fileOrDir => {
        const completePath = join(mediaPath.toString(), fileOrDir);

        if (statSync(completePath).isDirectory()) {
            directories[fileOrDir] = crawlRec(completePath);
            return;
        }

        files.push(fileOrDir);
    });

    return {
        files,
        directories,
    };
}

export function crawl(params: { mediaPath: PathLike }): Tree {
    const { mediaPath } = params;
    return crawlRec(mediaPath);
}
