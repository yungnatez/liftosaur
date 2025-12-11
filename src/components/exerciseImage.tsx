import { JSX, h, ComponentChildren, Fragment } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { IconSpinner } from "./icons/iconSpinner";
import { IExerciseType, ISettings } from "../types";
import { IconDefaultExercise } from "./icons/iconDefaultExercise";
import { ExerciseImageUtils } from "../models/exerciseImage";
import { Exercise } from "../models/exercise";

interface IProps {
  exerciseType: IExerciseType;
  size: "large" | "small";
  useTextForCustomExercise?: boolean;
  useBorderForCustomExercise?: boolean;
  suppressCustom?: boolean;
  settings?: ISettings;
  className?: string;
  customClassName?: string;
}

const FALLBACK_SRC = "/images/exercise-thumbnail.svg";

export function ExerciseImage(props: IProps): JSX.Element | null {
  const { size } = props;
  const exercise = Exercise.get(props.exerciseType, props.settings?.exercises || {});
  const exerciseType = {
    id: props.exerciseType.id,
    equipment: props.exerciseType.equipment || exercise.defaultEquipment,
  };

  const imgRef = useRef<HTMLImageElement>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Determine if Liftosaur thinks a specific image exists
  const doesExist =
    ExerciseImageUtils.exists(exerciseType, size) ||
    (!props.suppressCustom && ExerciseImageUtils.existsCustom(exerciseType, size, props.settings));

  // Primary (remote) URL if it exists
  const primarySrc = ExerciseImageUtils.url(exerciseType, size, props.settings);
  // Initial src: remote if available, otherwise straight to fallback
  const initialSrc = doesExist ? primarySrc : FALLBACK_SRC;

  useEffect(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;

    const handleLoad = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsError(true);
      setIsLoading(false);
      // Switch to local dumbbell thumbnail if remote fails
      if (img.src.indexOf(FALLBACK_SRC) === -1) {
        img.src = FALLBACK_SRC;
      }
    };

    if (img.complete && img.naturalWidth > 0) {
      // Image already loaded from cache
      setIsLoading(false);
    } else {
      img.addEventListener("load", handleLoad);
      img.addEventListener("error", handleError);
    }

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [initialSrc]);

  // Only hide while loading – not on error, since we want to show the fallback
  let className = `inline ${props.className ?? ""} `;
  if (isLoading) {
    className += "invisible h-0";
  }

  if (size === "small") {
    return (
      <>
        <img
          data-cy="exercise-image-small"
          ref={imgRef}
          className={className}
          src={initialSrc}
          alt={Exercise.nameWithEquipment(exercise, props.settings)}
        />

        {/* If you still want the text/icon fallback for custom exercises with NO image at all,
            keep this block. Since we now always have a fallback thumbnail, this will mostly
            apply when you explicitly want text instead of an icon. */}
        {!doesExist &&
          !props.useTextForCustomExercise &&
          props.suppressCustom && (
            <div className={`inline-block ${props.className}`}>
              <div
                className="relative inline-block w-full h-full overflow-hidden align-middle"
                style={{ paddingBottom: "100%" }}
              >
                <IconDefaultExercise className={`absolute top-0 left-0 w-full h-full`} />
              </div>
            </div>
          )}

        {!doesExist &&
          props.useTextForCustomExercise && (
            <div className={`relative ${props.className} ${props.customClassName}`} style={{ paddingBottom: "100%" }}>
              <div className="absolute inset-0 flex items-center justify-start text-xs text-left bg-background-image text-text-secondarysubtle">
                <div
                  className="flex items-stretch justify-start w-full h-full p-1 leading-3 fade-mask"
                  style={{ fontSize: "0.7rem" }}
                >
                  {Exercise.nameWithEquipment(exercise, props.settings)}
                </div>
              </div>
            </div>
          )}
      </>
    );
  } else {
    // Large image version
    return (
      <>
        <img
          ref={imgRef}
          data-cy="exercise-image-large"
          className={className}
          src={initialSrc}
          alt={Exercise.nameWithEquipment(exercise, props.settings)}
        />
        <ExerciseImageAuxiliary size={props.size} isError={isError} isLoading={isLoading} />
      </>
    );
  }
}

function ExerciseImageAuxiliary(props: {
  size: "large" | "small";
  isError: boolean;
  isLoading: boolean;
}): JSX.Element | null {
  // We only want to show a spinner while loading.
  // Errors just fall back to the local dumbbell image, so no need for red error text.
  if (props.isLoading) {
    return (
      <ExerciseNoImage size={props.size}>
        <div className="w-full text-center">
          <IconSpinner width={20} height={20} />
        </div>
      </ExerciseNoImage>
    );
  } else {
    return null;
  }
}

interface INoImageProps {
  children: ComponentChildren;
  size: "large" | "small";
}

function ExerciseNoImage(props: INoImageProps): JSX.Element | null {
  return (
    <div className="px-4 py-10 my-4 text-xs leading-normal text-center border border-dotted rounded-lg border-border-neutral bg-background-neutral">
      {props.children}
    </div>
  );
}
