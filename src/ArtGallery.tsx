import { memo, useState } from "react";
import { makeStyles } from "./theme";
import { ThumbNailImage } from "./ThumbNailImage";
import type { ImageProps } from "./ThumbNailImage";
import { LightBox } from "./LightBox";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useConstCallback } from "powerhooks/useConstCallback";

export type ArtGalleryProps = {
    className?: string;
    classes?: {
        thumbNailImage?: string;
        lightBox?: string;
    };
    thumbNailImages: Pick<ImageProps, "name" | "url">[];
    lightBoxImages: Pick<ImageProps, "url">[];
    imageAverageHeight?: number;
    hideImageNames?: boolean;
};

const useStyles = makeStyles()({
    "root": {
        "display": "flex",
        "flexFlow": "row wrap",
        "boxSizing": "border-box",
    },
});

export const ArtGallery = memo((props: ArtGalleryProps) => {
    const {
        thumbNailImages,
        imageAverageHeight,
        lightBoxImages,
        className,
        classes: classesProp,
        hideImageNames,
    } = props;
    const [openingLightBoxImgIndex, setOpeningLightBoxImgIndex] = useState<number | undefined>(
        undefined,
    );

    const { classes, cx } = useStyles();

    const onClickFactory = useCallbackFactory(([index]: [number]) => {
        setOpeningLightBoxImgIndex(index);
    });

    const closeLightBox = useConstCallback(() => {
        setOpeningLightBoxImgIndex(undefined);
    });

    return (
        <div className={cx(classes.root, className)}>
            {thumbNailImages.map(({ url, name }, index) => (
                <ThumbNailImage
                    url={url}
                    name={name}
                    imageAverageHeight={imageAverageHeight}
                    key={url}
                    onClick={onClickFactory(index)}
                    className={classesProp?.thumbNailImage}
                    hideImageName={hideImageNames ?? false}
                />
            ))}

            <LightBox
                imageUrls={lightBoxImages.map(({ url }) => url)}
                openingImageIndex={openingLightBoxImgIndex}
                closeLightBox={closeLightBox}
                className={classesProp?.lightBox}
            />
        </div>
    );
});
