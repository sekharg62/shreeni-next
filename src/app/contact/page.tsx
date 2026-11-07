import { redirect } from "next/navigation";

/** /contact has no page of its own: the Help Center is the contact page. */
export default function ContactPage() {
  redirect("/contact/help");
}
