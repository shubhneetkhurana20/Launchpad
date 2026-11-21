import React, { useState, useRef } from "react";
import {
  Search, Moon, Sun, LogOut, Plus, Pencil, Trash2, ChevronDown,
  Users, LifeBuoy, Wallet, CalendarDays, Mail, FolderOpen, BookOpen,
  Briefcase, Building2, GraduationCap, ClipboardList, Link2, X,
  Eye, EyeOff, Lock, Sparkles, ArrowRight, Rocket
} from "lucide-react";

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Icon options available when creating/editing a Company Application.
// Stored as a string key (e.g. "Users") since apps are saved to
// localStorage as plain JSON — component references can't be serialized.
// ---------------------------------------------------------------------------
const ICON_OPTIONS = [
  { key: "Users", Icon: Users },
  { key: "LifeBuoy", Icon: LifeBuoy },
  { key: "Wallet", Icon: Wallet },
  { key: "CalendarDays", Icon: CalendarDays },
  { key: "Mail", Icon: Mail },
  { key: "FolderOpen", Icon: FolderOpen },
  { key: "BookOpen", Icon: BookOpen },
  { key: "Briefcase", Icon: Briefcase },
  { key: "Building2", Icon: Building2 },
  { key: "GraduationCap", Icon: GraduationCap },
  { key: "ClipboardList", Icon: ClipboardList },
  { key: "Link2", Icon: Link2 },
  { key: "Rocket", Icon: Rocket },
  { key: "Sparkles", Icon: Sparkles },
];

function getIcon(key) {
  return ICON_OPTIONS.find((o) => o.key === key)?.Icon || Link2;
}

// Adds "https://" to a URL if the person typed one without a protocol,
// so clicking a card always opens an external page instead of a broken
// in-app relative link.
function normalizeUrl(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

const APPS = [
  // { id: "hr", name: "HR Portal", desc: "Leave, payslips & benefits", icon: "Users", color: "bg-blue-600", url: "https://www.bamboohr.com" },
  // { id: "helpdesk", name: "IT Helpdesk", desc: "Raise & track tickets", icon: "LifeBuoy", color: "bg-orange-500", url: "https://www.freshservice.com" },
  // { id: "finance", name: "Finance Hub", desc: "Expenses & invoices", icon: "Wallet", color: "bg-emerald-600", url: "https://quickbooks.intuit.com" },
  { id: "calendar", name: "Calendar", desc: "Meetings & schedules", icon: "CalendarDays", color: "bg-rose-500", url: "https://calendar.google.com" },
  { id: "mail", name: "Mail", desc: "Company email", icon: "Mail", color: "bg-sky-500", url: "https://mail.google.com" },
  { id: "drive", name: "Document Vault", desc: "Files & policies", icon: "FolderOpen", color: "bg-amber-500", url: "https://drive.google.com" },
  { id: "learning", name: "Learning Hub", desc: "Courses & training", icon: "GraduationCap", color: "bg-violet-600", url: "https://www.coursera.org" },
  // { id: "directory", name: "Directory", desc: "Find people & teams", icon: "Building2", color: "bg-cyan-600", url: "https://www.workday.com" },
  // { id: "projects", name: "Projects", desc: "Track team work", icon: "ClipboardList", color: "bg-indigo-600", url: "https://asana.com" },
  // { id: "wiki", name: "Knowledge Base", desc: "Guides & handbooks", icon: "BookOpen", color: "bg-teal-600", url: "https://www.notion.so" },
  // { id: "careers", name: "Careers", desc: "Internal openings", icon: "Briefcase", color: "bg-fuchsia-600", url: "https://www.linkedin.com/jobs" },
];

const BADGE_COLORS = [
  "bg-blue-600", "bg-emerald-600", "bg-rose-500", "bg-amber-500",
  "bg-violet-600", "bg-cyan-600", "bg-orange-500", "bg-slate-600",
];

const DEFAULT_LINKS = [
  // { id: "l1", name: "MIDAP", url: "https://sanginides.midap.in/login_form.php", color: "bg-violet-600" },
  // { id: "l2", name: "Team Standup Doc", url: "https://notion.so", color: "bg-slate-600" },
];

// ---------------------------------------------------------------------------
// Hardcoded users (no backend/database — just a plain list in the code).
// To add a teammate: add a new { username, password, name } row below.
// IMPORTANT: passwords here are plain text and visible to anyone who opens
// the source code — this is fine for a trusted internal tool, not for
// anything sensitive. See the user guide for details.
// ---------------------------------------------------------------------------
const USERS = [
  { username: "Shubhneet", password: "Shubh1001", name: "Shubhneet" },
  { username: "Tejasvi", password: "Tejasvi1001", name: "Tejasvi" },
  { username: "priya", password: "priya123", name: "Priya" },
   { username: "Ratti", password: "Ratti123", name: "Ratti" },
];

// ---------------------------------------------------------------------------
// Safe localStorage helpers — wrapped in try/catch because storage can be
// blocked (e.g. inside a sandboxed preview). If it's unavailable, the app
// simply falls back to in-memory-only behavior for that session.
// ---------------------------------------------------------------------------
function storageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}
function storageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {
    /* storage unavailable — ignore */
  }
}
function storageRemove(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    /* storage unavailable — ignore */
  }
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function initials(str) {
  return str
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Ripple({ dark }) {
  const [ripples, setRipples] = useState([]);
  const spawn = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y, size }]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
  };
  return { spawn, ripples };
}

