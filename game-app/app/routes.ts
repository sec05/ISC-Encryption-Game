import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"),
    route("game", "routes/game.tsx"),
    route("leaderboard", "routes/leaderboard.tsx"),
] satisfies RouteConfig;

