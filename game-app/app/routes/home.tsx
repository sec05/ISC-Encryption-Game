import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ISC Encryption Game!" },
    { name: "description"},
  ];
}

export default function Home() {
  return <Welcome />;
}
