import { AppError } from "@/lib/api-response";
import type { GenerateJsonInput, LlmProvider } from "@/lib/llm/provider";
import type {
  PublishAgentOutput,
  ResearchAgentOutput,
  ScriptAgentOutput,
  TopicAgentOutput,
} from "@/lib/validations/ai";

export class MockProvider implements LlmProvider {
  async generateJson<T>({ schema }: GenerateJsonInput) {
    if (schema.name === "topic_agent_output") {
      return buildMockTopicOutput() as T;
    }

    if (schema.name === "research_agent_output") {
      return buildMockResearchOutput() as T;
    }

    if (schema.name === "script_agent_output") {
      return buildMockScriptOutput() as T;
    }

    if (schema.name === "publish_agent_output") {
      return buildMockPublishOutput() as T;
    }

    throw new AppError(
      "AI_GENERATION_FAILED",
      `Mock provider does not support schema: ${schema.name}`,
      500,
    );
  }
}

function buildMockPublishOutput(): PublishAgentOutput {
  return {
    platform: "BILIBILI",
    title: "Stop using AI as a chatbot: build a learning workflow instead",
    description:
      "A practical tutorial for beginners who want to use AI to organize learning, summarize materials, practice recall, and save time without blindly trusting model output.",
    hashtags: ["AI learning", "study workflow", "productivity", "tutorial"],
    copy: [
      "Most beginners use AI by asking one vague question at a time.",
      "That is why it often feels helpful but does not really change the learning process.",
      "",
      "In this video, I break down a simple AI learning workflow:",
      "1. Set the role and context",
      "2. Turn material into a learning path",
      "3. Practice with AI-generated questions",
      "4. Verify important information",
      "",
      "Save this if you want a repeatable way to learn faster with AI.",
    ].join("\n"),
  };
}

function buildMockScriptOutput(): ScriptAgentOutput {
  return {
    script: [
      "# Video Script",
      "",
      "## Opening Hook",
      "Most people open an AI tool, ask one vague question, and then wonder why it does not really save them time. The problem is not the tool. The problem is that they are using AI like a chat box, not like a learning workflow.",
      "",
      "## Main Script",
      "",
      "### Part 1",
      "Start with the simplest shift: give AI a role, context, and output format. Instead of asking, \"Explain this concept,\" say, \"Act as a patient tutor. Explain this concept to a first-year college student, then give me three review questions.\" That one change already makes the answer more useful.",
      "",
      "### Part 2",
      "Next, use AI to turn messy material into a learning path. Paste your notes or a reading excerpt, then ask it to identify the key ideas, confusing terms, and what you should review first. This is not replacing your thinking. It is helping you organize where to spend attention.",
      "",
      "### Part 3",
      "Finally, close the loop with practice. Ask AI to quiz you, check your answer, and explain what you missed. The real value is not getting one perfect answer. The real value is building a repeatable cycle: understand, summarize, practice, correct.",
      "",
      "## Closing Summary",
      "So if you want AI to actually improve learning efficiency, stop treating it as a magic answer machine. Use it as a system: set the task, provide context, request a format, and always verify important information.",
      "",
      "## Engagement CTA",
      "If you want, comment with the subject you are learning right now, and I can turn this workflow into a sample prompt for that subject. Save this video so you can copy the structure later.",
    ].join("\n"),
  };
}

function buildMockResearchOutput(): ResearchAgentOutput {
  return {
    researchNote: [
      "# Research Note",
      "",
      "## Background",
      "Many beginners use AI as a simple question-answer tool, but the bigger productivity gain comes from turning it into a repeatable workflow. For learning, that means using AI to clarify concepts, summarize materials, build review plans, and practice expression.",
      "",
      "## Core Takeaways",
      "- AI is most useful when the user gives it a clear task, context, and output format.",
      "- The best learning workflows combine AI assistance with human verification.",
      "- Beginners should start with a few repeatable use cases instead of trying every tool.",
      "",
      "## Supporting Arguments",
      "- Search support: AI can help turn a broad question into a focused learning path.",
      "- Reading support: AI can summarize dense material and explain difficult concepts in simpler language.",
      "- Writing support: AI can turn notes into drafts, outlines, and review questions.",
      "- Review support: AI can quiz the learner and expose weak points.",
      "",
      "## Content Outline",
      "1. Open with the problem: many people use AI but do not actually save time.",
      "2. Explain the core idea: use AI as a workflow, not just a chatbot.",
      "3. Show three practical learning workflows.",
      "4. Give a simple prompt template viewers can copy.",
      "5. End with a reminder to verify important information.",
      "",
      "## Examples or Angles",
      "- Compare a vague prompt with a structured prompt.",
      "- Show a before-and-after learning routine.",
      "- Use a student exam review scenario or a workplace skill-learning scenario.",
      "",
      "## Creation Notes",
      "Keep the tone practical and avoid overpromising. The video should make viewers feel they can try the workflow immediately after watching.",
    ].join("\n"),
  };
}

function buildMockTopicOutput(): TopicAgentOutput {
  return {
    topics: [
      {
        title: "How beginners can save 2 hours a day with AI",
        description:
          "A practical tutorial showing search, reading, and writing workflows.",
        reason:
          "The benefit is concrete, easy to understand, and suitable for a tutorial format.",
      },
      {
        title: "5 AI learning workflows every student should try",
        description:
          "A platform-friendly list covering notes, summaries, review plans, and practice.",
        reason:
          "The angle is specific to students and creates natural saves and shares.",
      },
      {
        title: "Stop using AI as a chatbot: use it as a study system",
        description:
          "A stronger opinion-led topic that reframes AI from casual Q&A to repeatable workflows.",
        reason:
          "The contrast gives the topic a clearer hook and helps it stand out.",
      },
      {
        title: "Build a personal AI study assistant in 10 minutes",
        description:
          "A step-by-step creator script for setting up prompts and routines for learning.",
        reason:
          "It promises a clear outcome and fits viewers who want immediate action.",
      },
      {
        title: "The AI learning mistakes beginners keep making",
        description:
          "A diagnostic topic explaining vague prompts, blind trust, and lack of review loops.",
        reason:
          "Mistake-based topics are easy to click and useful for early-stage audiences.",
      },
    ],
  };
}
