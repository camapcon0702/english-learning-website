"use client";

import React from "react";
import clsx from "clsx";

function isImageLikeSrc(src?: string | null) {
  if (!src) return false;
  const s = src.trim();
  return /^https?:\/\//i.test(s) || /^data:image\//i.test(s);
}

export default function TopicIcon({
  icon,
  alt,
  fallbackEmoji = "📚",
  className,
}: {
  icon?: string | null;
  alt?: string;
  fallbackEmoji?: string;
  className?: string;
}) {
  const [broken, setBroken] = React.useState(false);

  const value = (icon ?? "").trim();
  const showImage = value !== "" && !broken && isImageLikeSrc(value);

  if (showImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={value}
        alt={alt || "Topic icon"}
        className={clsx("w-full h-full object-cover", className)}
        loading="lazy"
        decoding="async"
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <span className={className} aria-hidden>
      {value !== "" ? value : fallbackEmoji}
    </span>
  );
}


