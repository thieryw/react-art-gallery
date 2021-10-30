import { makeStyles } from "./theme";
import { memo, useState, useRef } from "react";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useImageLazyLoad } from "./utils/useImageLazyLoad";

export type ThumbNailImageProps = {
    className?: string;
    url: string;
    sources?: {
        srcSet: string;
        type: string;
    }[];
    name?: string;
    imageAverageHeight?: number;
    onClick: () => void;
    hideImageName: boolean;
};

export const ThumbNailImage = memo((props: ThumbNailImageProps) => {
    const { name, url, imageAverageHeight, onClick, className, hideImageName, sources } = props;

    const imageWrapperRef = useRef<HTMLDivElement>(null);
    const [isImgDimReset, setIsImgDimReset] = useState(false);
    const [imageOpacity, setImageOpacity] = useState(0);

    const { imageRef } = useImageLazyLoad({ "imageUrl": url });

    const onLoad = useConstCallback(() => {
        if (!imageRef.current || !imageWrapperRef.current) {
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
    });

    return (
        <div ref={imageWrapperRef} className={cx(classes.root, className)}>
            <picture>
                {sources !== undefined &&
                    sources.map((source, index) => <source key={index} {...source} />)}

                <img
                    onLoad={onLoad}
                    ref={imageRef}
                    className={classes.image}
                    width="300"
                    height="200"
                    alt={name}
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
}>()((...[, { isImgDimReset, imageOpacity, imageAverageHeight }]) => ({
    "root": {
        "margin": 3,
        "flex": "auto",
        "overflow": "hidden",
        "position": "relative",
    },
    "image": {
        "objectFit": "cover",
        "verticalAlign": "middle",
        "width": isImgDimReset ? "100%" : "auto",
        "height": (() => {
            if (isImgDimReset) {
                return "100%";
            }
            return imageAverageHeight ?? "250px";
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
