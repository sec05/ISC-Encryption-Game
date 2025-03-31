import type { Route } from "./+types/home";
import { Game } from "../game/game.tsx";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ISC Encryption Game!" },
    { name: "description"},
  ];
}

export default function Home() {
  return <Game />;
}
