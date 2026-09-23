import React, { useState } from "react";
import axios from "axios";
import { Mail, MapPin, MessageSquare, Send, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const contactCards = [
  {
    title: "Product support",
    description: "Questions about tools, credits, billing, or your workspace.",
    value: "support@infinityai.app",
    Icon: MessageSquare,
  },
  {
    title: "Partnerships",
    description: "Collaborations, integrations, and business inquiries.",
    value: "partners@infinityai.app",
    Icon: Mail,
  },
  {
    title: "Location",
    description: "Built for global creators, teams, students, and developers.",
    value: "Remote-first AI SaaS",
    Icon: MapPin,
  },
];

const Contact = () => {
  const [sent, setSent] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/contact`, data);
      setSent(true);
      form.reset();
    } catch {
      setSent(false);
    }
  };
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_42%,#ecfeff_72%,#faf5ff_100%)]">
      <Navbar />

      <section className="px-4 pb-20 pt-36 sm:px-8 lg:px-20 xl:px-32">
        <div className="content-wrap">
          <div className="text-center">
            <span className="section-kicker">
              <Sparkles className="mr-2 h-4 w-4" />
              Contact
            </span>
            <h1 className="section-title">
              Let&apos;s build better{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 bg-clip-text text-transparent">
                AI workflows
              </span>
            </h1>
            <p className="section-copy">
              Reach out for support, product questions, billing help,
              partnership ideas, or feedback about InfinityAI.
            </p>
          </div>

          <div className="mt-14 grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              {contactCards.map((item) => {
                const CardIcon = item.Icon;

                return (
                  <article key={item.title} className="premium-card p-7">
                    <div className="flex gap-5">
                      <div className="icon-badge h-14 w-14 bg-gradient-to-br from-indigo-600 to-cyan-500">
                        <CardIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-950">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-base leading-7 text-slate-600">
                          {item.description}
                        </p>
                        <p className="mt-3 text-base font-bold text-indigo-700">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <form onSubmit={submit} className="glass-card p-7 sm:p-9">
              <h2 className="text-3xl font-black text-slate-950">
                Send a message
              </h2>
              <p className="mt-3 text-lg leading-8 text-slate-600">
                Your message is securely saved for the support team.
              </p>

              <label className="field-label" htmlFor="contact-name">
                Name
              </label>
              <input
                id="contact-name"
                className="field-input"
                placeholder="Your full name"
                type="text"
                name="name"
                required
              />

              <label className="field-label" htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                className="field-input"
                placeholder="you@example.com"
                type="email"
                name="email"
                required
              />

              <label className="field-label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                id="contact-message"
                className="field-input min-h-40 resize-y"
                placeholder="Tell us how we can help..."
                name="message"
                required
              />
              <label className="field-label" htmlFor="contact-subject">
                Subject
              </label>
              <input
                id="contact-subject"
                className="field-input"
                name="subject"
                required
                placeholder="How can we help?"
              />

              <button type="submit" className="gradient-button mt-8">
                <Send className="h-5 w-5" />
                {sent ? "Message prepared" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
