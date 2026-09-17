import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [
    { title: "Privacy | Inktella" },
    { name: "description", content: "How Inktella handles account, notebook, and reading information." },
    { property: "og:title", content: "Privacy | Inktella" },
    { property: "og:description", content: "How Inktella handles account, notebook, and reading information." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Privacy,
});

function Privacy() {
  return <LegalPage title="Privacy" intro="Your notebook may be public. Your private account information is not." sections={[
    { title: "What we collect", paragraphs: ["We collect the information needed to run your account and Notepages, such as your email address, profile details, notebook settings, notes, likes, and selected interests."] },
    { title: "What is public", paragraphs: ["Published Notepages, notes, names, biographies, links, interests, and Notetags can be viewed and shared by anyone. Drafts and account details are not public."] },
    { title: "How information is used", paragraphs: ["We use information to operate Inktella, keep accounts secure, process Notepage subscriptions, and shape Notella around interests rather than popularity."] },
    { title: "Your choices", paragraphs: ["You can edit or remove your writing and profile information. You may also ask for your account and associated private information to be deleted, subject to legal and payment record requirements."] },
  ]} />;
}