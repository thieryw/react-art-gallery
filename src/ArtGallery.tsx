import { memo, useState } from "react";
import { makeStyles } from "./theme";
import { ThumbNailImage } from "./ThumbNailImage";
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
    images: {
        thumbNail: {
            name?: string;
            alt?: string;
            src: string;
            sources?: ImageSource[];
        };
        lightBox: {
            alt?: string;
            src: string;
            sources?: ImageSource[];
        };
    }[];
    imageAverageHeight?: number;
    hideImageNames?: boolean;
    thumbNailAlinement?: "vertical" | "horizontal";
    columnCountForVerticalAlinement?: number;
    breakpointsForColumns?: Record<string, number>;
    handleColumnCountAndResponsivenessYourSelf?: boolean;
};

export const ArtGallery = memo((props: ArtGalleryProps) => {
    const {
        imageAverageHeight,
        className,
        classes: classesProp,
        hideImageNames,
        images,
        thumbNailAlinement,
        columnCountForVerticalAlinement,
        breakpointsForColumns,
        handleColumnCountAndResponsivenessYourSelf,
    } = props;

    const [openingLightBoxImgIndex, setOpeningLightBoxImgIndex] = useState<number | undefined>(
        undefined,
    );

    const { classes, cx } = useStyles({
        "thumbNailAlinement": thumbNailAlinement ?? "horizontal",
        "columnCountForVerticalAlinement":
            columnCountForVerticalAlinement ??
            (breakpointsForColumns === undefined ? 5 : Object.keys(breakpointsForColumns).length),
        "breakpointsForColumns": breakpointsForColumns ?? {
            "xl": 1980,
            "l": 1620,
            "m+": 1280,
            "m": 920,
            "s": 500,
        },
        "handleColumnCountAndResponsivenessYourSelf":
            handleColumnCountAndResponsivenessYourSelf ?? false,
    });

    const onClickFactory = useCallbackFactory(([index]: [number]) => {
        setOpeningLightBoxImgIndex(index);
    });

    const closeLightBox = useConstCallback(() => {
        setOpeningLightBoxImgIndex(undefined);
    });

    return (
        <div className={cx(classes.root, className)}>
            {images.map(({ thumbNail }, index) => (
                <ThumbNailImage
                    thumbNailAlinement={thumbNailAlinement ?? "horizontal"}
                    url={thumbNail.src}
                    name={thumbNail.name}
                    imageAverageHeight={imageAverageHeight}
                    key={thumbNail.src}
                    onClick={onClickFactory(index)}
                    className={classesProp?.thumbNailImage}
                    hideImageName={hideImageNames ?? false}
                    sources={thumbNail.sources ?? undefined}
                />
            ))}

            <LightBox
                images={images.map(({ lightBox }) => ({
                    "src": lightBox.src,
                    "sources": lightBox.sources,
                    "alt": lightBox.alt,
                }))}
                openingImageIndex={openingLightBoxImgIndex}
                closeLightBox={closeLightBox}
                className={classesProp?.lightBox}
            />
        </div>
    );
});

const useStyles = makeStyles<
    Required<
        Pick<
            ArtGalleryProps,
            | "thumbNailAlinement"
            | "columnCountForVerticalAlinement"
            | "breakpointsForColumns"
            | "handleColumnCountAndResponsivenessYourSelf"
        >
    >
>()(
    (
        ...[
            ,
            {
                thumbNailAlinement,
                columnCountForVerticalAlinement,
                breakpointsForColumns,
                handleColumnCountAndResponsivenessYourSelf,
            },
        ]
    ) => {
        return {
            "root": {
                "position": "relative",
                ...(() => {
                    switch (thumbNailAlinement) {
                        case "horizontal":
                            return {
                                "display": "flex",
                                "flexFlow": "row wrap",
                            };
                        case "vertical":
                            return {
                                "columnGap": 0,
                                ...(handleColumnCountAndResponsivenessYourSelf
                                    ? {}
                                    : {
                                          "columnCount": columnCountForVerticalAlinement + 1,
                                          ...(() => {
                                              let out = {};
                                              const values = Object.values(breakpointsForColumns);
                                              values.forEach((value, index) => {
                                                  if (columnCountForVerticalAlinement - index < 1) {
                                                      return;
                                                  }
                                                  out = {
                                                      ...out,
                                                      [`@media (max-width: ${value}px)`]: {
                                                          "columnCount":
                                                              columnCountForVerticalAlinement - index,
                                                      },
                                                  };
                                              });
                                              return out;
                                          })(),
                                      }),
                            };
                    }
                })(),
                "boxSizing": "border-box",
            },
        };
    },
);
