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
  "python", "python3", "python2",
  "javascript", "js",
  "typescript", "ts",
  "java",
  "cpp", "c++",
  "c",
  "rust",
  "go",
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
  // Try python3 first, then python
  const pythonCmds = version === 2 ? ["python2", "python"] : ["python3", "python"];
  let lastErr = "";
  for (const cmd of pythonCmds) {
    const { stdout, stderr, exitCode, timedOut } = await runProcess(cmd, [file], null, TIMEOUT_MS);
    if (timedOut) {
      return { success: false, output: `⏱️ Execution timed out after ${TIMEOUT_MS / 1000}s`, error: "Timeout", executionTime: Date.now() - start };
    }
    if (exitCode === -1 && stderr.includes("No such file")) {
      lastErr = stderr;
      continue; // try next command
    }
    const out = stdout || (exitCode !== 0 ? stderr : "(no output)");
    return { success: exitCode === 0, output: out, error: exitCode !== 0 ? stderr : null, executionTime: Date.now() - start };
  }
  return { success: false, output: "❌ Python not available in this environment", error: lastErr, executionTime: Date.now() - start };
}

async function runC(code: string, workDir: string): Promise<ExecutionResult> {
  const srcFile = join(workDir, "main.c");
  const outFile = join(workDir, "main");
  writeFileSync(srcFile, code);
  const start = Date.now();
  const compile = await runProcess("gcc", ["-o", outFile, srcFile, "-lm"], null, TIMEOUT_MS);
  if (compile.exitCode !== 0) {
    return { success: false, output: compile.stderr || "❌ Compilation failed", error: compile.stderr, executionTime: Date.now() - start };
  }
  const { stdout, stderr, exitCode, timedOut } = await runProcess(outFile, [], null, TIMEOUT_MS);
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
  const compile = await runProcess("g++", ["-o", outFile, srcFile, "-std=c++17", "-lm"], null, TIMEOUT_MS);
  if (compile.exitCode !== 0) {
    return { success: false, output: compile.stderr || "❌ Compilation failed", error: compile.stderr, executionTime: Date.now() - start };
  }
  const { stdout, stderr, exitCode, timedOut } = await runProcess(outFile, [], null, TIMEOUT_MS);
  if (timedOut) {
    return { success: false, output: `⏱️ Timed out after ${TIMEOUT_MS / 1000}s`, error: "Timeout", executionTime: Date.now() - start };
  }
  const out = stdout || (exitCode !== 0 ? stderr : "(no output)");
  return { success: exitCode === 0, output: out, error: exitCode !== 0 ? stderr : null, executionTime: Date.now() - start };
}

async function runJava(code: string, workDir: string): Promise<ExecutionResult> {
  // Extract class name
  const classMatch = code.match(/public\s+class\s+(\w+)/);
  const className = classMatch ? classMatch[1] : "Main";
  const srcFile = join(workDir, `${className}.java`);
  writeFileSync(srcFile, code);
  const start = Date.now();

  const compile = await runProcess("javac", [srcFile], null, TIMEOUT_MS);
  if (compile.exitCode !== 0) {
    return { success: false, output: compile.stderr || "❌ Compilation failed", error: compile.stderr, executionTime: Date.now() - start };
  }
  const { stdout, stderr, exitCode, timedOut } = await runProcess("java", ["-cp", workDir, className], null, TIMEOUT_MS);
  if (timedOut) {
    return { success: false, output: `⏱️ Timed out after ${TIMEOUT_MS / 1000}s`, error: "Timeout", executionTime: Date.now() - start };
  }
  const out = stdout || (exitCode !== 0 ? stderr : "(no output)");
  return { success: exitCode === 0, output: out, error: exitCode !== 0 ? stderr : null, executionTime: Date.now() - start };
}

async function runGo(code: string, workDir: string): Promise<ExecutionResult> {
  const file = join(workDir, "main.go");
  writeFileSync(file, code);
  const start = Date.now();
  const { stdout, stderr, exitCode, timedOut } = await runProcess("go", ["run", file], null, TIMEOUT_MS);
  if (timedOut) {
    return { success: false, output: `⏱️ Timed out after ${TIMEOUT_MS / 1000}s`, error: "Timeout", executionTime: Date.now() - start };
  }
  const out = stdout || (exitCode !== 0 ? stderr : "(no output)");
  return { success: exitCode === 0, output: out, error: exitCode !== 0 ? stderr : null, executionTime: Date.now() - start };
}

async function runRust(code: string, workDir: string): Promise<ExecutionResult> {
  const srcFile = join(workDir, "main.rs");
  const outFile = join(workDir, "main");
  writeFileSync(srcFile, code);
  const start = Date.now();
  const compile = await runProcess("rustc", ["-o", outFile, srcFile], null, TIMEOUT_MS);
  if (compile.exitCode !== 0) {
    return { success: false, output: compile.stderr || "❌ Compilation failed", error: compile.stderr, executionTime: Date.now() - start };
  }
  const { stdout, stderr, exitCode, timedOut } = await runProcess(outFile, [], null, TIMEOUT_MS);
  if (timedOut) {
    return { success: false, output: `⏱️ Timed out after ${TIMEOUT_MS / 1000}s`, error: "Timeout", executionTime: Date.now() - start };
  }
  const out = stdout || (exitCode !== 0 ? stderr : "(no output)");
  return { success: exitCode === 0, output: out, error: exitCode !== 0 ? stderr : null, executionTime: Date.now() - start };
}

export function isExecutableLanguage(language: string): language is ExecutableLanguage {
  return EXECUTABLE_LANGUAGES.includes(language.toLowerCase().trim() as ExecutableLanguage);
}

export async function executeCode(language: string, code: string): Promise<ExecutionResult> {
  const normalized = language.toLowerCase().trim();

  if (normalized === "javascript" || normalized === "js") {
    return runInProcessJS(code);
  }

  const workDir = mkdtempSync(join(tmpdir(), "svk-code-"));
  try {
    switch (normalized) {
      case "python":
      case "python3":
        return await runPython(code, workDir, 3);
      case "python2":
        return await runPython(code, workDir, 2);
      case "c":
        return await runC(code, workDir);
      case "cpp":
      case "c++":
        return await runCpp(code, workDir);
      case "java":
        return await runJava(code, workDir);
      case "go":
        return await runGo(code, workDir);
      case "rust":
        return await runRust(code, workDir);
      case "typescript":
      case "ts":
        // Run as JS after stripping type annotations (basic support)
        return runInProcessJS(code.replace(/:\s*\w+(\[\])?(\s*[,)=;])/g, "$2").replace(/interface\s+\w+\s*\{[^}]*\}/g, ""));
      default:
        return {
          success: true,
          output: `🌐 This is a ${language} lesson.\nCode execution sandbox supports: Python, JavaScript, Java, C, C++, Go, Rust.`,
          error: null,
          executionTime: 0,
        };
    }
  } finally {
    try { rmSync(workDir, { recursive: true, force: true }); } catch {}
  }
}
