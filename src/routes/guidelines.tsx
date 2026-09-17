import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/guidelines")({
  head: () => ({ meta: [
    { title: "Community Guidelines | Inktella" },
    { name: "description", content: "Simple expectations for writing and reading across the Inktella network." },
    { property: "og:title", content: "Community Guidelines | Inktella" },
    { property: "og:description", content: "Simple expectations for writing and reading across the Inktella network." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Guidelines,
});

function Guidelines() {
  return <LegalPage title="Guidelines" intro="Write freely. Leave room for other people to do the same." sections={[
    { title: "Write as yourself", paragraphs: ["Personal, unfinished, strange, quiet, and specific writing is welcome. Do not impersonate another person or misrepresent where a note came from."] },
    { title: "Do not cause harm", paragraphs: ["Threats, targeted harassment, hateful conduct, sexual exploitation, and instructions intended to cause serious harm are not allowed."] },
    { title: "Respect privacy and ownership", paragraphs: ["Do not publish private information without permission. Share writing, images, and other work only when you have the right to do so, and credit people where appropriate."] },
    { title: "Keep the network human", paragraphs: ["Do not spam Notetags, manipulate likes, or flood Notella with automated posts. Inktella may limit distribution or remove material that undermines the network."] },
  ]} />;
}