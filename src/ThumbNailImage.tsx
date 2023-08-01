import { makeStyles } from "./theme";
import { memo, useState, useRef } from "react";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useImageLazyLoad } from "./utils/useImageLazyLoad";
import type { ImageSource } from "./utils/ImageSource";

export type ThumbNailImageProps = {
    className?: string;
    url: string;
    alt?: string;
    sources?: ImageSource[];
    name?: string;
    imageAverageHeight?: number;
    onClick: () => void;
    hideImageName: boolean;
    thumbNailAlinement: "vertical" | "horizontal";
};

export const ThumbNailImage = memo((props: ThumbNailImageProps) => {
    const {
        name,
        url,
        imageAverageHeight,
        onClick,
        className,
        hideImageName,
        sources,
        thumbNailAlinement,
        alt,
    } = props;

    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const [isImgDimReset, setIsImgDimReset] = useState(false);
    const [imageOpacity, setImageOpacity] = useState(0);

    const { imageRef } = useImageLazyLoad({
        "imageUrl": url,
        "sources": sources?.map(({ srcSet }) => srcSet),
    });

    const onLoad = useConstCallback(() => {
        if (!imageRef.current || !imageWrapperRef.current) {
            return;
        }

        if (thumbNailAlinement === "vertical") {
            setImageOpacity(1);
            return;
        }

        const wrapperStyle = imageWrapperRef.current.style;
        wrapperStyle.width = `${imageRef.current.clientWidth}px`;

        setIsImgDimReset(true);
        setImageOpacity(1);
    });

    const { classes, cx } = useStyles({
        isImgDimReset,
        imageOpacity,
        imageAverageHeight,
        thumbNailAlinement,
    });

    return (
        <div ref={imageWrapperRef} className={cx(classes.root, className)}>
            <picture ref={imageRef}>
                {sources !== undefined &&
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    sources.map(({ srcSet, ...rest }, index) => <source key={index} {...rest} />)}

                <img
                    onLoad={onLoad}
                    className={classes.image}
                    width="300"
                    height="200"
                    alt={name ?? alt ?? undefined}
                />
            </picture>
            <div onClick={onClick} className={classes.caption}>
                {name !== undefined && !hideImageName && (
                    <p className={classes.captionParagraph}>{name}</p>
                )}
            </div>
        </div>
    );
});

const useStyles = makeStyles<{
    isImgDimReset: boolean;
    imageOpacity: number;
    imageAverageHeight: number | undefined;
    thumbNailAlinement: "vertical" | "horizontal";
}>()((...[, { isImgDimReset, imageOpacity, imageAverageHeight, thumbNailAlinement }]) => ({
    "root": {
        "position": "relative",
        ...(() => {
            switch (thumbNailAlinement) {
                case "horizontal":
                    return {
                        "flex": "auto",
                        "overflow": "hidden",
                        "margin": 3,
                    };
                case "vertical":
                    return {
                        "display": "grid",
                        "gridTemplateRows": "1fr auto",
                        "breakInside": "avoid",
                        "maxWidth": "100%",
                        "margin": "0px 3px 6px 3px",
                    };
            }
        })(),
    },
    "image": {
        ...(() => {
            switch (thumbNailAlinement) {
                case "horizontal":
                    return {
                        "width": isImgDimReset ? "100%" : "auto",
                        "height": (() => {
                            if (isImgDimReset) {
                                return "100%";
                            }
                            return imageAverageHeight ?? "250px";
                        })(),
                        "objectFit": "cover",
                        "verticalAlign": "middle",
                    };
                case "vertical":
                    return {
                        "width": "100%",
                        "display": "block",
                        "height": "100%",
                    };
            }
        })(),
        "transition": "opacity 300ms",
        "opacity": imageOpacity,
    },
    "caption": {
        "position": "absolute",
        "padding": 30,
        "top": 0,
        "left": 0,
        "width": "100%",
        "height": "100%",
        "backgroundColor": "rgba(18, 13, 13, 0.8)",
        "display": "flex",
        "justifyContent": "center",
        "alignItems": "center",
        "opacity": 0,
        "transition": "opacity 400ms",
        "boxSizing": "border-box",
        ":hover": {
            "opacity": 1,
            "cursor": "pointer",
        },
    },

    "captionParagraph": {
        "color": "white",
        "wordBreak": "break-all",
        "textAlign": "center",
    },
}));
