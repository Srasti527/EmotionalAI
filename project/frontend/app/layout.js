import "../styles/globals.css";

export const metadata = {
  title: "AI Investment Advisor — Conversational Planner",
  description: "An empathetic, emotion-aware AI advisor that builds your personalised investment plan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-ink text-mist antialiased">{children}</body>
    </html>
  );
}
