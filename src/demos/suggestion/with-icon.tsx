import { ImageIcon, PenLineIcon, SparklesIcon } from "lucide-react";
import { Suggestion } from "#/components/ai/suggestion";

const items = [
  { icon: <SparklesIcon />, label: "Surprise me" },
  { icon: <PenLineIcon />, label: "Write a blog post" },
  { icon: <ImageIcon />, label: "Generate an image" },
];

export default function WithIcon() {
  return (
    <div className="mx-auto max-w-2xl flex flex-wrap items-center gap-2 py-10 justify-center">
      {items.map((item) => (
        <Suggestion key={item.label}>
          {item.icon}
          {item.label}
        </Suggestion>
      ))}
    </div>
  );
}
