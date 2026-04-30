import nlp from 'compromise';
import { stemmer } from 'stemmer';
import leven from 'leven';
import { Injectable } from "@angular/core";

// --- Types
export type CandidateInput = string;

export interface MatchResult {
  candidateIndex: number;
  candidateText: string;
  score: number; // 0..1
  matchedKeywords: string[];
  missingRequired?: string[];
  reasons: string[]; // human-readable hints about what matched
}

export interface AnswerMatcherOptions {
  stopwords?: Set<string>;
  synonymMap?: Record<string, string[]>;
  tokenMatchLevenshteinRatio?: number; // relative distance threshold (e.g. 0.25)
  highThreshold?: number; // accepted immediately
  lowThreshold?: number; // ambiguous zone
}



// --- Default resources (customize for your dataset)
const DEFAULT_STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'of', 'for', 'to', 'by', 'with',
  'that', 'this', 'these', 'those', 'as', 'be', 'been', 'from', 'which', 'it', 'its', 'their', 'they', 'he', 'she', 'we', 'you', 'i', ',', '.'
]);

const DEFAULT_SYNONYMS: Record<string, string[]> = {
  // People / Titles
  'president': ['president', 'prez', 'potus'],
  'united states': ['US', 'USA', 'united states', 'united states of america'],
  'constitution': ['constitution', 'const'],
  'supreme court': ['supreme court', 'scotus'],
  'federalist': ['federalist', 'federalists'],
  'papers': ['paper', 'papers', 'essay', 'essays'],
  'world trade center': ['world trade center', 'wtc'],
  'new york city': ['new york city', 'nyc'],
  'plane': ['plane', 'planes', 'airplane', 'airplanes', 'plane(s)'],
  'state': ['state', 'states'],
  'star': ['star', 'stars'],
  'vote': ['vote', 'voting'],
  'naturalize': ['naturalizing', 'naturalization', 'naturalize'],
  // World War I and II synonyms
  'world war i': ['world war i', 'world war 1', 'ww1', 'wwi', 'the first world war'],
  'world war ii': ['world war ii', 'world war 2', 'ww2', 'wwii', 'the second world war'],
};

export const HIGH_THRESHOLD = 0.8;
export const LOW_THRESHOLD = 0.45;

// Helper: unify synonyms to lower-case normalized tokens (symmetric)
function buildSynonymLookup(map: Record<string, string[]>) {
  // Build a symmetric lookup: every member in each synonym group maps to the other members.
  const lookup: Record<string, string[]> = {};
  for (const [k, vals] of Object.entries(map)) {
    const members = new Set<string>([normalizeText(k), ...vals.map(v => normalizeText(v))]);
    const arr = Array.from(members);
    for (const m of arr) {
      lookup[m] = arr.filter(x => x !== m);
    }
  }
  return lookup;
}

