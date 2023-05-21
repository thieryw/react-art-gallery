import { memo, useState, useEffect, useMemo, useRef } from "react";
import { makeStyles } from "./theme";
import arrowSvg from "./assets/svg/next.svg";
import closeSvg from "./assets/svg/cancel.svg";
import { ReactSVG } from "react-svg";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { assert } from "tsafe/assert";
import CircleLoader from "react-spinners/CircleLoader";
import type { ImageSource } from "./utils/ImageSource";

type LightBoxProps = {
    images: {
        src: string;
        sources?: ImageSource[];
        alt?: string;
    }[];
    openingImageIndex: number | undefined;
    closeLightBox: () => void;
    className?: string;
};

export const LightBox = memo((props: LightBoxProps) => {
    const { openingImageIndex, closeLightBox, className, images } = props;
    const [currentIndex, setCurrentIndex] = useState<number | undefined>(undefined);
    const lightBoxRef = useRef<HTMLDivElement>(null);
    const loadedImageIndexes = useMemo<number[]>(() => [], []);

    useEffect(() => {
        if (openingImageIndex === undefined || !lightBoxRef.current) {
            return;
        }
        lightBoxRef.current.focus();

        if (!loadedImageIndexes.includes(openingImageIndex)) {
            loadedImageIndexes.push(openingImageIndex);
            loadedImageIndexes.sort((a, b) => a - b);
        }

        setCurrentIndex(loadedImageIndexes.find(index => index === openingImageIndex));
    }, [openingImageIndex]);

    const onClose = useConstCallback(() => {
        closeLightBox();
        setCurrentIndex(undefined);
    });

    const navigate = useConstCallback((direction: "prev" | "next") => {
        assert(currentIndex !== undefined);
        if (
            currentIndex ===
            (() => {
                switch (direction) {
                    case "next":
                        return images.length - 1;
                    case "prev":
                        return 0;
                }
            })()
        ) {
            const currentLoadedEnd = (() => {
                switch (direction) {
                    case "next":
                        return 0;
                    case "prev":
                        return loadedImageIndexes.length - 1;
                }
            })();
            const indexToAdd = (() => {
                switch (direction) {
                    case "next":
                        return 0;
                    case "prev":
                        return images.length - 1;
                }
            })();

            if (loadedImageIndexes[currentLoadedEnd] !== indexToAdd) {
                loadedImageIndexes.push(indexToAdd);
                loadedImageIndexes.sort((a, b) => a - b);
            }
            setCurrentIndex(indexToAdd);
            return;
        }

        const indexToAdd = (() => {
            switch (direction) {
                case "next":
                    return currentIndex + 1;
                case "prev":
                    return currentIndex - 1;
            }
        })();

        if (!loadedImageIndexes.includes(indexToAdd)) {
            loadedImageIndexes.push(indexToAdd);
            loadedImageIndexes.sort((a, b) => a - b);
        }

        setCurrentIndex(indexToAdd);
    });

    const navigateFactory = useCallbackFactory(([direction]: ["prev" | "next"]) => {
        navigate(direction);
    });

    const keyboardNavigate = useConstCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        const { key } = e;
        if (key !== "ArrowRight" && key !== "ArrowLeft" && key !== "Escape") {
            return;
        }

        switch (key) {
            case "ArrowLeft":
                navigate("prev");
                return;
            case "ArrowRight":
                navigate("next");
                return;
            case "Escape":
                onClose();
        }
    });

    const { classes, cx } = useStyles({
        "isDisplayed": openingImageIndex !== undefined,
    });

    return (
        <div
            tabIndex={0}
            onKeyDown={keyboardNavigate}
            className={cx(classes.root, className)}
            ref={lightBoxRef}
        >
            <ReactSVG
                src={closeSvg}
                className={cx(classes.closeButton, classes.navButtons)}
                onClick={onClose}
            />
            <ReactSVG
                src={arrowSvg}
                className={cx(classes.navButtons, classes.prevButton)}
                onClick={navigateFactory("prev")}
            />
            {loadedImageIndexes.map(imageIndex => (
                <LightBoxImage
                    src={images[imageIndex].src}
                    isDisplayed={imageIndex === currentIndex}
                    key={imageIndex}
                    sources={images[imageIndex].sources ?? undefined}
                    alt={images[imageIndex].alt}
                />
            ))}
            <ReactSVG
                src={arrowSvg}
                className={cx(classes.navButtons, classes.nextButton)}
                onClick={navigateFactory("next")}
            />
        </div>
    );
});

