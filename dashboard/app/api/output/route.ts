import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const OUTPUT_FILE =
  process.env.NODE_ENV === "production"
    ? path.resolve(process.cwd(), "public/output.json")
    : path.resolve(process.cwd(), "../output.json");

export async function GET() {
  if (!fs.existsSync(OUTPUT_FILE)) {
    return NextResponse.json(
      { error: "output.json not found. Run the converter first." },
      { status: 404 }
    );
  }

  let raw: string;
  try {
    raw = fs.readFileSync(OUTPUT_FILE, "utf-8");
  } catch {
    return NextResponse.json(
      { error: "Could not read output.json." },
      { status: 500 }
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "output.json exists but is not valid JSON. Re-run the converter." },
      { status: 500 }
    );
  }

  return NextResponse.json(parsed);
}
