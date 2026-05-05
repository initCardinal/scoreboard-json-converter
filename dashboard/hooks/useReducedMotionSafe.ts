"use client";

import { useReducedMotion } from "framer-motion";

// Wraps useReducedMotion so callers always get a boolean (never null on first render).
export function useReducedMotionSafe(): boolean {
  const reduced = useReducedMotion();
  return reduced === true;
}
