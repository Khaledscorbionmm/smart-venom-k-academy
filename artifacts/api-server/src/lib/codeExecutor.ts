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

const TIMEOUT_MS = 10000;

// Programming languages supported by the Docker execution engine
export const EXECUTABLE_LANGUAGES = [
  "python", "javascript", "typescript", "java", "cpp", "rust", "go",
] as const;
export type ExecutableLanguage = (typeof EXECUTABLE_LANGUAGES)[number];

const DOCKER_IMAGES: Record<ExecutableLanguage, string> = {
  python: "python:3.11-slim",
  javascript: "node:20-alpine",
  typescript: "denoland/deno:alpine",
  java: "eclipse-temurin:11-jdk-alpine",
  cpp: "gcc:14",
  rust: "rust:1.78-slim",
  go: "golang:1.22-alpine",
};

function execDocker(
  image: string,
  cmd: string[],
  workDir: string,
  timeoutMs: number = TIMEOUT_MS,
  memory: string = "256m",
  cpus: string = "0.5"
): Promise<{ stdout: string; stderr: string; exitCode: number; timedOut: boolean }> {
  return new Promise((resolve) => {
    const args = [
      "run", "-i", "--rm",
      "--network", "none",
      "--memory", memory,
      "--cpus", cpus,
      "--tmpfs", "/tmp:rw,nosuid,size=64m",
      "-v", `${workDir}:/workspace:rw`,
      "-w", "/workspace",
      image,
      ...cmd,
    ];

    const child = spawn("docker", args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode: code ?? -1, timedOut });
    });

    child.on("error", () => {
      clearTimeout(timer);
      resolve({ stdout, stderr, exitCode: -1, timedOut: false });
    });
  });
}

function runInProcessJS(code: string): ExecutionResult {
  const start = Date.now();
  const logs: string[] = [];
  const mockConsole = {
    log: (...args: unknown[]) => logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
    error: (...args: unknown[]) => logs.push("ERROR: " + args.map(String).join(" ")),
    warn: (...args: unknown[]) => logs.push("WARN: " + args.map(String).join(" ")),
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
      output: `Error: ${err}`,
      error: err,
      executionTime: Date.now() - start,
    };
  }
}

async function runDockerPython(code: string, workDir: string): Promise<ExecutionResult> {
  writeFileSync(join(workDir, "main.py"), code);
  const start = Date.now();
  const { stdout, stderr, exitCode, timedOut } = await execDocker(
    DOCKER_IMAGES.python, ["python3", "/workspace/main.py"], workDir
  );
  const output = timedOut ? `Execution timed out after ${TIMEOUT_MS}ms\n${stdout}` : (stdout || stderr || "(no output)");
  return {
    success: !timedOut && exitCode === 0,
    output,
    error: exitCode !== 0 && !timedOut ? stderr : (timedOut ? "Execution timed out" : null),
    executionTime: Date.now() - start,
  };
}

async function runDockerJava(code: string, workDir: string): Promise<ExecutionResult> {
  writeFileSync(join(workDir, "Main.java"), code);
  const start = Date.now();
  const compile = await execDocker(DOCKER_IMAGES.java, ["javac", "/workspace/Main.java"], workDir);
  if (compile.exitCode !== 0) {
    return {
      success: false,
      output: compile.stderr || compile.stdout || "Compilation failed",
      error: compile.stderr || "Compilation failed",
      executionTime: Date.now() - start,
    };
  }
  const run = await execDocker(DOCKER_IMAGES.java, ["java", "-cp", "/workspace", "Main"], workDir);
  const output = run.timedOut ? `Execution timed out after ${TIMEOUT_MS}ms\n${run.stdout}` : (run.stdout || run.stderr || "(no output)");
  return {
    success: !run.timedOut && run.exitCode === 0,
    output,
    error: run.exitCode !== 0 && !run.timedOut ? run.stderr : (run.timedOut ? "Execution timed out" : null),
    executionTime: Date.now() - start,
  };
}

async function runDockerCpp(code: string, workDir: string): Promise<ExecutionResult> {
  writeFileSync(join(workDir, "main.cpp"), code);
  const start = Date.now();
  const compile = await execDocker(DOCKER_IMAGES.cpp, ["sh", "-c", "g++ -o /workspace/main /workspace/main.cpp 2>&1"], workDir);
  if (compile.exitCode !== 0) {
    return {
      success: false,
      output: compile.stderr || compile.stdout || "Compilation failed",
      error: compile.stderr || "Compilation failed",
      executionTime: Date.now() - start,
    };
  }
  const run = await execDocker(DOCKER_IMAGES.cpp, ["/workspace/main"], workDir);
  const output = run.timedOut ? `Execution timed out after ${TIMEOUT_MS}ms\n${run.stdout}` : (run.stdout || run.stderr || "(no output)");
  return {
    success: !run.timedOut && run.exitCode === 0,
    output,
    error: run.exitCode !== 0 && !run.timedOut ? run.stderr : (run.timedOut ? "Execution timed out" : null),
    executionTime: Date.now() - start,
  };
}

