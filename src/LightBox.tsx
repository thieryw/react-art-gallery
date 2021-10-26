import { memo, useState, useEffect, useMemo, useRef } from "react";
import { makeStyles } from "./theme";
import arrowSvg from "./assets/svg/next.svg";
import closeSvg from "./assets/svg/cancel.svg";
import { ReactSVG } from "react-svg";
import { useConstCallback } from "powerhooks/useConstCallback";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { assert } from "tsafe/assert";
import CircleLoader from "react-spinners/CircleLoader";

type LightBoxProps = {
    imageUrls: string[];
    openingImageIndex: number | undefined;
    closeLightBox: () => void;
};

const useStyles = makeStyles<{ isDisplayed: boolean }>()((...[, { isDisplayed }]) => ({
    "root": {
        "display": "flex",
        "justifyContent": "space-between",
        "alignItems": "center",
        "boxSizing": "border-box",
        "position": "fixed",
        "top": 0,
        "left": 0,
        "backgroundColor": "rgba(0,0,0, 0.8)",
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
    },

    "prevButton": {
        "transform": "rotate(180deg)",
        "marginRight": 50,
    },
    "nextButton": {
        "marginLeft": 50,
    },
    "closeButton": {
        "position": "absolute",
        "top": 30,
        "right": 30,
    },
    "imageWrapper": {
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
}));

export const LightBox = memo((props: LightBoxProps) => {
    const { imageUrls, openingImageIndex, closeLightBox } = props;
    const [currentIndex, setCurrentIndex] = useState<number | undefined>(undefined);
    const lightBoxRef = useRef<HTMLDivElement>(null);
    const loadedImageIndexes = useMemo<number[]>(() => [], []);

    useEffect(() => {
        if (openingImageIndex === undefined) {
            return;
        }

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
                        return imageUrls.length - 1;
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
                        return imageUrls.length - 1;
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

    const onLoad = useConstCallback(() => {
        if (!lightBoxRef.current) {
            return;
        }

        lightBoxRef.current.focus();
    });

    const { classes, cx } = useStyles({
        "isDisplayed": openingImageIndex !== undefined,
    });

    return (
        <div
            tabIndex={0}
            onKeyDown={keyboardNavigate}
            className={classes.root}
            onLoad={onLoad}
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
            <div className={classes.imageWrapper}>
                {loadedImageIndexes.map(imageIndex => (
                    <LightBoxImage
                        url={imageUrls[imageIndex]}
                        isDisplayed={imageIndex === currentIndex}
                        key={imageIndex}
                    />
                ))}
            </div>
            <ReactSVG
                src={arrowSvg}
                className={cx(classes.navButtons, classes.nextButton)}
                onClick={navigateFactory("next")}
            />
        </div>
    );
});

const { LightBoxImage } = (() => {
    type LightBoxImageProps = {
        isDisplayed: boolean;
        url: string;
    };

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
        "spinner": {
            "gridRow": "1 / 2",
            "gridColumn": "1 / 2",
            "marginLeft": -25,
            "marginTop": -25,
        },
    }));

    const LightBoxImage = memo((props: LightBoxImageProps) => {
        const { url, isDisplayed } = props;
        const [isLoaded, setIsLoaded] = useState(false);

        const { classes } = useStyles({
            "isVisible": isDisplayed && isLoaded,
        });

        const onLoad = useConstCallback(() => {
            setIsLoaded(true);
        });

        return (
            <>
                <img src={url} alt="lightBoxImage" className={classes.root} onLoad={onLoad} />
                <div className={classes.spinner}>
                    <CircleLoader color="white" loading={!isLoaded} />
                </div>
            </>
        );
    });

    return { LightBoxImage };
})();
