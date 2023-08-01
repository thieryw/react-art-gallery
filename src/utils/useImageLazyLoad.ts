import { useEffect, useRef } from "react";
import type { RefObject } from "react";

function loadImage(params: {
    imageRef: RefObject<HTMLImageElement>;
    imageUrl: string;
    sources?: (string | undefined)[];
}) {
    const { imageRef, imageUrl, sources } = params;
    if (!imageRef.current) {
        return;
    }
    imageRef.current.src = imageUrl;
    if (sources === undefined) {
        return;
    }
    sources.forEach((source, index) => {
        if (!imageRef.current) {
            return;
        }
        const sourceElement = imageRef.current.getElementsByTagName("source")[index];
        if (!sourceElement || source === undefined) {
            return;
        }

        sourceElement.srcset = source;
    });
}

export function useImageLazyLoad<
    /* eslint-disable */
    T extends HTMLImageElement = any,
>(params: { imageUrl: string; sources?: (string | undefined)[] }): { imageRef: RefObject<T> } {
    const { imageUrl, sources } = params;
    const imageRef = useRef<T>(null);

    useEffect(() => {
        if (!imageRef.current) {
            return;
        }
        const observer = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) {
                return;
            }

            loadImage({
                imageRef,
                imageUrl,
                sources,
            });

            observer.unobserve(entries[0].target);
        });

        observer.observe(imageRef.current);
    }, [imageUrl]);

    return { imageRef };
}
