import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Terms = () => (
  <main className="min-h-screen bg-slate-50">
    <Navbar />
    <article className="content-wrap px-4 pb-20 pt-36">
      <div className="glass-card p-8 sm:p-12">
        <span className="section-kicker">Terms of Service</span>
        <h1 className="section-title">Using InfinityAI responsibly</h1>
        <p className="section-copy">
          InfinityAI provides AI-assisted creation tools. You are responsible
          for reviewing outputs, protecting your account, and ensuring your
          content and use comply with applicable law.
        </p>
        <div className="prose mt-10 max-w-none">
          <h2>Accounts and content</h2>
          <p>
            Keep account credentials secure. Do not upload content you do not
            have permission to process. Public creations may be visible to other
            users.
          </p>
          <h2>Billing and cancellation</h2>
          <p>
            Paid subscriptions renew according to the checkout terms shown at
            purchase. Cancellation stops future renewal; access remains governed
            by the active billing period.
          </p>
          <h2>AI output</h2>
          <p>
            Outputs may be inaccurate or incomplete and should be reviewed
            before publication or consequential use.
          </p>
        </div>
      </div>
    </article>
    <Footer />
  </main>
);
export default Terms;
