import { redirect } from "next/navigation";

/** /about has no page of its own: Our Story is the About page. */
export default function AboutPage() {
  redirect("/about/story");
}
