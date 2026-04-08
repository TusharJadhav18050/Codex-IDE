const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const LANGUAGE_IDS = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  typescript: 74,
  go: 60,
  rust: 73,
  ruby: 72,
  php: 68,
  swift: 83,
  kotlin: 78,
  csharp: 51,
  bash: 46,
  r: 80,
};

router.post("/run", async (req, res) => {
  try {
    const { code, language, stdin = "" } = req.body;

    if (!code || !language)
      return res.status(400).json({ message: "Code and language are required" });

    const languageId = LANGUAGE_IDS[language.toLowerCase()];
    if (!languageId)
      return res.status(400).json({ message: `Unsupported language: ${language}` });

    const response = await fetch(
      "https://ce.judge0.com/submissions?wait=true&base64_encoded=false",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code,
          language_id: languageId,
          stdin: stdin,
        }),
      }
    );

    const result = await response.json();

    res.json({
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compile_output: result.compile_output || "",
      message: result.message || "",
      status: result.status,
      time: result.time,
      memory: result.memory,
    });

  } catch (err) {
    console.error("Judge0 error:", err.message);
    res.status(500).json({ message: "Code execution failed", error: err.message });
  }
});

router.get("/languages", (req, res) => {
  const langs = Object.entries(LANGUAGE_IDS).map(([name, id]) => ({ name, id }));
  res.json(langs);
});

module.exports = router;