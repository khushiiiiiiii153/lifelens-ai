
"use client";

import { useEffect, useRef, useState } from "react";

type HistoryItem = {
  id: number;
  situation: string;
  result: string;
  language: string;
  date: string;
};

const languages = ["English", "Hindi", "Marathi", "Hinglish"];

const examples = [
  {
    icon: "📚",
    title: "Exams & Study",
    text: "I have exams coming soon but I am unable to concentrate.",
  },
  {
    icon: "💼",
    title: "Career",
    text: "I am confused about which career path I should choose.",
  },
  {
    icon: "⏰",
    title: "Time Management",
    text: "I have many tasks but I don't know how to manage my time.",
  },
  {
    icon: "😰",
    title: "Stress",
    text: "I feel stressed because I have too many things to handle.",
  },
];

function cleanText(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\r/g, "")
    .replace(/^\s*[-•]\s*/gm, "")
    .trim();
}

function FormattedResult({ text }: { text: string }) {
  const cleaned = cleanText(text);

  const sections = cleaned
    .split(/(?=Problem|Understanding|Action Plan|Helpful Tip)/i)
    .map((section) => section.trim())
    .filter(Boolean);

  const sectionIcons: Record<string, string> = {
    problem: "🧩",
    understanding: "🧠",
    "action plan": "🎯",
    "helpful tip": "💡",
  };

  return (
    <div className="space-y-5">
      {sections.map((section, index) => {
        const match = section.match(
          /^(Problem|Understanding|Action Plan|Helpful Tip)\s*([\s\S]*)$/i
        );

        if (!match) {
          return (
            <div
              key={index}
              className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700"
            >
              {section}
            </div>
          );
        }

        const title = match[1];
        const content = match[2].trim();
        const icon = sectionIcons[title.toLowerCase()] || "✨";

        if (title.toLowerCase() === "action plan") {
          const steps = content
            .split(/\n|(?=\d+\.\s)/)
            .map((step) => step.trim())
            .filter(Boolean)
            .map((step) => step.replace(/^\d+\.\s*/, ""));

          return (
            <div
              key={index}
              className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                  {icon}
                </div>

                <h3 className="text-lg font-bold text-slate-900">
                  {title}
                </h3>
              </div>

              <div className="space-y-3">
                {steps.map((step, stepIndex) => (
                  <div
                    key={stepIndex}
                    className="flex gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                      {stepIndex + 1}
                    </span>

                    <p className="text-sm leading-6 text-slate-700">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div
            key={index}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-indigo-100 hover:shadow-sm"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                {icon}
              </div>

              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            </div>

            <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
              {content}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        </div>

        <div>
          <p className="font-bold text-slate-900">
            LifeLens is thinking...
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Understanding your situation and preparing practical next steps.
          </p>
        </div>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-indigo-100">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-600" />
      </div>
    </div>
  );
}

export default function Home() {
  const [situation, setSituation] = useState("");
  const [language, setLanguage] = useState("English");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [askError, setAskError] = useState("");

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [copied, setCopied] = useState("");
  const [showExamples, setShowExamples] = useState(true);

  const [listening, setListening] = useState(false);
  const [uploadedImage, setUploadedImage] = useState("");
  const [uploadedName, setUploadedName] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lifelens-history");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowHistory(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const saveHistory = (item: HistoryItem) => {
    setHistory((currentHistory) => {
      const updated = [item, ...currentHistory].slice(0, 20);

      try {
        localStorage.setItem("lifelens-history", JSON.stringify(updated));
      } catch {}

      return updated;
    });
  };

  const startVoiceInput = () => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? (
            window as typeof window & {
              SpeechRecognition?: new () => SpeechRecognition;
              webkitSpeechRecognition?: new () => SpeechRecognition;
            }
          ).SpeechRecognition ||
          (
            window as typeof window & {
              webkitSpeechRecognition?: new () => SpeechRecognition;
            }
          ).webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognition) {
      setError(
        "Voice input is not supported in this browser. Try Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    const langMap: Record<string, string> = {
      English: "en-IN",
      Hindi: "hi-IN",
      Marathi: "mr-IN",
      Hinglish: "en-IN",
    };

    recognition.lang = langMap[language] || "en-IN";

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;

      setSituation((current) =>
        `${current} ${transcript}`.trim().slice(0, 2000)
      );
    };

    recognition.onerror = () => {
      setListening(false);
      setError("Voice input could not be started. Please try again.");
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const value = String(reader.result || "");

      setUploadedImage(value);
      setUploadedName(file.name);
      setError("");
    };

    reader.onerror = () => {
      setError("Could not read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage("");
    setUploadedName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeSituation = async () => {
    if (!situation.trim() && !uploadedImage) {
      setError("Please describe your situation or upload an image first.");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError("");
    setResult("");
    setCopied("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          situation: situation.trim(),
          language,
          image: uploadedImage || undefined,
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "The AI service returned an unexpected response. Please try again."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "LifeLens could not analyze your situation."
        );
      }

      if (!data?.result) {
        throw new Error("LifeLens AI returned an empty answer.");
      }

      const finalResult = cleanText(data.result);

      setResult(finalResult);

      saveHistory({
        id: Date.now(),
        situation:
          situation.trim() ||
          `Image analysis${uploadedName ? `: ${uploadedName}` : ""}`,
        result: finalResult,
        language,
        date: new Date().toLocaleString(),
      });

      setTimeout(() => {
        document
          .getElementById("result-section")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const askAnything = async () => {
    if (!question.trim()) {
      setAskError("Please enter a question.");
      return;
    }

    if (askLoading) return;

    setAskLoading(true);
    setAskError("");
    setAnswer("");
    setCopied("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          language,
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "The AI service returned an unexpected response. Please try again."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "LifeLens could not answer your question."
        );
      }

      if (!data?.result) {
        throw new Error("LifeLens AI returned an empty answer.");
      }

      setAnswer(cleanText(data.result));
    } catch (err) {
      setAskError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setAskLoading(false);
    }
  };

  const useExample = (text: string) => {
    setSituation(text);
    setError("");
    setResult("");
    setShowExamples(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const copyText = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);

      setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("");
    }
  };

  const restoreHistory = (item: HistoryItem) => {
    setSituation(item.situation);
    setLanguage(item.language);
    setResult(item.result);
    setError("");
    setShowHistory(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteHistory = (id: number) => {
    const updated = history.filter((item) => item.id !== id);

    setHistory(updated);

    try {
      localStorage.setItem("lifelens-history", JSON.stringify(updated));
    } catch {}
  };

  const clearHistory = () => {
    setHistory([]);

    try {
      localStorage.removeItem("lifelens-history");
    } catch {}
  };

  const clearMainInput = () => {
    setSituation("");
    setResult("");
    setError("");
    setCopied("");
    removeImage();
  };

  const clearQuestion = () => {
    setQuestion("");
    setAnswer("");
    setAskError("");
    setCopied("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50 text-slate-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <button
            onClick={() =>
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
            className="group flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl shadow-lg transition group-hover:scale-105">
              ✨
            </div>

            <div className="text-left">
              <div className="font-bold text-slate-900">LifeLens AI</div>
              <div className="hidden text-xs text-slate-500 sm:block">
                Everyday clarity
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
          >
            🕘 History
            {history.length > 0 && (
              <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
            <span className="animate-pulse">✨</span>
            AI-powered everyday guidance
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
            From messy problems
            <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              to clear next steps.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Tell LifeLens what you&apos;re dealing with. Get a simple
            understanding, priorities, and practical actions.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-slate-500">
            <span className="rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
              🧠 Understand
            </span>
            <span className="text-indigo-400">→</span>
            <span className="rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
              🎯 Prioritize
            </span>
            <span className="text-indigo-400">→</span>
            <span className="rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
              ⚡ Act
            </span>
          </div>
        </div>
      </section>

      {/* MAIN INPUT */}
      <section className="px-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-100/40 sm:p-8">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  What&apos;s on your mind?
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Describe your situation naturally.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {languages.map((item) => (
                  <button
                    key={item}
                    onClick={() => setLanguage(item)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      language === item
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={situation}
                onChange={(e) => {
                  setSituation(e.target.value);
                  setError("");
                }}
                maxLength={2000}
                placeholder="Example: I have exams coming soon but I am unable to concentrate..."
                className="min-h-44 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-5 pb-10 text-sm leading-7 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <span className="absolute bottom-3 right-4 text-xs text-slate-400">
                {situation.length}/2000
              </span>
            </div>

            {/* VOICE + UPLOAD */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={startVoiceInput}
                disabled={loading || listening}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  listening
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50"
                }`}
              >
                {listening ? "🎙️ Listening..." : "🎤 Voice"}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    handleImageUpload(file);
                  }
                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                📎 Upload Image
              </button>
            </div>

            {uploadedImage && (
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3">
                <img
                  src={uploadedImage}
                  alt="Uploaded preview"
                  className="h-16 w-16 rounded-xl object-cover"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Image attached
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {uploadedName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeImage}
                  className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={analyzeSituation}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Analyzing...
                  </>
                ) : (
                  <>✨ Analyze My Situation</>
                )}
              </button>

              <button
                onClick={clearMainInput}
                disabled={loading}
                className="rounded-2xl border border-slate-200 px-6 py-4 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Clear
              </button>
            </div>

            {loading && <LoadingState />}

            {error && !loading && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex gap-3">
                  <span className="text-lg">⚠️</span>

                  <div className="min-w-0">
                    <p className="font-semibold text-red-800">
                      Something went wrong
                    </p>

                    <p className="mt-1 break-words text-sm leading-6 text-red-700">
                      {error}
                    </p>

                    <button
                      onClick={analyzeSituation}
                      className="mt-3 font-semibold text-red-700 underline underline-offset-2"
                    >
                      ↻ Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && !situation && !uploadedImage && (
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <span>🔒</span>
                <span>Your input stays in this browser history.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EXAMPLES */}
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                Try an example
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Start with one of these common situations.
              </h2>
            </div>

            <button
              onClick={() => setShowExamples(!showExamples)}
              className="hidden rounded-lg px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 sm:block"
            >
              {showExamples ? "Hide" : "Show"}
            </button>
          </div>

          {showExamples && (
            <div className="grid gap-4 sm:grid-cols-2">
              {examples.map((example) => (
                <button
                  key={example.title}
                  onClick={() => useExample(example.text)}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-2xl transition group-hover:scale-105 group-hover:bg-indigo-50">
                    {example.icon}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-slate-900">
                      {example.title}
                    </h3>

                    <span className="text-sm text-indigo-500 opacity-0 transition group-hover:opacity-100">
                      Try →
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {example.text}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* RESULT */}
      {result && (
        <section
          id="result-section"
          className="scroll-mt-24 px-4 pb-14 sm:px-6"
        >
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-indigo-100/40 sm:p-8">
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-sm">
                      ✨
                    </span>

                    <p className="text-sm font-semibold text-indigo-600">
                      LifeLens Result
                    </p>
                  </div>

                  <h2 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">
                    Your situation, made clearer.
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Language: {language}
                  </p>
                </div>

                <button
                  onClick={() => copyText(result, "result")}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {copied === "result" ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>

              <FormattedResult text={result} />

              <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
                <div className="flex gap-3">
                  <span className="text-lg">🌱</span>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      One step at a time
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      You don&apos;t need to solve everything at once. Start
                      with the first practical action.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ASK ANYTHING */}
      <section className="border-y border-slate-200 bg-white px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-7 text-center">
            <p className="text-sm font-semibold text-indigo-600">
              Ask Anything
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-950">
              Have another question?
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Ask LifeLens AI anything about everyday problems, study,
              productivity, career or planning.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl shadow-md">
                  💡
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Ask LifeLens AI
                  </h3>

                  <p className="text-xs text-slate-500">
                    Get a quick and practical answer
                  </p>
                </div>
              </div>

              {question && (
                <button
                  onClick={clearQuestion}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-white hover:text-slate-700"
                >
                  Clear
                </button>
              )}
            </div>

            <textarea
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                setAskError("");
              }}
              maxLength={1500}
              placeholder="Example: How can I prepare for an interview?"
              className="min-h-32 w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 pb-9 text-sm leading-7 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            />

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Ask in {language}</span>
              <span>{question.length}/1500</span>
            </div>

            <button
              onClick={askAnything}
              disabled={askLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {askLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Thinking...
                </>
              ) : (
                "💡 Ask LifeLens AI"
              )}
            </button>

            {askError && !askLoading && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex gap-3">
                  <span>⚠️</span>

                  <div className="min-w-0">
                    <p className="font-semibold text-red-800">
                      Something went wrong
                    </p>

                    <p className="mt-1 break-words text-sm text-red-700">
                      {askError}
                    </p>

                    <button
                      onClick={askAnything}
                      className="mt-3 font-semibold text-red-700 underline underline-offset-2"
                    >
                      ↻ Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {askLoading && (
              <div className="mt-5 rounded-2xl border border-indigo-100 bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />

                  <p className="text-sm font-medium text-slate-600">
                    LifeLens is preparing your answer...
                  </p>
                </div>
              </div>
            )}

            {answer && !askLoading && (
              <div className="mt-6 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>

                    <h3 className="text-lg font-bold text-slate-900">
                      LifeLens Answer
                    </h3>
                  </div>

                  <button
                    onClick={() => copyText(answer, "answer")}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    {copied === "answer" ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>

                <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                  {answer}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
                  💡 General guidance for everyday use.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="text-3xl font-black text-indigo-600">
              {history.length}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Situations analyzed
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="text-3xl font-black text-indigo-600">4</div>
            <p className="mt-1 text-sm text-slate-500">
              Supported languages
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="text-3xl font-black text-indigo-600">AI</div>
            <p className="mt-1 text-sm text-slate-500">
              Powered guidance
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-lg font-bold">LifeLens AI</div>

              <p className="mt-2 max-w-xl text-xs leading-6 text-slate-400">
                LifeLens AI provides general informational guidance and is
                not a substitute for professional medical, legal, financial,
                or mental health advice. For urgent or emergency situations,
                contact appropriate local emergency services or a qualified
                professional.
              </p>
            </div>

            <div className="text-sm text-slate-400">
              Built with AI • ImpactHack
            </div>
          </div>
        </div>
      </footer>

      {/* HISTORY MODAL */}
      {showHistory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowHistory(false);
            }
          }}
        >
          <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕘</span>

                  <h2 className="text-xl font-bold text-slate-900">
                    Your History
                  </h2>
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Previously analyzed situations
                </p>
              </div>

              <button
                onClick={() => setShowHistory(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-5">
              {history.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-4xl">🕘</div>

                  <h3 className="mt-4 font-bold text-slate-900">
                    No history yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Your analyzed situations will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold leading-6 text-slate-900">
                            {item.situation}
                          </p>

                          <p className="mt-2 text-xs text-slate-400">
                            {item.language} • {item.date}
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => restoreHistory(item)}
                            className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                          >
                            Restore
                          </button>

                          <button
                            onClick={() => deleteHistory(item.id)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {history.length > 0 && (
              <div className="border-t border-slate-200 p-5">
                <button
                  onClick={clearHistory}
                  className="w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Clear History
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

/* Browser Speech Recognition types */
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}
