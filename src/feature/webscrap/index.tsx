import { WordDescType } from "./worddesc";

export function ScrapLabels(props: { worddesc: WordDescType }) {
  return (
    <div className="flex items-center gap-3">
      {props.worddesc.pos && (
        <span className="px-4 py-2 rounded-xl text-xs bg-violet-700 text-white">
          {props.worddesc.pos}
        </span>
      )}
      {props.worddesc.level && (
        <span className="px-4 py-2 rounded-xl text-xs bg-violet-700 text-white">
          {props.worddesc.level}
        </span>
      )}
      {props.worddesc.article && (
        <span className="px-4 py-2 rounded-xl text-xs bg-violet-700 text-white">
          {props.worddesc.article}
        </span>
      )}
      {props.worddesc.pronounce && (
        <span className="px-4 py-2 rounded-xl text-xs bg-violet-700 text-white">
          {props.worddesc.pronounce}
        </span>
      )}
    </div>
  );
}
