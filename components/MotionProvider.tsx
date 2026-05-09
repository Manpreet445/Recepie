"use client";

import { LayoutGroup } from "framer-motion";

/** Wraps the app tree in Framer Motion's LayoutGroup for shared-element transitions. */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutGroup>{children}</LayoutGroup>;
}
