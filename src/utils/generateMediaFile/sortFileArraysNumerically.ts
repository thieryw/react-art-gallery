import type { Tree } from "../crawl";

function extractNumberFromStringBeginning(str: string) {
    return parseInt((str.match(/^\d+/g) ?? "")[0] ?? 0);
}

function sortFileArraysNumericallyRec(tree: Tree) {
    tree.files.sort((a, b) => extractNumberFromStringBeginning(a) - extractNumberFromStringBeginning(b));

    const dirObject = tree.directories;
    const dirObjectKeys = Object.keys(dirObject);

    if (dirObjectKeys.length === 0) {
        return;
    }

    dirObjectKeys.forEach(key => {
        sortFileArraysNumericallyRec(dirObject[key]);
    });
}

export function sortFileArraysNumerically(params: { tree: Tree }) {
    const { tree } = params;

    sortFileArraysNumericallyRec(tree);
}
