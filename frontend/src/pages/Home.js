import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const LANGUAGES = [
  { name: "JavaScript", color: "#f7df1e", icon: "JS" },
  { name: "Python", color: "#3572A5", icon: "PY" },
  { name: "Java", color: "#b07219", icon: "JA" },
  { name: "C++", color: "#f34b7d", icon: "C+" },
  { name: "TypeScript", color: "#2b7489", icon: "TS" },
  { name: "Go", color: "#00ADD8", icon: "GO" },
  { name: "Rust", color: "#dea584", icon: "RS" },
  { name: "PHP", color: "#4F5D95", icon: "PHP" },
];

const FEATURES = [
  { icon: "⚡", title: "Real-time Execution", desc: "Run code in 15+ languages instantly using Judge0 engine" },
  { icon: "💾", title: "Save Snippets", desc: "Save and organize your code snippets with tags" },
  { icon: "🎨", title: "Monaco Editor", desc: "The same editor that powers VS Code — syntax highlighting, autocomplete" },
  { icon: "📥", title: "Custom Input", desc: "Provide stdin input to test your programs" },
  { icon: "🌐", title: "Public Snippets", desc: "Share your code snippets with the community" },
  { icon: "🔐", title: "Auth System", desc: "JWT-based auth to keep your code safe" },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">🚀 Online Code Editor</div>
          <h1 className="hero-title">
            Code. Run. <span className="gradient-text">Ship.</span>
          </h1>
          <p className="hero-subtitle">
            A powerful online IDE supporting 15+ programming languages.<br />
            Write, execute, and save your code — all in the browser.
          </p>
          <div className="hero-actions">
            <Link to="/editor" className="btn btn-primary">
              Open Editor →
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-secondary">
                Create Account
              </Link>
            )}
          </div>
        </div>
        {/* Code preview card */}
        <div className="hero-preview">
          <div className="preview-header">
            <div className="preview-dots">
              <span style={{background:"#ff5f57"}}/>
              <span style={{background:"#febc2e"}}/>
              <span style={{background:"#28c840"}}/>
            </div>
            <span className="preview-filename">main.py</span>
          </div>
          <pre className="preview-code">{`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(fibonacci(i), end=" ")

# Output: 0 1 1 2 3 5 8 13 21 34`}
          </pre>
          <div className="preview-output">
            <span className="output-label">OUTPUT</span>
            <code>0 1 1 2 3 5 8 13 21 34</code>
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Supported Languages</h2>
          <div className="lang-grid">
            {LANGUAGES.map((l) => (
              <div key={l.name} className="lang-card" style={{"--lang-color": l.color}}>
                <span className="lang-icon">{l.icon}</span>
                <span className="lang-name">{l.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to start coding?</h2>
        <p>No installation needed. Just open the editor and go.</p>
        <Link to="/editor" className="btn btn-primary">Launch Editor →</Link>
      </section>
    </div>
  );
}
