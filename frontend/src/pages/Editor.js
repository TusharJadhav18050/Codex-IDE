import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "./Editor.css";

const LANGUAGES = [
  { name: "JavaScript", value: "javascript", monacoLang: "javascript", id: 63, template: `// JavaScript\nconsole.log("Hello, World!");\n\nconst nums = [1, 2, 3, 4, 5];\nconst sum = nums.reduce((a, b) => a + b, 0);\nconsole.log("Sum:", sum);` },
  { name: "Python",     value: "python",     monacoLang: "python",     id: 71, template: `# Python\nprint("Hello, World!")\n\nnums = [1, 2, 3, 4, 5]\nprint("Sum:", sum(nums))` },
  { name: "Java",       value: "java",       monacoLang: "java",       id: 62, template: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}` },
  { name: "C++",        value: "cpp",        monacoLang: "cpp",        id: 54, template: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}` },
  { name: "C",          value: "c",          monacoLang: "c",          id: 50, template: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}` },
  { name: "TypeScript", value: "typescript", monacoLang: "typescript", id: 74, template: `const greet = (name: string): string => {\n    return \`Hello, \${name}!\`;\n};\n\nconsole.log(greet("World"));` },
  { name: "Go",         value: "go",         monacoLang: "go",         id: 60, template: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}` },
  { name: "Rust",       value: "rust",       monacoLang: "rust",       id: 73, template: `fn main() {\n    println!("Hello, World!");\n}` },
  { name: "Ruby",       value: "ruby",       monacoLang: "ruby",       id: 72, template: `puts "Hello, World!"\n\n(1..5).each { |i| puts i }` },
  { name: "PHP",        value: "php",        monacoLang: "php",        id: 68, template: `<?php\necho "Hello, World!\\n";\n\n$nums = [1, 2, 3, 4, 5];\necho "Sum: " . array_sum($nums);` },
  { name: "Swift",      value: "swift",      monacoLang: "swift",      id: 83, template: `print("Hello, World!")\n\nlet nums = [1, 2, 3, 4, 5]\nprint("Sum:", nums.reduce(0, +))` },
  { name: "Kotlin",     value: "kotlin",     monacoLang: "kotlin",     id: 78, template: `fun main() {\n    println("Hello, World!")\n}` },
  { name: "C#",         value: "csharp",     monacoLang: "csharp",     id: 51, template: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}` },
  { name: "Bash",       value: "bash",       monacoLang: "shell",      id: 46, template: `#!/bin/bash\necho "Hello, World!"\n\nfor i in 1 2 3 4 5; do\n    echo "Number: $i"\ndone` },
  { name: "R",          value: "r",          monacoLang: "r",          id: 80, template: `print("Hello, World!")\n\nnums <- c(1, 2, 3, 4, 5)\nprint(paste("Sum:", sum(nums)))` },
];

