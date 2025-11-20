import React, { useEffect, useRef, useState } from "react";

function RecentSearch({
  recentHistory,
  setRecentHistory,
  setSelectedHistory,
  setQuestion,
  askQuestion,
  isDark,
}) {
  const [openMobile, setOpenMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpenMobile(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (!openMobile) return;
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpenMobile(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMobile]);

  const clearHistory = () => {
    setRecentHistory([]);
    localStorage.removeItem("history");
  };

  const desktopWidthClass = collapsed && !hovered ? "w-16" : "w-64";

  return (
    <>
      {/* LEFT HAMBURGER BUTTON */}
      <button
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg 
        ${isDark ? "bg-zinc-700 text-white" : "bg-amber-500 text-white"}`}
        onClick={() => setOpenMobile(true)}
        aria-label="Open menu"
      >
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* BLUR BACKDROP */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300
        ${openMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm bg-black/30"
          onClick={() => setOpenMobile(false)}
        />
      </div>

      {/* MAIN SIDEBAR (right slide) */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full z-50 transform transition-transform duration-300
        ${openMobile ? "translate-x-0" : "translate-x-full"}
        md:translate-x-0 md:static
        ${desktopWidthClass}
        flex flex-col items-center md:items-stretch
        ${isDark ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-800"}
        shadow-lg`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* DESKTOP HEADER */}
        <div className="hidden md:flex items-center justify-between px-3 py-2 border-b border-zinc-700/30">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md"
          >
            {collapsed && !hovered ? (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M8 4v16M16 4v16"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <div className={`${collapsed && !hovered ? "opacity-0" : "opacity-100"} transition-opacity`}>
            <h1 className="text-xl font-bold text-amber-500">DeepCoder 👋</h1>
          </div>

          <div className={`${collapsed && !hovered ? "opacity-0" : "opacity-100"} transition-opacity`}>
            <button
              onClick={clearHistory}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* MOBILE HEADER */}
        <div className="md:hidden flex items-center justify-between w-full px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-amber-500">Recent Search</h2>

          <div className="flex gap-3 items-center">
            <button
              onClick={clearHistory}
              className="text-red-400 text-sm"
            >
              Clear
            </button>

            <button
              onClick={() => setOpenMobile(false)}
              className="p-2 rounded-md"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M6 18l12-12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 w-full overflow-hidden">
          {collapsed && !hovered ? (
            <nav className="flex flex-col items-center gap-4 py-6">
              <button className="p-2 hover:bg-zinc-700/30 rounded-md">
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path d="M3 3v6h6M21 21v-6h-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"/>
                  <path d="M5 19a9 9 0 0114-14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"/>
                </svg>
              </button>

              <button
                onClick={clearHistory}
                className="p-2 hover:bg-zinc-700/30 rounded-md"
              >
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path d="M3 6h18M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"
                    stroke="currentColor" strokeWidth="2" />
                  <path d="M10 11v6M14 11v6"
                    stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </nav>
          ) : (
            <div className="px-4 py-4">
              <ul className="space-y-2 w-full overflow-y-auto max-h-[calc(100vh-180px)] pr-2 scrollbar-hide">
                {recentHistory.length > 0 ? (
                  recentHistory.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setSelectedHistory(item);
                        setQuestion(item);
                        askQuestion(item);
                        setOpenMobile(false);
                      }}
                      className={`transition-all p-2 rounded-lg cursor-pointer flex justify-between items-center 
                        ${isDark ? "bg-zinc-700 hover:bg-zinc-600" : "bg-white hover:bg-zinc-200"}`}
                    >
                      <span className="truncate flex-1">{item}</span>
                      <button
                        className="text-red-400 ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          const updated = recentHistory.filter((_, idx) => idx !== i);
                          setRecentHistory(updated);
                          localStorage.setItem("history", JSON.stringify(updated));
                        }}
                      >
                        🗑️
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-zinc-400 text-center italic">No recent searches</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className={`${collapsed && !hovered ? "hidden" : "block"} w-full px-4 py-3 border-t`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">DeepCoder</div>
              <div className="text-xs text-zinc-400">
                {recentHistory.length} searches
              </div>
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block p-1 rounded-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default RecentSearch;
