import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Snippets.css";

const LANG_COLORS = {
  JavaScript: "#f7df1e", Python: "#3572A5", Java: "#b07219",
  "C++": "#f34b7d", C: "#555555", TypeScript: "#2b7489",
  Go: "#00ADD8", Rust: "#dea584", Ruby: "#701516",
  PHP: "#4F5D95", Swift: "#ffac45", Kotlin: "#A97BFF",
  "C#": "#178600", Bash: "#89e051", R: "#198CE7",
};

export default function Snippets() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLang, setFilterLang] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const res = await axios.get("/api/snippets");
      setSnippets(res.data);
    } catch (err) {
      toast.error("Failed to load snippets");
    } finally {
      setLoading(false);
    }
  };

  const deleteSnippet = async (id) => {
    if (!window.confirm("Delete this snippet?")) return;
    try {
      await axios.delete(`/api/snippets/${id}`);
      setSnippets((prev) => prev.filter((s) => s._id !== id));
      toast.success("Snippet deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const openInEditor = (snippet) => {
    // Store in sessionStorage to load in editor
    sessionStorage.setItem("load_snippet", JSON.stringify(snippet));
    navigate("/editor");
    toast.info("Snippet loaded in editor!");
  };

  const languages = ["all", ...new Set(snippets.map((s) => s.language))];

  const filtered = snippets.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.language.toLowerCase().includes(search.toLowerCase());
    const matchLang = filterLang === "all" || s.language === filterLang;
    return matchSearch && matchLang;
  });

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="snippets-page page">
      <div className="container">
        <div className="snippets-header">
          <div>
            <h1>My Snippets</h1>
            <p>{snippets.length} saved snippet{snippets.length !== 1 ? "s" : ""}</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/editor")}>
            + New Code
          </button>
        </div>

        {/* Filters */}
        <div className="snippets-filters">
          <input
            className="form-input"
            style={{ maxWidth: 280 }}
            placeholder="🔍 Search snippets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-input"
            style={{ maxWidth: 160 }}
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
          >
            {languages.map((l) => (
              <option key={l} value={l}>{l === "all" ? "All Languages" : l}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div className="spinner" style={{ margin: "0 auto" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="snippets-empty">
            <span>📂</span>
            <h3>{snippets.length === 0 ? "No snippets yet" : "No results found"}</h3>
            <p>
              {snippets.length === 0
                ? "Write some code in the editor and save it here"
                : "Try a different search term or filter"}
            </p>
            {snippets.length === 0 && (
              <button className="btn btn-primary" onClick={() => navigate("/editor")}>
                Open Editor
              </button>
            )}
          </div>
        ) : (
          <div className="snippets-grid">
            {filtered.map((snippet) => (
              <div key={snippet._id} className="snippet-card">
                <div className="snippet-card-header">
                  <div
                    className="snippet-lang-dot"
                    style={{ background: LANG_COLORS[snippet.language] || "#888" }}
                  />
                  <span className="snippet-lang">{snippet.language}</span>
                  <span className="snippet-date">{formatDate(snippet.createdAt)}</span>
                </div>

                <h3 className="snippet-title">{snippet.title}</h3>

                <pre className="snippet-preview">
                  {snippet.code.slice(0, 150)}{snippet.code.length > 150 ? "\n..." : ""}
                </pre>

                <div className="snippet-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openInEditor(snippet)}
                  >
                    ▶ Open
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteSnippet(snippet._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
