export const TargetLanguages = [
  {
    value: "english",
    text: "English",
    icon: "english.png",
  },
  {
    value: "german",
    text: "Deutsch",
    icon: "german.png",
  },
];

export const OsLanguages: Language[] = [
  {
    value: "russian",
    short: "RU",
    text: "Русский язык",
    icon: "russian.png",
  },
  {
    value: "english",
    short: "EN",
    text: "English",
    icon: "english.png",
  },
  {
    value: "french",
    short: "FR",
    text: "Français",
    icon: "french.png",
  },
  {
    value: "turkish",
    short: "TR",
    text: "Türkçe",
    icon: "turkish.png",
  },
  {
    value: "chinese",
    short: "ZH",
    text: "中文",
    icon: "chinese.png",
  },
];

export type Language = {
  value: string;
  short: string;
  text: string;
  icon: string;
};
