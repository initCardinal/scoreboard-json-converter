"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./Button";
import { copyToClipboard } from "@/lib/download";

interface Props {
  text: string;
  label?: string;
  size?: "sm" | "md";
}

export function CopyButton({ text, label = "Copy", size = "sm" }: Props) {
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <Button
      size={size}
      variant="secondary"
      onClick={handle}
      iconLeft={copied ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? "Copied" : label}
    </Button>
  );
}