export default function EditorPage() {
  const { user } = useAuth();
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(LANGUAGES[0].template);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [snippetTitle, setSnippetTitle] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState("vs-dark");
  const [showStdin, setShowStdin] = useState(false);
  const [loadedSnippetName, setLoadedSnippetName] = useState("");

  // Load snippet from Snippets page
  useEffect(() => {
    const raw = sessionStorage.getItem("load_snippet");
    if (raw) {
      try {
        const snippet = JSON.parse(raw);
        const langMatch = LANGUAGES.find(
          (l) =>
            l.name.toLowerCase() === snippet.language.toLowerCase() ||
            l.value.toLowerCase() === snippet.language.toLowerCase()
        );
        if (langMatch) setSelectedLang(langMatch);
        setCode(snippet.code);
        setSnippetTitle(snippet.title);
        setLoadedSnippetName(snippet.title);
        sessionStorage.removeItem("load_snippet");
      } catch {}
    }
  }, []);

  const handleLangChange = (e) => {
    const lang = LANGUAGES.find((l) => l.value === e.target.value);
    setSelectedLang(lang);
    setCode(lang.template);
    setOutput(null);
    setLoadedSnippetName("");
  };

  const runCode = async () => {
    setRunning(true);
    setOutput(null);
    try {
      const res = await axios.post("/api/code/run", {
        code,
        language: selectedLang.value,
        stdin,
      });
      setOutput(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Execution failed");
      setOutput({ stderr: err.response?.data?.message || "Server error" });
    } finally {
      setRunning(false);
    }
  };

  const saveSnippet = async () => {
    if (!snippetTitle.trim()) return toast.error("Please enter a title");
    setSaving(true);
    try {
      await axios.post("/api/snippets", {
        title: snippetTitle,
        code,
        language: selectedLang.name,
        languageId: selectedLang.id,
      });
      toast.success("Snippet saved!");
      setShowSave(false);
      setSnippetTitle("");
    } catch {
      toast.error("Failed to save snippet");
    } finally {
      setSaving(false);
    }
  };

  const resetEditor = () => {
    setCode(selectedLang.template);
    setOutput(null);
    setStdin("");
    setLoadedSnippetName("");
  };

  const outputData = (() => {
    if (!output) return null;
    const { stdout, stderr, compile_output, status } = output;
    const text = stdout || stderr || compile_output || "No output";
    const isError = !!stderr || !!compile_output || (status && status.id >= 4);
    return { text, isError, status };
  })();

  return (
    <div className="editor-page">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <select className="lang-select" value={selectedLang.value} onChange={handleLangChange}>
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.name}</option>
            ))}
          </select>
          <select className="toolbar-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
            <option value="hc-black">High Contrast</option>
          </select>
          <div className="font-control">
            <button onClick={() => setFontSize((s) => Math.max(10, s - 1))}>A-</button>
            <span>{fontSize}px</span>
            <button onClick={() => setFontSize((s) => Math.min(24, s + 1))}>A+</button>
          </div>
          {loadedSnippetName && (
            <span className="loaded-badge">📂 {loadedSnippetName}</span>
          )}
        </div>
        <div className="toolbar-right">
          <button className="btn btn-secondary btn-sm" onClick={resetEditor} title="Reset to template">
            ↺ Reset
          </button>
          <button className="btn btn-sm btn-secondary" onClick={() => setShowStdin((s) => !s)}>
            📥 {showStdin ? "Hide Input" : "Stdin"}
          </button>
          {user && (
            <button className="btn btn-secondary btn-sm" onClick={() => setShowSave(true)}>
              💾 Save
            </button>
          )}
          <button className="btn btn-green btn-run" onClick={runCode} disabled={running}>
            {running ? (
              <><span className="run-spinner" /> Running...</>
            ) : (
              <>▶ Run</>
            )}
          </button>
        </div>
      </div>

      <div className="editor-body">
        {/* Left: editor + stdin */}
        <div className="editor-left">
          <div className="editor-container">
            <Editor
              height="100%"
              language={selectedLang.monacoLang}
              value={code}
              theme={theme}
              onChange={(val) => setCode(val || "")}
              options={{
                fontSize,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: window.innerWidth > 900 },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                tabSize: 2,
                automaticLayout: true,
                formatOnPaste: true,
                suggestOnTriggerCharacters: true,
                lineNumbers: "on",
                renderLineHighlight: "all",
                bracketPairColorization: { enabled: true },
                padding: { top: 12 },
              }}
            />
          </div>
          {showStdin && (
            <div className="stdin-panel">
              <div className="panel-header">
                <span>📥 Standard Input (stdin)</span>
                <span style={{ color: "var(--text-muted)", fontSize: 11, marginLeft: "auto" }}>
                  Input your program reads from keyboard
                </span>
              </div>
              <textarea
                className="stdin-textarea"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter input for your program here..."
                spellCheck={false}
              />
            </div>
          )}
        </div>

        {/* Right: output */}
        <div className="output-panel">
          <div className="panel-header">
            <span>⚡ Output</span>
            {outputData && (
              <span className={`status-badge ${outputData.isError ? "error" : "success"}`}>
                {outputData.isError
                  ? "❌ Error"
                  : "✅ " + (outputData.status?.description || "Accepted")}
              </span>
            )}
            {outputData && (
              <button
                className="btn btn-sm btn-secondary"
                style={{ marginLeft: "auto" }}
                onClick={() => setOutput(null)}
              >
                Clear
              </button>
            )}
          </div>
          <div className="output-body">
            {!output && !running && (
              <div className="output-empty">
                <span style={{ fontSize: 40, opacity: 0.2 }}>▶</span>
                <p>Press Run to execute your code</p>
                <p style={{ fontSize: 11, marginTop: 6, opacity: 0.5 }}>Powered by Judge0</p>
              </div>
            )}
            {running && (
              <div className="output-empty">
                <div className="spinner" style={{ margin: "0 auto 12px" }} />
                <p>Executing your code...</p>
              </div>
            )}
            {outputData && (
              <>
                <pre className={`output-text ${outputData.isError ? "error-text" : "success-text"}`}>
                  {outputData.text}
                </pre>
                {(output.time || output.memory) && (
                  <div className="output-meta">
                    {output.time && <span>⏱ {output.time}s</span>}
                    {output.memory && <span>🧠 {output.memory} KB</span>}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSave && (
        <div className="modal-overlay" onClick={() => setShowSave(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>💾 Save Snippet</h3>
            <p>Save your code to your personal snippets library</p>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                placeholder={`e.g. Hello World in ${selectedLang.name}`}
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && saveSnippet()}
              />
            </div>
            <div className="modal-info">
              <span className="tag tag-lang">{selectedLang.name}</span>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {code.split("\n").length} lines
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <button className="btn btn-secondary" onClick={() => setShowSave(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveSnippet} disabled={saving}>
                {saving ? "Saving..." : "Save Snippet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
