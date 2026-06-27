const instructions = {
  "ai-blog-generator": "Write a complete SEO-aware blog post with title, outline, headings, examples, conclusion, and a concise meta description.",
  "ai-paragraph-rewriter": "Rewrite the supplied text for clarity and flow while preserving facts and meaning. Return the rewrite followed by a short change summary.",
  "ai-summarizer": "Produce an executive summary, key points ranked by importance, and action items. Do not add unsupported claims.",
  "ai-grammar-checker": "Correct grammar, spelling, punctuation, and awkward wording. Return corrected text and an explanation of significant corrections.",
  "ai-email-writer": "Write a polished email with a useful subject line, concise body, and appropriate call to action based on the brief.",
  "ai-social-media-post-generator": "Create three platform-ready post variants with strong hooks, accessible formatting, and relevant hashtags.",
  "ai-product-description-generator": "Write a benefit-led product description, feature bullets, target customer summary, and SEO keywords without inventing specifications.",
  "ai-ad-copy-generator": "Create multiple ad-copy variants with headline, primary text, call to action, and audience angle. Avoid unverifiable claims.",
  "ai-youtube-script-generator": "Create a complete video script with hook, scene-by-scene outline, narration, visual cues, and closing call to action.",
  "ai-color-palette-generator": "Create a cohesive color palette with HEX values, semantic roles, accessibility guidance, and suggested gradient combinations.",
  "ai-resume-builder": "Create an ATS-friendly resume draft with summary, skills, experience bullets, education, and measurable-impact placeholders clearly marked for verification.",
  "ai-cover-letter-generator": "Write a role-specific cover letter that connects supplied experience to the target role without inventing credentials.",
  "ai-interview-preparation": "Create a structured interview plan with likely questions, strong answer frameworks, technical drills, and questions to ask the interviewer.",
  "linkedin-profile-optimizer": "Audit and rewrite the LinkedIn headline, About section, experience bullets, skills, and recruiter keywords. Rank recommendations by impact.",
  "job-description-analyzer": "Analyze the job description into responsibilities, required and preferred skills, seniority signals, keywords, risks, and interview focus areas.",
  "career-roadmap-generator": "Create a phased career roadmap with prerequisites, learning sequence, portfolio milestones, interview preparation, and measurable checkpoints.",
  "ai-notes-generator": "Convert the input into structured study notes with headings, definitions, examples, relationships, and a concise recap.",
  "ai-mind-map-generator": "Return a readable Markdown mind map with one root topic, hierarchical branches, cross-topic relationships, and a level-order learning path.",
  "ai-study-assistant": "Teach the topic progressively: prerequisites, core explanation, worked example, common misconceptions, practice tasks, and next steps.",
  "ai-presentation-generator": "Create a slide-by-slide deck outline with title, key message, concise bullets, speaker notes, and visual direction for each slide.",
  "flashcard-generator": "Create concise question-answer flashcards covering recall, understanding, and application. Group them by difficulty.",
  "quiz-generator": "Create a balanced quiz ranked by difficulty, include multiple question types, then provide an answer key with explanations.",
  "assignment-helper": "Provide an ethical assignment plan with thesis options, research questions, outline, evidence checklist, and revision rubric. Do not impersonate the student.",
  "meeting-notes-summarizer": "Extract attendees if supplied, decisions, action items with owners and deadlines, unresolved questions, and a concise meeting summary.",
  "ai-code-generator": "Generate production-oriented code from the requirements. State assumptions, include validation and error handling, explain complexity, and add test examples.",
  "ai-code-reviewer": "Review the code for correctness, security, maintainability, performance, and test gaps. Rank findings by severity and show concrete fixes.",
  "ai-bug-fixer": "Identify likely root causes, explain the failure path, provide a minimal corrected implementation, and add regression tests.",
  "ai-sql-query-generator": "Generate parameterized SQL for the stated database dialect, explain joins and indexes, and include safety/performance notes.",
  "ai-api-documentation-generator": "Generate API documentation with endpoints, authentication, parameters, schemas, examples, errors, and dependency order.",
  "regex-generator": "Create the smallest safe regular expression for the requirement, explain each part, note engine assumptions, and include positive and negative tests.",
  "code-explainer": "Explain the code from high-level purpose to control flow, dependencies, edge cases, and time/space complexity.",
  "unit-test-generator": "Generate focused unit tests covering happy paths, boundaries, errors, and regressions. State framework assumptions explicitly.",
  "ai-chat-assistant": "Answer the user directly and accurately. Use the optional context, state uncertainty, and structure complex answers clearly.",
  "ai-voice-assistant": "Respond conversationally for spoken playback. Keep sentences clear, concise, and easy to understand when heard aloud.",
  "ai-translation-tool": "Translate faithfully into the requested target language, preserve formatting and tone, and briefly flag ambiguous source phrases.",
  "ai-research-assistant": "Create a research brief with scope, key questions, competing hypotheses, evidence needs, search terms, and a source-validation checklist. Never fabricate citations.",
  "ai-prompt-generator": "Create a reusable high-quality AI prompt with role, objective, context placeholders, constraints, output schema, and a worked example.",
};

export const IMAGE_GENERATION_TOOLS = new Set([
  "ai-logo-generator",
  "ai-thumbnail-generator",
  "ai-poster-flyer-generator",
  "ai-avatar-generator",
]);

export const PDF_TOOLS = new Set([
  "pdf-summarizer",
  "ai-document-analyzer",
  "ai-file-chat",
]);

export const IMAGE_UPLOAD_TOOLS = new Set([
  "ai-image-upscaler",
  "ai-image-caption-generator",
  "ai-ocr-scanner",
]);

export const CODE_TOOLS = new Set([
  "ai-code-generator",
  "ai-code-reviewer",
  "ai-bug-fixer",
  "ai-api-documentation-generator",
  "code-explainer",
  "unit-test-generator",
]);

export const getWorkflow = (tool) => {
  if (IMAGE_GENERATION_TOOLS.has(tool.slug)) return { kind: "image-generation" };
  if (tool.slug === "ai-image-upscaler") return { kind: "image-upscale" };
  if (tool.slug === "ai-image-caption-generator") return { kind: "image-caption" };
  if (tool.slug === "ai-ocr-scanner") return { kind: "ocr" };
  if (tool.slug === "pdf-summarizer") return { kind: "pdf-summary" };
  if (tool.slug === "ai-document-analyzer") return { kind: "document-analysis" };
  if (tool.slug === "ai-file-chat") return { kind: "file-chat" };
  if (tool.slug === "ats-resume-score-checker") return { kind: "ats" };
  return {
    kind: CODE_TOOLS.has(tool.slug) ? "code" : "text",
    instruction:
      instructions[tool.slug] ||
      `Complete the ${tool.name} task described by the user. Return a detailed, accurate, practical result in Markdown.`,
  };
};

export const imagePromptForTool = (toolSlug, input) => {
  const prefixes = {
    "ai-logo-generator": "Create a professional original logo concept, clean background, no mockup,",
    "ai-thumbnail-generator": "Create a high-contrast 16:9 video thumbnail with clear focal hierarchy,",
    "ai-poster-flyer-generator": "Create a polished poster or flyer composition with space for readable typography,",
    "ai-avatar-generator": "Create a square profile avatar portrait, centered subject,",
  };
  return `${prefixes[toolSlug] || "Create an image,"} ${input}`;
};
