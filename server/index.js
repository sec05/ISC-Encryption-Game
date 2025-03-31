import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useState, useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const Welcome = () => {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const redirect = (path) => {
    navigate(path);
  };
  const handleStart = () => {
    setShowInput(true);
  };
  const handlePlay = async () => {
    if (name.trim()) {
      try {
        const response = await fetch("http://localhost:5555/leaderboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name })
        });
        if (!response.ok) {
          const errorData = await response.json();
          alert("Error: " + (errorData.error || "Unknown error occurred"));
          return;
        }
        localStorage.setItem("name", name);
        redirect("/game");
      } catch (error) {
        alert("Network Error: " + error);
      }
    }
    redirect("/game");
  };
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
      console.log("Name found in localStorage:", storedName);
      redirect("/game");
    }
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center h-screen bg-gray-900 text-white", children: !showInput ? /* @__PURE__ */ jsxs("div", { className: "text-center transition-opacity duration-500 ease-in-out", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-6", children: "Welcome to the encryption challenge!" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleStart,
        className: "px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-lg transition-transform duration-300 hover:scale-105",
        children: "Get Started"
      }
    )
  ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center text-center transition-transform duration-500 ease-in-out transform translate-y-4 opacity-100", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Enter Your Name" }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        placeholder: "Your Name",
        value: name,
        onChange: (e) => setName(e.target.value),
        className: "px-4 py-2 rounded-lg  border-2 border-gray-300 focus:border-blue-500 outline-none"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handlePlay,
        className: "mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-lg transition-transform duration-300 hover:scale-105",
        children: "Let's Play!"
      }
    )
  ] }) });
};
function meta$2({}) {
  return [{
    title: "ISC Encryption Game!"
  }, {
    name: "description"
  }];
}
const home = withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Welcome, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const Game = () => {
  const navigate = useNavigate();
  const redirect = (path) => {
    navigate(path);
  };
  const [gameState, setGameState] = useState("select");
  const [difficulty, setDifficulty] = useState(null);
  const [challenge, setChallenge] = useState("");
  const [userInput, setUserInput] = useState("");
  const [challengeID, setChallengeID] = useState(-1);
  const [name, setName] = useState("");
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (!storedName) {
      redirect("/");
    } else {
      setName(storedName);
      console.log("Name found in localStorage:", storedName);
    }
  }, []);
  const handleDifficultySelect = async (level) => {
    if (!level) return;
    try {
      const response = await fetch(`http://127.0.0.1:5555/challenge/${level}`);
      if (!response.ok) throw new Error("Failed to fetch challenge");
      const data = await response.json();
      console.log("Challenge data received:", data);
      setDifficulty(level);
      setChallenge(data["challenge"] || "No challenge received!");
      setChallengeID(data["id"] ?? -1);
      setGameState("playing");
    } catch (error) {
      console.error("Error fetching challenge:", error);
      setChallenge("Error loading challenge. Please try again.");
    }
  };
  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/challenge/${challengeID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ answer: userInput, name })
        // Include the name in the request body
      });
      if (!response.ok) throw new Error("Failed to submit answer");
      const data = await response.json();
      console.log("Response data:", data);
      if (data["status"] === "correct") {
        setGameState("select");
        setUserInput("");
        alert("Correct! Well done.");
        setChallenge("");
      }
    } catch (error) {
      alert("error with answer! try again");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-screen bg-gray-900 text-white", children: [
    gameState === "select" && /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-4", children: "Select Difficulty" }),
      /* @__PURE__ */ jsx("div", { className: "flex space-x-4", children: ["easy", "medium", "hard"].map((level) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleDifficultySelect(level),
          className: "px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-lg transition-transform duration-300 hover:scale-105",
          children: level.charAt(0).toUpperCase() + level.slice(1)
        },
        level
      )) })
    ] }),
    gameState === "playing" && /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Decrypt:" }),
      /* @__PURE__ */ jsx("p", { className: "mb-4 text-lg", children: challenge }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: userInput,
          onChange: (e) => setUserInput(e.target.value),
          className: "px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 outline-none",
          placeholder: "Enter answer"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleSubmit,
          className: "mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-lg transition-transform duration-300 hover:scale-105",
          children: "Submit"
        }
      )
    ] })
  ] });
};
function meta$1({}) {
  return [{
    title: "ISC Encryption Game!"
  }, {
    name: "description"
  }];
}
const game = withComponentProps(function Home2() {
  return /* @__PURE__ */ jsx(Game, {});
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: game,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const getData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5555/leaderboard");
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.sort((a, b) => b.points - a.points));
      } else {
        console.error("Failed to fetch leaderboard data");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };
  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 5e3);
    return () => clearInterval(interval);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center h-screen bg-gray-900 text-white", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-6", children: "Leaderboard" }),
    /* @__PURE__ */ jsx("div", { className: "w-1/2 bg-gray-800 p-4 rounded-lg shadow-lg", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-700", children: [
        /* @__PURE__ */ jsx("th", { className: "p-2", children: "Rank" }),
        /* @__PURE__ */ jsx("th", { className: "p-2", children: "Name" }),
        /* @__PURE__ */ jsx("th", { className: "p-2", children: "Points" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: players.map((player, index) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-gray-700", children: [
        /* @__PURE__ */ jsx("td", { className: "p-2", children: index + 1 }),
        /* @__PURE__ */ jsx("td", { className: "p-2", children: player.name }),
        /* @__PURE__ */ jsx("td", { className: "p-2", children: player.points })
      ] }, player.name)) })
    ] }) })
  ] });
};
function meta({}) {
  return [{
    title: "ISC Encryption Game!"
  }, {
    name: "description"
  }];
}
const leaderboard = withComponentProps(function Home3() {
  return /* @__PURE__ */ jsx(Leaderboard, {});
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: leaderboard,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CBmRsl0h.js", "imports": ["/assets/chunk-GNGMS2XR-ClVmEp-r.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-eMqr0tuZ.js", "imports": ["/assets/chunk-GNGMS2XR-ClVmEp-r.js", "/assets/with-props-Dcn5r2gA.js"], "css": ["/assets/root-BIzWg4Jz.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/home-BNV5aU7J.js", "imports": ["/assets/with-props-Dcn5r2gA.js", "/assets/chunk-GNGMS2XR-ClVmEp-r.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "hydrateFallbackModule": void 0 }, "routes/game": { "id": "routes/game", "parentId": "root", "path": "game", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/game-C_ZFKHNa.js", "imports": ["/assets/with-props-Dcn5r2gA.js", "/assets/chunk-GNGMS2XR-ClVmEp-r.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "hydrateFallbackModule": void 0 }, "routes/leaderboard": { "id": "routes/leaderboard", "parentId": "root", "path": "leaderboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/leaderboard-Bsnk3Zsw.js", "imports": ["/assets/with-props-Dcn5r2gA.js", "/assets/chunk-GNGMS2XR-ClVmEp-r.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-7bd95387.js", "version": "7bd95387" };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/game": {
    id: "routes/game",
    parentId: "root",
    path: "game",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/leaderboard": {
    id: "routes/leaderboard",
    parentId: "root",
    path: "leaderboard",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