// ---------------------------------------------------------------------------
// Login Page
// ---------------------------------------------------------------------------

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ripples, setRipples] = useState([]);

  const spawnRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.2;
    const id = Date.now();
    setRipples((r) => [
      ...r,
      { id, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size },
    ]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 700);
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    const match = USERS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (!match) {
      setError("Incorrect username or password.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => onLogin(match, remember), 550);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-slate-950 px-4">
      {/* Ambient gradient mesh background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-blue-600/40 blur-3xl" style={{ animation: "float1 14s ease-in-out infinite" }} />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl" style={{ animation: "float2 16s ease-in-out infinite" }} />
        <div className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" style={{ animation: "float3 18s ease-in-out infinite" }} />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <style>{`
        @keyframes float1 { 0%,100%{ transform: translate(0,0) scale(1);} 50%{ transform: translate(40px,50px) scale(1.08);} }
        @keyframes float2 { 0%,100%{ transform: translate(0,0) scale(1);} 50%{ transform: translate(-50px,30px) scale(1.05);} }
        @keyframes float3 { 0%,100%{ transform: translate(0,0) scale(1);} 50%{ transform: translate(30px,-40px) scale(1.1);} }
        @keyframes fadeUp { from { opacity:0; transform: translateY(14px);} to { opacity:1; transform: translateY(0);} }
        @keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }
        .fade-up { animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      {/* Card */}
      <div
        className="fade-up relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl"
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-900/40">
            <Rocket className="h-7 w-7 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome to LaunchPad
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your company applications
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Username</label>
            <div
              className={`flex items-center gap-2 rounded-xl border bg-white/5 px-3.5 transition-all duration-200 ${
                focused === "email" ? "border-blue-500 ring-4 ring-blue-500/20" : "border-white/10"
              }`}
            >
              <Mail className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                placeholder="e.g. john"
                className="w-full bg-transparent py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
            <div
              className={`flex items-center gap-2 rounded-xl border bg-white/5 px-3.5 transition-all duration-200 ${
                focused === "pw" ? "border-blue-500 ring-4 ring-blue-500/20" : "border-white/10"
              }`}
            >
              <Lock className="h-4 w-4 shrink-0 text-slate-500" />
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("pw")}
                onBlur={() => setFocused("")}
                placeholder="••••••••"
                className="w-full bg-transparent py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="shrink-0 text-slate-500 hover:text-slate-300"
                tabIndex={-1}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
              <span
                onClick={() => setRemember((r) => !r)}
                className={`flex h-4 w-4 items-center justify-center rounded-md border transition-colors ${
                  remember ? "border-blue-500 bg-blue-600" : "border-white/20 bg-white/5"
                }`}
              >
                {remember && (
                  <svg viewBox="0 0 12 10" className="h-2.5 w-2.5 fill-none stroke-white" strokeWidth={2}>
                    <path d="M1 5l3.2 3.2L11 1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              Remember me
            </label>
            <a href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300">
              Forgot password?
            </a>
          </div>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            onClick={spawnRipple}
            disabled={submitting}
            className="relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-800/40 active:scale-95 disabled:opacity-70"
          >
            {ripples.map((r) => (
              <span
                key={r.id}
                className="pointer-events-none absolute rounded-full bg-white/30"
                style={{
                  left: r.x, top: r.y, width: r.size, height: r.size,
                  transform: "scale(0)", animation: "rippleAnim .65s ease-out forwards",
                }}
              />
            ))}
            {submitting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <>
                Sign in <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-7 text-center text-xs text-slate-500">
           <span className="text-slate-300"></span> {" "}
          <span className="text-slate-300"></span> Contact Admin To Be a User.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// App / Link Cards
// ---------------------------------------------------------------------------

function AppCard({ app, dark, delay, onEdit, onDelete }) {
  const Icon = getIcon(app.icon);
  const hasUrl = Boolean(app.url && app.url.trim());

  const open = () => {
    if (hasUrl) window.open(app.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
      className="fade-up group relative flex flex-col rounded-2xl border p-5 transition-all duration-300 cursor-pointer hover:-translate-y-1.5"
      style={{
        animationDelay: `${delay}ms`,
        borderRadius: "18px",
        backgroundColor: dark ? "#1E293B" : "#FFFFFF",
        borderColor: dark ? "#334155" : "#E5E7EB",
        boxShadow: dark
          ? "0 1px 2px rgba(0,0,0,0.3)"
          : "0 1px 2px rgba(0,0,0,0.04)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = dark
          ? "0 20px 40px -12px rgba(0,0,0,0.5)"
          : "0 20px 40px -12px rgba(15,23,42,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = dark
          ? "0 1px 2px rgba(0,0,0,0.3)"
          : "0 1px 2px rgba(0,0,0,0.04)";
      }}
    >
      <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(app);
          }}
          className={`rounded-lg p-1.5 ${dark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500"}`}
          aria-label={`Edit ${app.name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(app.id);
          }}
          className={`rounded-lg p-1.5 ${dark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500"} hover:text-rose-500`}
          aria-label={`Delete ${app.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${app.color} transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className="h-6 w-6 text-white" strokeWidth={2} />
      </div>
      <h3 className={`text-sm font-semibold ${dark ? "text-slate-50" : "text-gray-900"}`}>
        {app.name}
      </h3>
      <p className={`mt-1 text-xs leading-snug ${dark ? "text-slate-400" : "text-gray-500"}`}>
        {app.desc}
      </p>
      <div
        className={`mt-4 flex items-center gap-1 text-xs font-medium ${
          hasUrl ? "text-blue-600" : "text-gray-400"
        } opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${dark && hasUrl ? "text-blue-400" : ""}`}
      >
        {hasUrl ? (
          <>
            Open <ArrowRight className="h-3.5 w-3.5" />
          </>
        ) : (
          "No link set — click edit to add one"
        )}
      </div>
    </div>
  );
}

function AddAppCard({ dark, delay, onClick }) {
  return (
    <button
      onClick={onClick}
      className="fade-up flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-5 text-sm font-medium transition-all duration-300 hover:-translate-y-1.5"
      style={{
        animationDelay: `${delay}ms`,
        borderRadius: "18px",
        minHeight: "148px",
        borderColor: dark ? "#334155" : "#CBD5E1",
        color: dark ? "#94A3B8" : "#6B7280",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#3B82F6";
        e.currentTarget.style.color = "#2563EB";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = dark ? "#334155" : "#CBD5E1";
        e.currentTarget.style.color = dark ? "#94A3B8" : "#6B7280";
      }}
    >
      <Plus className="h-5 w-5" /> Add Application
    </button>
  );
}

function MyLinkCard({ link, dark, delay, onEdit, onDelete }) {
  const open = () => window.open(link.url, "_blank", "noopener,noreferrer");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open()}
      className="fade-up group relative flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1"
      style={{
        animationDelay: `${delay}ms`,
        borderRadius: "18px",
        backgroundColor: dark ? "#1E293B" : "#FFFFFF",
        borderColor: dark ? "#334155" : "#E5E7EB",
      }}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${link.color} text-sm font-semibold text-white`}>
        {initials(link.name)}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${dark ? "text-slate-50" : "text-gray-900"}`}>{link.name}</p>
        <p className={`truncate text-xs ${dark ? "text-slate-500" : "text-gray-500"}`}>{link.url.replace(/^https?:\/\//, "")}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(link);
          }}
          className={`rounded-lg p-1.5 ${dark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500"}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(link.id);
          }}
          className={`rounded-lg p-1.5 ${dark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-gray-100 text-gray-500"} hover:text-rose-500`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function AddLinkCard({ dark, delay, onClick }) {
  return (
    <button
      onClick={onClick}
      className="fade-up flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-sm font-medium transition-all duration-300 hover:-translate-y-1"
      style={{
        animationDelay: `${delay}ms`,
        borderRadius: "18px",
        borderColor: dark ? "#334155" : "#CBD5E1",
        color: dark ? "#94A3B8" : "#6B7280",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#3B82F6";
        e.currentTarget.style.color = "#2563EB";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = dark ? "#334155" : "#CBD5E1";
        e.currentTarget.style.color = dark ? "#94A3B8" : "#6B7280";
      }}
    >
      <Plus className="h-4 w-4" /> Add Link
    </button>
  );
}

// ---------------------------------------------------------------------------
// Link Modal
// ---------------------------------------------------------------------------

function LinkModal({ dark, initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [url, setUrl] = useState(initial?.url || "");
  const [color, setColor] = useState(initial?.color || BADGE_COLORS[0]);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    onSave({ id: initial?.id || `l${Date.now()}`, name: name.trim(), url: normalizeUrl(url), color });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl border p-6 shadow-2xl"
        style={{
          backgroundColor: dark ? "#1E293B" : "#FFFFFF",
          borderColor: dark ? "#334155" : "#E5E7EB",
          animation: "fadeUp .35s cubic-bezier(.16,1,.3,1) both",
        }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className={`text-base font-semibold ${dark ? "text-slate-50" : "text-gray-900"}`}>
            {initial ? "Edit link" : "Add a link"}
          </h3>
          <button onClick={onClose} className={dark ? "text-slate-500 hover:text-slate-300" : "text-gray-400 hover:text-gray-600"}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={`mb-1.5 block text-xs font-medium ${dark ? "text-slate-400" : "text-gray-500"}`}>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design System"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                dark ? "bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-500" : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              }`}
            />
          </div>
          <div>
            <label className={`mb-1.5 block text-xs font-medium ${dark ? "text-slate-400" : "text-gray-500"}`}>URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                dark ? "bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-500" : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              }`}
            />
          </div>
          <div>
            <label className={`mb-2 block text-xs font-medium ${dark ? "text-slate-400" : "text-gray-500"}`}>Color</label>
            <div className="flex flex-wrap gap-2">
              {BADGE_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full ${c} transition-transform ${color === c ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "hover:scale-105"} ${dark ? "ring-offset-slate-800" : "ring-offset-white"}`}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 active:scale-95"
          >
            {initial ? "Save changes" : "Add link"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Application Modal — the single place Company Applications are added
// and edited. Every field lives here; nothing else needs to change when
// you add a new application.
// ---------------------------------------------------------------------------

function AppModal({ dark, initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [url, setUrl] = useState(initial?.url || "");
  const [desc, setDesc] = useState(initial?.desc || "");
  const [icon, setIcon] = useState(initial?.icon || ICON_OPTIONS[0].key);
  const [color, setColor] = useState(initial?.color || BADGE_COLORS[0]);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    onSave({
      id: initial?.id || `app${Date.now()}`,
      name: name.trim(),
      desc: desc.trim(),
      url: normalizeUrl(url),
      icon,
      color,
    });
  };

  const inputClass = `w-full rounded-xl border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
    dark ? "bg-slate-800 border-slate-600 text-slate-50 placeholder:text-slate-500" : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
  }`;
  const labelClass = `mb-1.5 block text-xs font-medium ${dark ? "text-slate-400" : "text-gray-500"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm overflow-y-auto rounded-3xl border p-6 shadow-2xl"
        style={{
          maxHeight: "90vh",
          backgroundColor: dark ? "#1E293B" : "#FFFFFF",
          borderColor: dark ? "#334155" : "#E5E7EB",
          animation: "fadeUp .35s cubic-bezier(.16,1,.3,1) both",
        }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className={`text-base font-semibold ${dark ? "text-slate-50" : "text-gray-900"}`}>
            {initial ? "Edit application" : "Add an application"}
          </h3>
          <button onClick={onClose} className={dark ? "text-slate-500 hover:text-slate-300" : "text-gray-400 hover:text-gray-600"}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. HR Portal" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>URL</label>
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Description (optional)</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Leave, payslips & benefits" className={inputClass} />
          </div>
          <div>
            <label className={`${labelClass} mb-2`}>Icon</label>
            <div className="grid grid-cols-7 gap-2">
              {ICON_OPTIONS.map(({ key, Icon: OptIcon }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setIcon(key)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                    icon === key
                      ? "border-blue-500 bg-blue-600 text-white"
                      : dark
                        ? "border-slate-600 text-slate-400 hover:bg-slate-700"
                        : "border-gray-200 text-gray-500 hover:bg-gray-100"
                  }`}
                  aria-label={key}
                >
                  <OptIcon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={`${labelClass} mb-2`}>Color</label>
            <div className="flex flex-wrap gap-2">
              {BADGE_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full ${c} transition-transform ${color === c ? "ring-2 ring-offset-2 ring-blue-500 scale-110" : "hover:scale-105"} ${dark ? "ring-offset-slate-800" : "ring-offset-white"}`}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500 active:scale-95"
          >
            {initial ? "Save changes" : "Add application"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

function Dashboard({ username, userName, dark, setDark, onLogout }) {
  const storageKey = `launchpad_links_${username}`;
  const [search, setSearch] = useState("");
  const [links, setLinks] = useState(() => {
    const saved = storageGet(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        /* fall through to defaults */
      }
    }
    return DEFAULT_LINKS;
  });
  // Company Applications are shared (not per-user) — one saved list that
  // everyone who opens this app on this browser/host sees and can edit.
  const [apps, setApps] = useState(() => {
    const saved = storageGet("launchpad_apps");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        /* fall through to defaults */
      }
    }
    return APPS;
  });
  const [modal, setModal] = useState(null); // null | "new" | link object
  const [appModal, setAppModal] = useState(null); // null | "new" | app object
  const [menuOpen, setMenuOpen] = useState(false);

  const q = search.trim().toLowerCase();
  const filteredApps = apps.filter((a) => a.name.toLowerCase().includes(q));
  const filteredLinks = links.filter((l) => l.name.toLowerCase().includes(q));

  const saveLink = (link) => {
    setLinks((prev) => {
      const exists = prev.some((l) => l.id === link.id);
      const next = exists ? prev.map((l) => (l.id === link.id ? link : l)) : [...prev, link];
      storageSet(storageKey, JSON.stringify(next));
      return next;
    });
    setModal(null);
  };

  const deleteLink = (id) => {
    setLinks((prev) => {
      const next = prev.filter((l) => l.id !== id);
      storageSet(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const saveApp = (app) => {
    setApps((prev) => {
      const exists = prev.some((a) => a.id === app.id);
      const next = exists ? prev.map((a) => (a.id === app.id ? app : a)) : [...prev, app];
      storageSet("launchpad_apps", JSON.stringify(next));
      return next;
    });
    setAppModal(null);
  };

  const deleteApp = (id) => {
    setApps((prev) => {
      const next = prev.filter((a) => a.id !== id);
      storageSet("launchpad_apps", JSON.stringify(next));
      return next;
    });
  };

  const bg = dark ? "#0F172A" : "#F8FAFC";
  const headingColor = dark ? "text-slate-50" : "text-gray-900";
  const subColor = dark ? "text-slate-400" : "text-gray-500";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="min-h-screen w-full transition-colors duration-300" style={{ backgroundColor: bg }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform: translateY(14px);} to { opacity:1; transform: translateY(0);} }
        .fade-up { animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      {/* Top Nav */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{
          backgroundColor: dark ? "rgba(15,23,42,0.75)" : "rgba(248,250,252,0.75)",
          borderColor: dark ? "#1E293B" : "#E5E7EB",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <span className={`hidden text-sm font-semibold sm:block ${headingColor}`}>LaunchPad</span>
          </div>

          <div className="relative mx-auto w-full max-w-md flex-1">
            <Search className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-slate-500" : "text-gray-400"}`} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applications & links..."
              className={`w-full rounded-full border py-2.5 pl-10 pr-4 text-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 ${
                dark ? "bg-slate-800/70 border-slate-700 text-slate-100 placeholder:text-slate-500" : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
              }`}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setDark((d) => !d)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                dark ? "border-slate-700 text-amber-300 hover:bg-slate-800" : "border-gray-200 text-gray-500 hover:bg-gray-100"
              }`}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((m) => !m)}
                className={`flex items-center gap-1.5 rounded-full border py-1 pl-1 pr-2.5 transition-colors ${
                  dark ? "border-slate-700 hover:bg-slate-800" : "border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  {initials(userName)}
                </div>
                <ChevronDown className={`h-3.5 w-3.5 ${dark ? "text-slate-400" : "text-gray-500"}`} />
              </button>
              {menuOpen && (
                <div
                  className="fade-up absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border shadow-xl"
                  style={{ backgroundColor: dark ? "#1E293B" : "#FFFFFF", borderColor: dark ? "#334155" : "#E5E7EB" }}
                >
                  <div className={`px-4 py-3 text-sm font-medium ${headingColor}`}>{userName}</div>
                  <div className={`h-px ${dark ? "bg-slate-700" : "bg-gray-100"}`} />
                  <button
                    onClick={onLogout}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm ${dark ? "text-slate-300 hover:bg-slate-700" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="fade-up mb-10">
          <h1 className={`text-2xl font-semibold tracking-tight sm:text-3xl ${headingColor}`}>
            {greeting}, {userName} <span className="align-middle">👋</span>
          </h1>
          <p className={`mt-1.5 text-sm ${subColor}`}>Access your company applications from one place.</p>
        </div>

        {/* Company Applications */}
        <section className="mb-12">
          <h2 className={`mb-4 text-xs font-semibold uppercase tracking-wide ${subColor}`}>
            Company Applications
          </h2>
          {filteredApps.length > 0 || q === "" ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredApps.map((app, i) => (
                <AppCard
                  key={app.id}
                  app={app}
                  dark={dark}
                  delay={i * 35}
                  onEdit={(a) => setAppModal(a)}
                  onDelete={deleteApp}
                />
              ))}
              {q === "" && (
                <AddAppCard dark={dark} delay={filteredApps.length * 35} onClick={() => setAppModal("new")} />
              )}
            </div>
          ) : (
            <EmptyState dark={dark} text="No applications match your search" />
          )}
        </section>

        {/* My Links */}
        <section>
          <h2 className={`mb-4 text-xs font-semibold uppercase tracking-wide ${subColor}`}>My Links</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLinks.map((link, i) => (
              <MyLinkCard
                key={link.id}
                link={link}
                dark={dark}
                delay={i * 35}
                onEdit={(l) => setModal(l)}
                onDelete={deleteLink}
              />
            ))}
            {q === "" && <AddLinkCard dark={dark} delay={filteredLinks.length * 35} onClick={() => setModal("new")} />}
          </div>
          {q !== "" && filteredLinks.length === 0 && <EmptyState dark={dark} text="No links match your search" />}
        </section>
      </main>

      {modal && (
        <LinkModal
          dark={dark}
          initial={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={saveLink}
        />
      )}

      {appModal && (
        <AppModal
          dark={dark}
          initial={appModal === "new" ? null : appModal}
          onClose={() => setAppModal(null)}
          onSave={saveApp}
        />
      )}
    </div>
  );
}

function EmptyState({ dark, text }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-14 text-center"
      style={{ borderRadius: "18px", borderColor: dark ? "#334155" : "#E5E7EB" }}
    >
      <Search className={`mb-3 h-6 w-6 ${dark ? "text-slate-600" : "text-gray-300"}`} />
      <p className={`text-sm ${dark ? "text-slate-500" : "text-gray-400"}`}>{text}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export default function LaunchPad() {
  const [user, setUser] = useState(() => {
    const savedUsername = storageGet("launchpad_session");
    return savedUsername ? USERS.find((u) => u.username === savedUsername) || null : null;
  });
  const [dark, setDark] = useState(() => storageGet("launchpad_dark") === "true");

  const handleLogin = (matchedUser, remember) => {
    setUser(matchedUser);
    if (remember) {
      storageSet("launchpad_session", matchedUser.username);
    } else {
      storageRemove("launchpad_session");
    }
  };

  const handleLogout = () => {
    setUser(null);
    storageRemove("launchpad_session");
  };

  const handleSetDark = (updater) => {
    setDark((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      storageSet("launchpad_dark", String(next));
      return next;
    });
  };

  return (
    <div style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard
          username={user.username}
          userName={user.name}
          dark={dark}
          setDark={handleSetDark}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