// --- Normalization utilities
export function normalizeText(s: string) {
  if (!s) return '';
  // lowercase
  const lower = s.toLowerCase();
  // remove periods first so D.C. -> dc
  let t = lower.replace(/\./g, '');
  // remove ascii and smart apostrophes (so "Year’s" and "Year's" both normalize)
  t = t.replace(/['\u2019\u2018\u201B\u201A\u201C\u201D]/g, '');
  // replace other punctuation with space, keep parentheses (we need them for parenthetical variants)
  t = t.replace(/[^a-z0-9\-\(\)\' ]+/g, ' ');
  // collapse whitespace
  const collapsed = t.replace(/\s+/g, ' ').trim();
  return collapsed;
}

// Tokenize using compromise (browser-friendly). Returns normalized tokens.
function tokenize(s: string) {
  if (!s) return [] as string[];
  const doc = nlp(s);
  const terms: string[] = doc.terms().out('array') as string[];
  return terms.map(t => normalizeText(t)).filter(Boolean);
}

// Stem tokens using tiny `stemmer`
function stemTokens(tokens: string[]) {
  return tokens.map(t => stemmer(t));
}

// Fuzzy token match using Levenshtein normalized by token length
function tokenFuzzyEqual(a: string, b: string, ratioThreshold: number) {
  if (!a || !b) return false;
  if (a === b) return true;
  const dist = leven(a, b);
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return true;
  const rel = dist / maxLen;
  return rel <= ratioThreshold;
}

// Multi-word phrase matching (exact or fuzzy on constituent tokens)
// phraseTokens will be filtered for stopwords by the caller to keep behavior consistent
function phraseMatches(phrase: string, userTokens: string[], options: { ratioThreshold: number; stopwords: Set<string> }) {
  const phraseTokensAll = tokenize(normalizeText(phrase));
  const phraseTokens = phraseTokensAll.filter(t => !options.stopwords.has(t));
  if (phraseTokens.length === 0) return false;

  // sliding window over user tokens
  for (let i = 0; i <= userTokens.length - phraseTokens.length; i++) {
    let allMatch = true;
    for (let j = 0; j < phraseTokens.length; j++) {
      const pt = phraseTokens[j];
      const ut = userTokens[i + j];
      if (!tokenFuzzyEqual(pt, ut, options.ratioThreshold)) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) return true;
  }

  // allow non-contiguous matches (all phrase tokens exist in user tokens in any order)
  const matched = phraseTokens.every(pt => userTokens.some(ut => tokenFuzzyEqual(pt, ut, options.ratioThreshold)));
  return matched;
}

// Utility: generate candidate variants handling parentheses (words inside parentheses optional)
function generateCandidateVariants(candNorm: string) {
  // removed: remove parenthetical groups entirely
  const removed = candNorm.replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  // kept: strip parentheses but keep content
  const kept = candNorm.replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim();
  const set = new Set<string>();
  if (removed.length > 0) set.add(removed);
  if (kept.length > 0) set.add(kept);
  // include original normalized candidate as well
  if (candNorm.length > 0) set.add(candNorm);
  return Array.from(set);
}

@Injectable({
  providedIn: 'root'
})
export class AnswerMatcher {
  private readonly stopwords: Set<string>;
  private readonly synonymLookup: Record<string, string[]>;
  private readonly tokenMatchLevenshteinRatio: number;
  private readonly highThreshold: number;
  private readonly lowThreshold: number;

  constructor() {
    this.stopwords = DEFAULT_STOPWORDS;
    this.synonymLookup = buildSynonymLookup(DEFAULT_SYNONYMS);
    this.tokenMatchLevenshteinRatio = 0.25; // 25%
    this.highThreshold = HIGH_THRESHOLD;
    this.lowThreshold = LOW_THRESHOLD;
  }

  /**
   * Entry point: takes provided answer string and a list of potential answers (strings only).
   * Returns list of MatchResult (possibly empty).
   */
  public matchAnswer(provided: string, candidates: CandidateInput[], noOfAnswers: number): MatchResult[] {
    const userNorm = normalizeText(provided);
    // Tokenize and remove stopwords for user
    const userTokensRaw = tokenize(userNorm);
    const userTokens = userTokensRaw.filter(t => !this.stopwords.has(t));
    const userStems = stemTokens(userTokens);

    const results: MatchResult[] = [];

    for (let i = 0; i < candidates.length; i++) {
      const candText = candidates[i];
      const candNorm = normalizeText(candText);

      // generate variants for parenthesis handling
      const variants = generateCandidateVariants(candNorm);

      // Exact token-level match ignoring stopwords: compare token sequences (so "the soviet union" matches "soviet union")
      const userJoined = userTokens.join(' ');
      let exactMatched = false;
      for (const v of variants) {
        const vTokens = tokenize(v).filter(t => !this.stopwords.has(t));
        const vJoined = vTokens.join(' ');
        if (vJoined.length > 0 && vJoined === userJoined) {
          // full exact match on tokens (ignoring stopwords)
          results.push({
            candidateIndex: i,
            candidateText: candText,
            score: 1,
            matchedKeywords: vTokens,
            reasons: ['exact token match (stopwords ignored & parenthesis handled)']
          });
          exactMatched = true;
          break;
        }
      }
      if (exactMatched) continue; // best possible

      // Otherwise compute best score among variants
      let bestVariantScore = 0;
      let bestVariantMatchedKeywords: string[] = [];
      let bestVariantReasons: string[] = [];

      for (const v of variants) {
        const candTokens = tokenize(v).filter(t => !this.stopwords.has(t));
        const candStems = stemTokens(candTokens);

        // SCORE COMPONENTS (per variant)
        let score = 0;
        const reasons: string[] = [];
        const matchedKeywords: string[] = [];

        // Pre-check n-grams (bigrams/trigrams) to match multi-word synonyms like "united states" -> "us"
        const matchedIndices = new Set<number>();
        const maxN = Math.min(3, candTokens.length);
        // prefer larger n first (3 then 2)
        for (let n = maxN; n >= 2; n--) {
          for (let start = 0; start + n <= candTokens.length; start++) {
            // skip if any token in this n-gram already matched
            let overlap = false;
            for (let k = start; k < start + n; k++) {
              if (matchedIndices.has(k)) { overlap = true; break; }
            }
            if (overlap) continue;
            const ngram = candTokens.slice(start, start + n).join(' ');
            const syns = this.synonymLookup[ngram] ?? [];
            if (!syns || syns.length === 0) continue;
            // try each synonym; accept if any matches user input (single token or phrase)
            let found = false;
            for (const syn of syns) {
              if (!syn || syn.length === 0) continue;
              if (syn.includes(' ')) {
                // multi-word synonym -> phrase match
                if (phraseMatches(syn, userTokens, { ratioThreshold: this.tokenMatchLevenshteinRatio, stopwords: this.stopwords })) {
                  // count this n-gram as matched
                  for (let k = start; k < start + n; k++) matchedIndices.add(k);
                  matchedKeywords.push(`${ngram}->${syn}`);
                  found = true;
                  break;
                }
              } else {
                // single-token synonym -> direct/fuzzy match against user tokens
                if (userTokens.includes(syn)) {
                  for (let k = start; k < start + n; k++) matchedIndices.add(k);
                  matchedKeywords.push(`${ngram}->${syn}`);
                  found = true;
                  break;
                }
                for (const ut of userTokens) {
                  if (tokenFuzzyEqual(syn, ut, this.tokenMatchLevenshteinRatio)) {
                    for (let k = start; k < start + n; k++) matchedIndices.add(k);
                    matchedKeywords.push(`${ngram}->${ut}`);
                    found = true;
                    break;
                  }
                }
                if (found) break;
              }
            }
            if (found) {
              // each matched index counts as matched token for tokenMatchCount (we'll count later)
            }
          }
        }

        // 1) phrase / multiword matches (strong signal)
        if (v.includes(' ')) {
          if (phraseMatches(v, userTokens, { ratioThreshold: this.tokenMatchLevenshteinRatio, stopwords: this.stopwords })) {
            score += 0.25;
            reasons.push('phrase-level match');
            matchedKeywords.push(...tokenize(v).filter(t => !this.stopwords.has(t)));
          }
        }

        // 2) token overlap and fuzzy token matches (per-token)
        let tokenMatchCount = 0;
        for (let idx = 0; idx < candTokens.length; idx++) {
          if (matchedIndices.has(idx)) {
            tokenMatchCount++;
            continue; // already matched via n-gram
          }
          const ct = candTokens[idx];
          if (userTokens.includes(ct)) {
            tokenMatchCount++;
            matchedKeywords.push(ct);
            continue;
          }
          // synonyms (for single-token candidate token)
          const syns = this.synonymLookup[ct] ?? [];
          let synMatched = false;
          for (const syn of syns) {
            if (!syn) continue;
            if (syn.includes(' ')) {
              // multi-word synonym -> phraseMatches against user tokens
              if (phraseMatches(syn, userTokens, { ratioThreshold: this.tokenMatchLevenshteinRatio, stopwords: this.stopwords })) {
                tokenMatchCount++;
                matchedKeywords.push(`${ct}->${syn}`);
                synMatched = true;
                break;
              }
            } else {
              if (userTokens.includes(syn)) {
                tokenMatchCount++;
                matchedKeywords.push(ct + '->' + syn);
                synMatched = true;
                break;
              }
              for (const ut of userTokens) {
                if (tokenFuzzyEqual(syn, ut, this.tokenMatchLevenshteinRatio)) {
                  tokenMatchCount++;
                  matchedKeywords.push(`${ct}->${ut}`);
                  synMatched = true;
                  break;
                }
              }
              if (synMatched) break;
            }
          }

          if (synMatched) continue;

          // fuzzy-match candidate token directly with user tokens
          let fuzzyMatched = false;
          for (const ut of userTokens) {
            if (tokenFuzzyEqual(ct, ut, this.tokenMatchLevenshteinRatio)) {
              tokenMatchCount++;
              matchedKeywords.push(`${ct}~${ut}`);
              fuzzyMatched = true;
              break;
            }
          }
          if (fuzzyMatched) continue;
        }

        const tokenRatio = candTokens.length > 0 ? tokenMatchCount / candTokens.length : 0;
        // single-token candidates can reach full score from token matching
        const tokenCap = candTokens.length === 1 ? 1 : 0.6;
        score += Math.min(tokenCap, tokenRatio * tokenCap); // tokens contribute up to 0.6 (or 1 for single token)
        if (tokenRatio > 0) reasons.push(`token overlap ${tokenMatchCount}/${candTokens.length}`);

        // If every candidate token was matched (via exact, synonym/ngram, or fuzzy),
        // treat that as a full/strong match: boost score at least to highThreshold.
        // This ensures synonyms (like WW2 <-> World War II) produce a strong result
        // when they cover all tokens.
        if (tokenMatchCount === candTokens.length && candTokens.length > 0) {
          score = Math.max(score, this.highThreshold);
          reasons.push('all tokens matched (including synonyms)');
        }

        // 3) numeric matches (e.g., 50 stars)
        const candidateNumbers = candTokens.filter(t => /\d+/.test(t));
        for (const num of candidateNumbers) {
          if (userTokens.includes(num)) {
            score = Math.min(1, score + 0.12);
            reasons.push(`numeric match ${num}`);
            matchedKeywords.push(num);
          }
        }

        // finalize variant score
        score = Math.max(0, Math.min(1, score));

        if (score > bestVariantScore) {
          bestVariantScore = score;
          bestVariantMatchedKeywords = matchedKeywords;
          bestVariantReasons = reasons;
        }
      }

      // push best variant result
      results.push({
        candidateIndex: i,
        candidateText: candText,
        score: bestVariantScore,
        matchedKeywords: Array.from(new Set(bestVariantMatchedKeywords)),
        reasons: Array.from(new Set(bestVariantReasons))
      });
    }

    // Sort results by score desc
    results.sort((a, b) => b.score - a.score);

    // Return full results for your debugging; you can filter by lowThreshold externally
    return results;
  }

  getLowThreshold() {
    return this.lowThreshold;
  }

  getHighThreshold() {
    return this.highThreshold;
  }
}
