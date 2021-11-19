import { memo, useState } from "react";
import { makeStyles } from "./theme";
import { ThumbNailImage } from "./ThumbNailImage";
import type { ThumbNailImageProps } from "./ThumbNailImage";
import { LightBox } from "./LightBox";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useConstCallback } from "powerhooks/useConstCallback";
import { ImageSource } from "./utils/ImageSource";

export type ArtGalleryProps = {
    className?: string;
    classes?: {
        thumbNailImage?: string;
        lightBox?: string;
    };
    thumbNailImages: Pick<ThumbNailImageProps, "name" | "url">[];
    thumbNailImageSources?: ImageSource[][];
    lightBoxImageSources?: ImageSource[][];
    lightBoxImages: Pick<ThumbNailImageProps, "url">[];
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
        thumbNailImageSources,
        lightBoxImageSources,
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
                    sources={
                        thumbNailImageSources !== undefined ? thumbNailImageSources[index] : undefined
                    }
                />
            ))}

            <LightBox
                imageUrls={lightBoxImages.map(({ url }) => url)}
                imageSources={lightBoxImageSources}
                openingImageIndex={openingLightBoxImgIndex}
                closeLightBox={closeLightBox}
                className={classesProp?.lightBox}
            />
        </div>
    );
});
