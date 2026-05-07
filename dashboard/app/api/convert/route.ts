import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

// process.cwd() is the dashboard directory when running `next dev` or `next build`.
// The project root is one level up.
const PROJECT_ROOT = path.resolve(process.cwd(), "..");
const CONVERT_SCRIPT = path.join(PROJECT_ROOT, "convert.py");
const INPUT_FILE = path.join(PROJECT_ROOT, "Scoreboard Test.xlsx");
const OUTPUT_FILE = path.join(PROJECT_ROOT, "output.json");

// Prefer the venv Python so openpyxl is available without activating the venv manually.
// Fall back to system python / py launcher if the venv doesn't exist yet.
const VENV_PYTHON = path.join(PROJECT_ROOT, ".venv", "Scripts", "python.exe");

function resolvePythonCandidates(): string[] {
  const candidates: string[] = [];
  if (fs.existsSync(VENV_PYTHON)) candidates.push(VENV_PYTHON);
  candidates.push("python", "py");
  return candidates;
}

function runPython(pythonBin: string): Promise<{ stdout: string; stderr: string; code: number }> {
  return new Promise((resolve) => {
    const args = [
      CONVERT_SCRIPT,
      "--input",
      INPUT_FILE,
      "--output",
      OUTPUT_FILE,
    ];

    const proc = spawn(pythonBin, args, { cwd: PROJECT_ROOT });
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on("data", (d: Buffer) => { stderr += d.toString(); });

    proc.on("close", (code) => {
      resolve({ stdout, stderr, code: code ?? 1 });
    });

    proc.on("error", () => {
      resolve({ stdout: "", stderr: `${pythonBin} not found`, code: 127 });
    });
  });
}

export async function POST() {

  // Try each candidate in order; stop at the first that doesn't return "not found".
  let result = { stdout: "", stderr: "No Python executable found.", code: 127 };
  for (const bin of resolvePythonCandidates()) {
    result = await runPython(bin);
    if (result.code !== 127) break;
  }

  const success = result.code === 0;
  const generatedAt = success ? new Date().toISOString() : null;

  return NextResponse.json(
    {
      success,
      exit_code: result.code,
      stdout: result.stdout,
      stderr: result.stderr,
      generated_at: generatedAt,
    },
    { status: success ? 200 : 500 }
  );
}
