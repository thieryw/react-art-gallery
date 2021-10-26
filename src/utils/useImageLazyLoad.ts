import { useEffect, useRef } from "react";
import type { RefObject } from "react";

function loadImage(params: { imageRef: RefObject<HTMLImageElement>; imageUrl: string }) {
    const { imageRef, imageUrl } = params;
    if (!imageRef.current) {
        return;
    }
    imageRef.current.src = imageUrl;
}

export function useImageLazyLoad<
    /* eslint-disable */
    T extends HTMLImageElement = any,
>(params: { imageUrl: string }): { imageRef: RefObject<T> } {
    const { imageUrl } = params;
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
            });

            observer.unobserve(entries[0].target);
        });

        observer.observe(imageRef.current);
    }, [imageUrl]);

    return { imageRef };
}
