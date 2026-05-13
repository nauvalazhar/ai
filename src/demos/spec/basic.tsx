import {
  Spec,
  SpecContent,
  SpecField,
  SpecFieldLabel,
  SpecFieldValue,
  SpecHeader,
  SpecItem,
  SpecTrigger,
} from "#/components/ai/spec";

const props = [
  {
    name: "src",
    type: "string",
    description: "Image source URL.",
  },
  {
    name: "alt",
    type: "string",
    default: '""',
    description: "Image alt text.",
  },
  {
    name: "fallback",
    type: "ReactNode",
    description: "Rendered when src is absent (initial, icon, etc).",
  },
];

export default function Basic() {
  return (
    <div className="max-w-2xl mx-auto">
      <Spec cols="grid-cols-[35%_65%]">
        <SpecHeader>
          <span>Prop</span>
          <span>Type</span>
        </SpecHeader>
        {props.map((p) => (
          <SpecItem key={p.name}>
            <SpecTrigger>
              <span className="font-mono text-primary">{p.name}</span>
              <span className="font-mono">{p.type}</span>
            </SpecTrigger>
            <SpecContent>
              {p.description && (
                <p className="text-sm m-0 text-muted-foreground">
                  {p.description}
                </p>
              )}
              <SpecField>
                <SpecFieldLabel>Type</SpecFieldLabel>
                <SpecFieldValue>
                  <code className="font-mono">{p.type}</code>
                </SpecFieldValue>
              </SpecField>
              {p.default && (
                <SpecField>
                  <SpecFieldLabel>Default</SpecFieldLabel>
                  <SpecFieldValue>
                    <code className="font-mono">{p.default}</code>
                  </SpecFieldValue>
                </SpecField>
              )}
            </SpecContent>
          </SpecItem>
        ))}
      </Spec>
    </div>
  );
}
