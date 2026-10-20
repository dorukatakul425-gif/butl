// Profanity filter for live/voice room titles. Covers Azerbaijani, Turkish, Russian and English,
// including transliterations, leetspeak, repeated letters, spaced-out letters and Cyrillic homoglyphs.
// The same "anywhere" stem list is mirrored in the voice_rooms DB trigger (server-side enforcement).

const CYR: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "j", з: "z", и: "i", й: "y", к: "k",
  л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "s",
  ч: "c", ш: "s", щ: "s", ъ: "", ы: "i", ь: "", э: "e", ю: "yu", я: "ya", і: "i", ї: "i", є: "e", ғ: "g", ү: "u", ә: "e", ө: "o", қ: "k", җ: "j",
};
const LAT: Record<string, string> = {
  ə: "e", ı: "i", i̇: "i", ö: "o", ü: "u", ş: "s", ç: "c", ğ: "g", q: "g", x: "h", w: "v", â: "a", î: "i", û: "u",
  "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "8": "b", "@": "a", $: "s", "!": "i", "|": "i",
};

/** Lowercase, transliterate, de-leet, drop accents. Non-letters become spaces. */
export function normalizeForFilter(input: string): string {
  let s: string;
  let out = "";
  for (const ch of input.toLowerCase()) {
    // keep Azerbaijani/Turkish letters before NFKD strips them
    const m = LAT[ch] ?? CYR[ch];
    if (m !== undefined) { out += m; continue; }
    const base = ch.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    out += LAT[base] ?? CYR[base] ?? base;
  }
  s = out
    .replace(/sh/g, "s").replace(/ch/g, "c").replace(/zh/g, "j").replace(/kh/g, "h").replace(/ph/g, "f")
    .replace(/q/g, "g").replace(/x/g, "h").replace(/y/g, "i").replace(/j/g, "c").replace(/k/g, "g").replace(/w/g, "v")
    .replace(/[^a-z]+/g, " ")
    .replace(/(.)\1+/g, "$1");
  return s.trim();
}

const norm = (w: string) => normalizeForFilter(w).replace(/ /g, "");

// Matched anywhere (also inside joined/spaced text). Long or unambiguous stems only.
const ANYWHERE_RAW = [
  // Azerbaijani
  "peysər", "peyser", "peysar", "peyserlik", "gijdillax", "gicdillax", "gicdilax", "gıcdıllaq", "gicbeser", "gicbesər",
  "qəhbə", "qehbe", "qahba", "qəhbəxana", "üəhvə", "uehve", "qancıq", "qanciq", "amcıq", "amciq", "amcığ", "aminakoy",
  "sikdir", "siktir", "sikim", "sikerem", "sikərəm", "sikəcəm", "sikmək", "sikiş", "sikis", "sikik", "sikdiyim", "sikdim", "sikilmiş",
  "götveren", "götverən", "götoğlu", "götləmə", "dalbayob", "dolbayob", "dalbayok", "yarrak", "yarağ", "yaraq", "dasşaq", "daşşaq",
  "daşaq", "taşşak", "tasak", "oğraş", "ograş", "anavi", "ananı", "ananisik", "bacını", "bacivi", "bacıvı", "qoduğ", "qoduq", "itoğlu",
  "pezevenk", "peyserlər", "qehbelik", "fahişə", "fahise", "əxlaqsız", "dıllağ", "dıllaq", "xarabaya", "poxuyu", "poxyedi", "poxuna",
  // Turkish
  "orospu", "orosbu", "kahpe", "piçkurusu", "yavşak", "yavsak", "dalyarak", "amcık", "sokarım", "sokayım", "götveren",
  "kaltak", "sürtük", "surtuk", "şerefsiz", "serefsiz", "gavat", "ibne", "puşt", "pezevenk", "taşak", "yarak", "sikerim", "siktiğim",
  "ananı", "anasını", "bacını", "gerizekalı", "mk", // "mk" handled as token below; harmless here after length filter
  // Russian (Cyrillic + translit)
  "хуй", "хуе", "хуя", "хуё", "нахуй", "похуй", "пизд", "ебат", "ебан", "ебал", "ёбан", "ебло", "уеб", "заеб", "бляд", "блят",
  "мудак", "мудил", "пидор", "пидар", "гандон", "залуп", "шлюх", "говн", "дрочи",
  "huy", "hui", "nahui", "pizd", "ebat", "eban", "blyad", "blyat", "mudak", "pidor", "pidar", "gandon", "zalup", "shlyuh", "govno", "dermo",
  // English / adult
  "fuck", "fuk", "fck", "shit", "bitch", "biatch", "dick", "cock", "pussy", "asshole", "cunt", "whore", "slut", "bastard",
  "motherf", "milf", "hentai", "onlyfans", "erotik", "erotic", "fetish", "boobs", "tits", "penis", "vagina", "blowjob", "handjob", "horny",
  "masturb", "dildo", "orgasm", "orgy", "nude", "naked", "xxx", "porn", "porno", "pornhub", "seks", "сеск", "секс", "порн",
];
// Matched only as a whole word or word start (short stems that could hide inside normal words).
const TOKEN_RAW = [
  "sik", "sikə", "sike", "siki", "sikt", "amk", "aq", "oç", "göt", "gote", "götü", "pox", "poxu", "bok", "boku",
  "qəhi", "qehi", "qahi", "gic", "gij", "dıllax", "dillax", "ibine", "eşşək", "essek", "ass", "fag", "cum", "anal", "hoe",
  "херня", "сука", "суки", "suka", "жопа", "zhopa", "манда", "трах", "шалава", "шалавы", "педик", "nigga", "niga", "niger", "sex", "sexy", "sexi", "ебу", "еби", "ёб", "бля", "blya", "yob",
];

