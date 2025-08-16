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
      // TODO: fix this
      // @ts-expect-error - referencedActs is not typed
      parsed.referencedActs?.forEach((a: { act: string; section: string }) => {
        if (!a) return;
        const exists = references.some(
          (r) => r.act === a.act && r.section === a.section
        );
        if (!exists) references.push(a);
      });

      // @ts-expect-error - referencedActs is not typed
      parsed.referencedCases?.forEach((c: string) => {
        if (c && !cases.includes(c)) cases.push(c);
      });

      // @ts-expect-error - referencedActs is not typed
      if (parsed.legalContext) legalContext = parsed.legalContext;
      // @ts-expect-error - referencedActs is not typed
      if (parsed.confidence != null) {
        // @ts-expect-error - referencedActs is not typed
        const val = Number(parsed.confidence);
        if (!Number.isNaN(val)) confidence = val;
      }
    }
    return { references, cases, legalContext, confidence };
  }, [messages]);
}