async function runDockerRust(code: string, workDir: string): Promise<ExecutionResult> {
  writeFileSync(join(workDir, "main.rs"), code);
  const start = Date.now();
  // Rust compilation is heavy: need 2x timeout and 512MB memory for rustc
  const compile = await execDocker(
    DOCKER_IMAGES.rust,
    ["sh", "-c", "TMPDIR=/tmp rustc -o /workspace/main /workspace/main.rs 2>&1"],
    workDir,
    TIMEOUT_MS * 2,
    "512m",
    "1.0"
  );
  if (compile.exitCode !== 0) {
    return {
      success: false,
      output: compile.stderr || compile.stdout || "Compilation failed",
      error: compile.stderr || "Compilation failed",
      executionTime: Date.now() - start,
    };
  }
  const run = await execDocker(DOCKER_IMAGES.rust, ["/workspace/main"], workDir);
  const output = run.timedOut ? `Execution timed out after ${TIMEOUT_MS}ms\n${run.stdout}` : (run.stdout || run.stderr || "(no output)");
  return {
    success: !run.timedOut && run.exitCode === 0,
    output,
    error: run.exitCode !== 0 && !run.timedOut ? run.stderr : (run.timedOut ? "Execution timed out" : null),
    executionTime: Date.now() - start,
  };
}

async function runDockerGo(code: string, workDir: string): Promise<ExecutionResult> {
  writeFileSync(join(workDir, "main.go"), code);
  const start = Date.now();
  // Go builds need 512MB+ to avoid OOM swapping during compilation.
  // Build binary in /workspace (host-mounted, exec-friendly) then run it.
  // Go compiler is memory-hungry; 1 GB prevents 20+ s thrashing observed at 512 MB.
  // 1.5 CPUs are required because Go compilation is CPU-bound and 0.5 CPUs cause >20 s builds.
  const build = await execDocker(
    DOCKER_IMAGES.go,
    ["sh", "-c", "GO111MODULE=off GOPATH=/workspace/.go GOCACHE=/workspace/.gocache go build -o /workspace/main /workspace/main.go 2>&1"],
    workDir,
    TIMEOUT_MS,
    "1g",
    "1.5"
  );
  if (build.exitCode !== 0 || build.timedOut) {
    return {
      success: false,
      output: build.timedOut ? `Compilation timed out after ${TIMEOUT_MS}ms` : (build.stderr || build.stdout || "Compilation failed"),
      error: build.timedOut ? "Compilation timed out" : (build.stderr || "Compilation failed"),
      executionTime: Date.now() - start,
    };
  }
  const run = await execDocker(DOCKER_IMAGES.go, ["/workspace/main"], workDir);
  const output = run.timedOut ? `Execution timed out after ${TIMEOUT_MS}ms\n${run.stdout}` : (run.stdout || run.stderr || "(no output)");
  return {
    success: !run.timedOut && run.exitCode === 0,
    output,
    error: run.exitCode !== 0 && !run.timedOut ? run.stderr : (run.timedOut ? "Execution timed out" : null),
    executionTime: Date.now() - start,
  };
}

async function runDockerTypeScript(code: string, workDir: string): Promise<ExecutionResult> {
  writeFileSync(join(workDir, "main.ts"), code);
  const start = Date.now();
  // Deno supports TypeScript out of the box — zero install, zero config
  // --allow-all is safe because the container is already network-isolated
  // and memory/CPU-limited. Without it, console.log() gets silently blocked.
  const run = await execDocker(
    DOCKER_IMAGES.typescript,
    ["deno", "run", "--allow-all", "/workspace/main.ts"],
    workDir
  );
  const output = run.timedOut ? `Execution timed out after ${TIMEOUT_MS}ms\n${run.stdout}` : (run.stdout || run.stderr || "(no output)");
  return {
    success: !run.timedOut && run.exitCode === 0,
    output,
    error: run.exitCode !== 0 && !run.timedOut ? run.stderr : (run.timedOut ? "Execution timed out" : null),
    executionTime: Date.now() - start,
  };
}

export function isExecutableLanguage(language: string): language is ExecutableLanguage {
  const normalized = language.toLowerCase().trim();
  return EXECUTABLE_LANGUAGES.includes(normalized as ExecutableLanguage);
}

export async function executeCode(language: string, code: string): Promise<ExecutionResult> {
  const normalized = language.toLowerCase().trim() as ExecutableLanguage;

  // Non-code languages (english, german, french) are language-learning lessons
  // not programming — they don't need code execution. Return a graceful message.
  if (!isExecutableLanguage(language)) {
    return {
      success: true,
      output: t("lang", `This is a language learning lesson (${language}). Code execution is available for programming languages only: Python, JavaScript, TypeScript, Java, C++, Rust, and Go.`),
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
        return await runDockerPython(code, workDir);
      case "java":
        return await runDockerJava(code, workDir);
      case "cpp":
        return await runDockerCpp(code, workDir);
      case "rust":
        return await runDockerRust(code, workDir);
      case "go":
        return await runDockerGo(code, workDir);
      case "typescript":
        return await runDockerTypeScript(code, workDir);
      default:
        return {
          success: false,
          output: "",
          error: `Unsupported language: ${language}`,
          executionTime: 0,
        };
    }
  } finally {
    try { rmSync(workDir, { recursive: true, force: true }); } catch {}
  }
}

// Simple bilingual helper for API messages
function t(_langHint: string, en: string): string {
  return en;
}