const useStyles = makeStyles<{ isDisplayed: boolean }>()((...[, { isDisplayed }]) => ({
    "root": {
        "zIndex": 4000,
        "display": "flex",
        "justifyContent": "space-between",
        "alignItems": "center",
        "boxSizing": "border-box",
        "position": "fixed",
        "top": 0,
        "left": 0,
        "backgroundColor": "rgba(0,0,0, 0.92)",
        "width": "100vw",
        "height": "100vh",
        "padding": 40,
        "opacity": isDisplayed ? 1 : 0,
        "pointerEvents": isDisplayed ? undefined : "none",
        "transform": `scale(${isDisplayed ? 1 : 0.8})`,
        "userSelect": "none",
        "transition": "opacity 400ms, transform 400ms",
        "outline": "none",
    },
    "navButtons": {
        "minWidth": 30,
        "maxWidth": 50,
        "fill": "white",
        "transition": "transform 500ms",
        ":hover": {
            "transform": "scale(1.2)",
            "cursor": "pointer",
        },
    },

    "prevButton": {
        "marginRight": 50,
        "transform": "rotate(180deg)",
        "position": "relative",
        ":hover": {
            "transform": "scale(1.2) rotate(180deg)",
        },
        "@media (max-width: 600px)": {
            "right": 30,
        },
    },
    "nextButton": {
        "marginLeft": 50,
        "position": "relative",
        "@media (max-width: 600px)": {
            "left": 30,
        },
    },
    "closeButton": {
        "position": "absolute",
        "top": 30,
        "right": 30,
    },
}));

const { LightBoxImage } = (() => {
    type LightBoxImageProps = {
        isDisplayed: boolean;
        src: string;
        alt?: string;
        sources?: ImageSource[];
    };

    const LightBoxImage = memo((props: LightBoxImageProps) => {
        const { src, isDisplayed, sources } = props;
        const [isLoaded, setIsLoaded] = useState(false);

        const { classes } = useStyles({
            "isVisible": isDisplayed && isLoaded,
        });

        const onLoad = useConstCallback(() => {
            setIsLoaded(true);
        });

        return (
            <>
                <picture className={classes.picture}>
                    {sources !== undefined &&
                        sources.map((source, index) => <source {...source} key={index} />)}
                    <img src={src} alt="lightBoxImage" onLoad={onLoad} className={classes.root} />
                    <div className={classes.spinner}>
                        <CircleLoader color="white" loading={!isLoaded} />
                    </div>
                </picture>
            </>
        );
    });

    const useStyles = makeStyles<{ isVisible: boolean }>()((...[, { isVisible }]) => ({
        "root": {
            "opacity": isVisible ? 1 : 0,
            "pointerEvents": isVisible ? undefined : "none",
            "gridRow": "1 / 2",
            "gridColumn": "1 / 2",
            "maxWidth": "75%",
            "maxHeight": "90%",
            "transition": "opacity 600ms",
        },
        "picture": {
            "position": "absolute",
            "top": 0,
            "left": 0,
            "display": "grid",
            "width": "100%",
            "height": "100%",
            "boxSizing": "border-box",
            "gridTemplateRows": "100%",
            "gridTemplateColumns": "100%",
            "alignItems": "center",
            "justifyItems": "center",
            "zIndex": -1,
        },
        "spinner": {
            "gridRow": "1 / 2",
            "gridColumn": "1 / 2",
            "marginLeft": -25,
            "marginTop": -25,
        },
    }));

    return { LightBoxImage };
})();
