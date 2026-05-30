import { spawn } from "child_process";
import { writeFileSync, mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

export interface ExecutionResult {
  success: boolean;
  output: string;
  error: string | null;
  executionTime: number;
}

const TIMEOUT_MS = 15000;

export const EXECUTABLE_LANGUAGES = [
  "python", "javascript", "typescript", "java", "cpp", "rust", "go",
] as const;
export type ExecutableLanguage = (typeof EXECUTABLE_LANGUAGES)[number];

function runProcess(
  cmd: string,
  args: string[],
  input: string | null,
  timeoutMs: number,
  env?: Record<string, string>
): Promise<{ stdout: string; stderr: string; exitCode: number; timedOut: boolean }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, ...env },
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    } else {
      child.stdin.end();
    }

    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode: code ?? -1, timedOut });
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ stdout, stderr: String(err), exitCode: -1, timedOut: false });
    });
  });
}

function runInProcessJS(code: string): ExecutionResult {
  const start = Date.now();
  const logs: string[] = [];
  const mockConsole = {
    log: (...args: unknown[]) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
    error: (...args: unknown[]) => logs.push("❌ " + args.map(String).join(" ")),
    warn: (...args: unknown[]) => logs.push("⚠️ " + args.map(String).join(" ")),
    info: (...args: unknown[]) => logs.push("ℹ️ " + args.map(String).join(" ")),
  };
  try {
    const fn = new Function("console", `"use strict";\n${code}`);
    fn(mockConsole);
    return {
      success: true,
      output: logs.join("\n") || "(no output)",
      error: null,
      executionTime: Date.now() - start,
    };
  } catch (e: unknown) {
    const err = String(e);
    return {
      success: false,
      output: logs.length > 0 ? logs.join("\n") + "\n\n❌ " + err : "❌ " + err,
      error: err,
      executionTime: Date.now() - start,
    };
  }
}

async function runPython(code: string, workDir: string, version: 2 | 3 = 3): Promise<ExecutionResult> {
  const file = join(workDir, "main.py");
  writeFileSync(file, code);
  const start = Date.now();
  const pythonCmd = version === 2 ? "python2" : "python3";
  const { stdout, stderr, exitCode, timedOut } = await runProcess(
    pythonCmd, [file], null, TIMEOUT_MS
  );
  if (timedOut) {
    return { success: false, output: `⏱️ Execution timed out after ${TIMEOUT_MS / 1000}s`, error: "Timeout", executionTime: Date.now() - start };
  }
  const out = stdout || (exitCode !== 0 ? stderr : "(no output)");
  return { success: exitCode === 0, output: out, error: exitCode !== 0 ? stderr : null, executionTime: Date.now() - start };
}

async function runTypeScript(code: string, workDir: string): Promise<ExecutionResult> {
  const file = join(workDir, "main.ts");
  writeFileSync(file, code);
  const start = Date.now();
  const { stdout, stderr, exitCode, timedOut } = await runProcess(
    "node",
    ["--import", "data:text/javascript,import{register}from\"module\";import{pathToFileURL}from\"url\";", file],
    null,
    TIMEOUT_MS
  );
  if (timedOut) {
    return { success: false, output: `⏱️ Timed out after ${TIMEOUT_MS / 1000}s`, error: "Timeout", executionTime: Date.now() - start };
  }
  const out = stdout || (exitCode !== 0 ? stderr : "(no output)");
  return { success: exitCode === 0, output: out, error: exitCode !== 0 ? stderr : null, executionTime: Date.now() - start };
}

async function runCpp(code: string, workDir: string): Promise<ExecutionResult> {
  const srcFile = join(workDir, "main.cpp");
  const outFile = join(workDir, "main");
  writeFileSync(srcFile, code);
  const start = Date.now();
  const compile = await runProcess("g++", ["-o", outFile, srcFile, "-std=c++17"], null, TIMEOUT_MS);
  if (compile.exitCode !== 0) {
    return { success: false, output: compile.stderr || compile.stdout || "❌ Compilation failed", error: compile.stderr, executionTime: Date.now() - start };
  }
  const { stdout, stderr, exitCode, timedOut } = await runProcess(outFile, [], null, TIMEOUT_MS);
  if (timedOut) {
    return { success: false, output: `⏱️ Timed out after ${TIMEOUT_MS / 1000}s`, error: "Timeout", executionTime: Date.now() - start };
  }
  const out = stdout || (exitCode !== 0 ? stderr : "(no output)");
  return { success: exitCode === 0, output: out, error: exitCode !== 0 ? stderr : null, executionTime: Date.now() - start };
}

function unsupportedLanguage(lang: string): ExecutionResult {
  return {
    success: false,
    output: `⚠️ Language "${lang}" requires compilation and is not available in the sandbox environment.\n\nSupported languages: Python 2/3, JavaScript, C++\nOther languages (Java, Rust, Go, TypeScript) — coming soon!`,
    error: `Unsupported language: ${lang}`,
    executionTime: 0,
  };
}

export function isExecutableLanguage(language: string): language is ExecutableLanguage {
  return EXECUTABLE_LANGUAGES.includes(language.toLowerCase().trim() as ExecutableLanguage);
}

export async function executeCode(language: string, code: string): Promise<ExecutionResult> {
  const normalized = language.toLowerCase().trim();

  if (!isExecutableLanguage(normalized)) {
    return {
      success: true,
      output: `🌐 This is a language learning lesson (${language}).\nCode execution is available for programming languages: Python, JavaScript, TypeScript, C++, and more.`,
      error: null,
      executionTime: 0,
    };
  }

  if (normalized === "javascript") {
    return runInProcessJS(code);
  }

  const workDir = mkdtempSync(join(tmpdir(), "svk-code-"));
  try {
    switch (normalized) {
      case "python":
        return await runPython(code, workDir, 3);
      case "typescript":
        return await runTypeScript(code, workDir);
      case "cpp":
        return await runCpp(code, workDir);
      case "java":
      case "rust":
      case "go":
        return unsupportedLanguage(normalized);
      default:
        return { success: false, output: "", error: `Unknown language: ${language}`, executionTime: 0 };
    }
  } finally {
    try { rmSync(workDir, { recursive: true, force: true }); } catch {}
  }
}
