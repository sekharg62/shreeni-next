import type { Metadata } from "next";
import Container from "@/components/Container";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in or create your Shreeni account to shop faster and track orders.",
};

export default function AccountPage() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <AuthForm />
      </Container>
    </section>
  );
}
