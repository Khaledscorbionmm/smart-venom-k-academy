import { Router } from "express";
import { requireAuth } from "../lib/auth";
import { executeCode } from "../lib/codeExecutor";

const router = Router();

/**
 * POST /execute
 * Body: { language: string, code: string }
 * Returns: { success, output, error, executionTime }
 */
router.post("/execute", requireAuth, async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    res.status(400).json({ success: false, output: "language and code are required", error: "Bad request", executionTime: 0 });
    return;
  }
  if (typeof language !== "string" || typeof code !== "string") {
    res.status(400).json({ success: false, output: "language and code must be strings", error: "Bad request", executionTime: 0 });
    return;
  }
  if (code.length > 100000) {
    res.status(400).json({ success: false, output: "Code too large (max 100 KB)", error: "Code too large", executionTime: 0 });
    return;
  }

  try {
    const result = await executeCode(language, code);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      output: "Internal server error during execution",
      error: String(err),
      executionTime: 0,
    });
  }
});

export default router;
