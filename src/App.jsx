  import { useEffect, useId, useState } from "react";
  import "./App.css";
  import { URL } from "./constants";
  import Answers from "./componets/Answers";
  import { useRef } from "react";
  import RecentSearch from "./componets/RecentSearch";
  import QuistionAnswer from "./componets/QuistionAnswer";



function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [selectedHistory, setSelectedHistory] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [loading, setLoading] = useState(false);
  const ScrollToAns = useRef();

  useEffect(() => {
    if (ScrollToAns.current) {
      ScrollToAns.current.scrollTop = ScrollToAns.current.scrollHeight;
    }
  }, [result, loading]);

  const askQuestion = async (text) => {
    const inputText = (text || question).trim();
    if (!inputText) return;

    let history = JSON.parse(localStorage.getItem("history")) || [];
    history = [inputText, ...history.filter((h) => h !== inputText)];
    localStorage.setItem("history", JSON.stringify(history));
    setRecentHistory(history);

    setLoading(true);
    try {
      const payload = { contents: [{ parts: [{ text: inputText }] }] };
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      const dataString = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const dataArray = dataString
        .split("* ")
        .map((item) => item.trim())
        .filter(Boolean);

      setResult((prev) => [
        ...prev,
        { type: "q", text: inputText },
        { type: "a", text: dataArray.length > 1 ? dataArray : dataString },
      ]);

      setQuestion("");
    } catch (error) {
      console.error("Error fetching answer:", error);
    } finally {
      setLoading(false);
    }
  };

  const isEnter = (e) => e.key === "Enter" && askQuestion();

  return (
    <div
      className={`grid md:grid-cols-5 min-h-screen transition-all duration-700 ${
        isDark ? "bg-zinc-900 text-white" : "bg-white text-zinc-800"
      }`}
    >
      {/* Sidebar */}
      <div className="hidden md:block">
        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          setSelectedHistory={setSelectedHistory}
          setQuestion={setQuestion}
          askQuestion={askQuestion}
          isDark={isDark}
        />
      </div>

      {/* Main */}
      <div className="col-span-5 md:col-span-4 flex flex-col h-screen relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-700 sticky top-0 bg-opacity-80 backdrop-blur-md z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-amber-500">
            DeepCoder AI 💬
          </h1>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`transition-all px-4 py-2 rounded-full font-semibold text-sm sm:text-base ${
              isDark
                ? "bg-amber-500 text-black hover:bg-amber-400"
                : "bg-zinc-800 text-white hover:bg-zinc-700"
            }`}
          >
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Messages */}
        <div
          ref={ScrollToAns}
          className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth"
        >
          <QuistionAnswer result={result} Answers={Answers} />
          {loading && (
            <div className="flex justify-start ml-3 animate-pulse">
              <div className="bg-zinc-700 text-white px-5 py-3 rounded-2xl rounded-bl-none shadow-md">
                <span className="italic">Thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input box */}
        <div className="w-[95%] sm:w-3/4 md:w-2/3 mx-auto mb-4 flex items-center gap-2 border border-zinc-700 rounded-full px-3 py-2 bg-zinc-800 focus-within:ring-2 focus-within:ring-amber-500 transition-all shadow-lg">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={isEnter}
            className="flex-1 p-3 bg-transparent outline-none text-white text-base sm:text-lg"
            placeholder="Ask me anything..."
          />
          <button
            onClick={() => askQuestion()}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 active:scale-95 transition-transform px-5 py-2 sm:py-3 rounded-full font-semibold disabled:opacity-50"
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>

        {/* Floating Recent Search (Mobile) */}
        <div className="block md:hidden fixed bottom-4 right-4">
          <RecentSearch
            recentHistory={recentHistory}
            setRecentHistory={setRecentHistory}
            setSelectedHistory={setSelectedHistory}
            setQuestion={setQuestion}
            askQuestion={askQuestion}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
