import { ArtGallery } from "react-art-gallery";
import { files as jpegFiles } from "./generatedImgExports";
import { files as webpFiles } from "./generatedWebpExports";
import { generateImgSources } from "./tools/generateImgSources";

const jpg = jpegFiles.files;
const webp = webpFiles.files;

const imageSources = generateImgSources(webp, jpg);
export function App() {
    return (
        <div className="App">
            <ArtGallery
                images={webp.map(({ name, url }, index) => {
                    return {
                        "thumbNail": {
                            "src": url,
                            "sources": imageSources[index],
                            "alt": name,
                            name,
                        },
                        "lightBox": {
                            "src": url,
                            "sources": imageSources[index],
                            "alt": name,
                        },
                    };
                })}
                imageAverageHeight={200}
                thumbNailAlinement="vertical"
                hideImageNames={false}
            />
        </div>
    );
}
