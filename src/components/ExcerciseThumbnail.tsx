import { h, JSX } from "preact";

interface Props {
  src?: string;
  alt: string;
  size?: number;
}

/**
 * Displays exercise images.
 * - Tries the provided src.
 * - If the remote image fails, falls back to local dumbbell thumbnail.
 */
export function ExerciseThumbnail({ src, alt, size = 40 }: Props): JSX.Element {
  const fallback = "/images/exercise-thumbnail.svg";

  const handleError = (e: JSX.TargetedEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget as HTMLImageElement;
    // Avoid infinite loops: only swap if it's not already the fallback
    if (!img.src.endsWith("exercise-thumbnail.svg")) {
      img.onerror = null;
      img.src = fallback;
    }
  };

  return (
    <img
      src={src || fallback}
      alt={alt}
      width={size}
      height={size}
      style={{
        borderRadius: 8,
        objectFit: "cover",
      }}
      onError={handleError}
    />
  );
}