const ANY = Array.from(new Set(ANYWHERE_RAW.map(norm).filter((w) => w.length >= 3)));
const TOK = Array.from(new Set(TOKEN_RAW.map(norm).filter((w) => w.length >= 2)));
// Normal words that contain a banned stem; checked before reporting a match.
const SAFE = ["musigi", "sussex", "essex", "sexton", "hancoc", "scunthorpe", "cocpit", "dicens", "bassin", "class", "pass", "grass", "glass", "mass", "bass", "embassi", "assist", "amal", "amir", "aman", "amin", "malic", "lebanon"].map(norm);

export type ProfanityResult = { clean: boolean; match?: string };

export function checkProfanity(input: string): ProfanityResult {
  const n = normalizeForFilter(input);
  if (!n) return { clean: true };
  const tokens = n.split(" ");
  // Spaced-out letters ("s i k") are joined back.
  const joined = tokens.join("");
  const singles = tokens.filter((t) => t.length === 1).length;
  for (const word of tokens) {
    if (SAFE.some((s) => word === s || word.startsWith(s))) continue;
    for (const stem of ANY) if (word.includes(stem)) return { clean: false, match: stem };
    for (const stem of TOK) if (word === stem) return { clean: false, match: stem };
  }
  if (singles >= 2 || tokens.length > 1) {
    const isSafe = SAFE.some((s) => joined.includes(s));
    if (!isSafe) for (const stem of ANY) if (stem.length >= 4 && joined.includes(stem)) return { clean: false, match: stem };
    if (singles >= 2) {
      const glued = tokens.reduce<string[]>((acc, t) => {
        const last = acc[acc.length - 1];
        if (t.length === 1 && last !== undefined && last.length < 6) acc[acc.length - 1] = last + t;
        else acc.push(t);
        return acc;
      }, []);
      for (const word of glued) for (const stem of [...ANY, ...TOK]) if (word === stem || (ANY.includes(stem) && word.includes(stem))) return { clean: false, match: stem };
    }
  }
  return { clean: true };
}

export const isClean = (s: string) => checkProfanity(s).clean;

/** Stems for the DB trigger (normalized, anywhere-match, length ≥ 4). */
export const DB_STEMS = ANY.filter((s) => s.length >= 4);

export const PROFANITY_WARNING: Record<"az" | "tr" | "ru" | "en", string> = {
  az: "Bu adda qadağan olunmuş söz var. Zəhmət olmasa başqa ad yaz.",
  tr: "Bu isimde yasaklı bir kelime var. Lütfen başka bir isim yaz.",
  ru: "В названии есть запрещённое слово. Пожалуйста, выберите другое.",
  en: "This name contains a banned word. Please choose another one.",
};
