import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

const Disclaimer = () => (
  <main className="min-h-screen bg-slate-50">
    <Navbar />
    <article className="content-wrap px-4 pb-20 pt-36">
      <div className="glass-card p-8 sm:p-12">
        <span className="section-kicker">AI Usage Disclaimer</span>
        <h1 className="section-title">AI is an assistant, not an authority</h1>
        <p className="section-copy">
          InfinityAI can help draft, analyze, and organize information, but it
          does not provide legal, medical, financial, employment, or other
          professional advice.
        </p>
        <div className="prose mt-10 max-w-none">
          <h2>Review before use</h2>
          <p>
            Check generated text, code, resume analysis, document answers,
            images, and recommendations for accuracy, rights, bias, and
            suitability.
          </p>
          <h2>Uploaded documents</h2>
          <p>
            Retrieved document content is treated as untrusted data. Do not
            follow instructions embedded in uploaded files unless you
            independently verify them.
          </p>
        </div>
      </div>
    </article>
    <Footer />
  </main>
);
export default Disclaimer;
