// Utility to parse AI response into robust, structured sections for markdown-formatted AI responses
export function parseAIResponse(response: string) {
  // Regexes for markdown section headers and content
  const actsMatch = response.match(/#+\s*REFERENCED ACTS:\s*\n*\[([^\]]*)\]/i);
  const casesMatch = response.match(/#+\s*REFERENCED CASES:\s*\n*\[([^\]]*)\]/i);
  const quickActionMatch = response.match(/#+\s*Quick Action:\s*\n*([\s\S]*?)(?=\n+#+|$)/i);
  const legalContextMatch = response.match(/#+\s*Legal Context:\s*\n*([\s\S]*?)(?=\n+#+|$)/i);
  const confidenceMatch = response.match(/#+\s*Confidence:\s*\n*([0-9]+\.?[0-9]*)/i);

  // Main: everything before the first section header
  let main = response;
  const firstSectionIdx = Math.min(
    ...[actsMatch, casesMatch, quickActionMatch, legalContextMatch, confidenceMatch]
      .map(m => m && m.index !== undefined ? m.index : Infinity)
  );
  if (firstSectionIdx !== Infinity) {
    main = response.slice(0, firstSectionIdx).trim();
  }

  // Remove 'Legal Answer' label from the start of main, with or without markdown headers
  main = main.replace(/^#+\s*Legal Answer\s*/i, '').trim();

  // Parse referenced acts as pairs: [ACT NAME, SECTION, ACT NAME, SECTION, ...]
  let acts: { act: string, section: string }[] = [];
  if (actsMatch && actsMatch[1]) {
    const parts = actsMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i] && parts[i + 1]) {
        acts.push({ act: parts[i], section: parts[i + 1] });
      }
    }
  }

  // Parse referenced cases (handle 'None')
  let cases: string[] = [];
  if (casesMatch && casesMatch[1]) {
    if (!/^none$/i.test(casesMatch[1].trim())) {
      cases = casesMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  return {
    main,
    referencedActs: acts,
    referencedCases: cases,
    quickAction: quickActionMatch ? quickActionMatch[1].trim() : null,
    legalContext: legalContextMatch ? legalContextMatch[1].trim() : null,
    confidence: confidenceMatch ? confidenceMatch[1].trim() : null,
  };
} 