import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [
    { title: "Terms | Inktella" },
    { name: "description", content: "The terms for using Inktella and publishing a public Notepage." },
    { property: "og:title", content: "Terms | Inktella" },
    { property: "og:description", content: "The terms for using Inktella and publishing a public Notepage." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Terms,
});

function Terms() {
  return <LegalPage title="Terms" intro="Inktella is a place for personal public notebooks. These terms keep that place usable." sections={[
    { title: "Your account and writing", paragraphs: ["You are responsible for your account and for what you publish. You keep ownership of your writing and grant Inktella permission to host, display, and distribute it as needed to provide the service."] },
    { title: "Notepage subscriptions", paragraphs: ["Each paid Notepage has its own yearly subscription. Prices and renewal details are shown before payment. Ending a subscription may make that Notepage unavailable after any stated grace period; it does not transfer ownership of your writing."] },
    { title: "Acceptable use", paragraphs: ["Do not use Inktella to break the law, impersonate others, invade privacy, distribute malware, or deliberately disrupt the service. The Guidelines form part of these terms."] },
    { title: "Service changes", paragraphs: ["We may update the service or these terms as Inktella develops. Material changes will be presented clearly. Continued use after an effective date means you accept the updated terms."] },
  ]} />;
}