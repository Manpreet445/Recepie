"use client";

import { LayoutGroup } from "framer-motion";

// wraps the app in framer motion's LayoutGroup so shared
// element transitions work across different pages
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutGroup>{children}</LayoutGroup>;
}
