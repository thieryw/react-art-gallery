export function generateImgSources(
    webpFiles: { url: string; name: string }[],
    jpegFiles: { url: string; name: string }[],
) {
    return webpFiles.map(({ url }, index) => [
        {
            "srcSet": url,
            "type": "image/webp",
        },
        {
            "srcSet": jpegFiles[index].url,
            "type": "image/jpeg",
        },
    ]);
}
