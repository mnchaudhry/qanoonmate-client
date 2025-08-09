import { useMemo } from "react";
import { parseAIResponse } from "@/utils/parseAIResponse";
import { AIChatMessage } from "@/lib/interfaces";

export interface ParsedDerivatives {
  references: { act: string; section: string }[];
  cases: string[];
  legalContext: string | null;
  confidence: number | null;
}

export function useParsedMessages(
  messages: AIChatMessage[]
): ParsedDerivatives {
  return useMemo(() => {
    const references: { act: string; section: string }[] = [];
    const cases: string[] = [];
    let legalContext: string | null = null;
    let confidence: number | null = null;
    for (const msg of messages || []) {
      if (msg.sender !== "bot") continue;
      const parsed = parseAIResponse(msg.content);
      console.log("parsed", parsed);
      parsed.referencedActs?.forEach((a) => {
        if (!a) return;
        const exists = references.some(
          (r) => r.act === a.act && r.section === a.section
        );
        if (!exists) references.push(a);
      });

      parsed.referencedCases?.forEach((c) => {
        if (c && !cases.includes(c)) cases.push(c);
      });

      if (parsed.legalContext) legalContext = parsed.legalContext;
      if (parsed.confidence != null) {
        const val = Number(parsed.confidence);
        if (!Number.isNaN(val)) confidence = val;
      }
    }
    console.log("references", references);
    return { references, cases, legalContext, confidence };
  }, [messages]);
}
