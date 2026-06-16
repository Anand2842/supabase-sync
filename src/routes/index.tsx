import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anand — Founder & Full-Stack Developer" },
      { name: "description", content: "Anand's portfolio: startups, hackathon wins, open source, and side projects." },
      { property: "og:title", content: "Anand — Founder & Full-Stack Developer" },
      { property: "og:description", content: "Anand's portfolio: startups, hackathon wins, open source, and side projects." },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/anandbuild/index.html" + window.location.hash);
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#75808a" }}>
      Loading portfolio…
    </div>
  );
}
