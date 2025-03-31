import type { Route } from "./+types/home";
import { Leaderboard } from "../leaderboard/leaderboard"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ISC Encryption Game!" },
    { name: "description"},
  ];
}

export default function Home() {
  return <Leaderboard />;
}
