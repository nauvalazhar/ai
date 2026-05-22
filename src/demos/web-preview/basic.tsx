import { Monitor, RotateCw, Smartphone, Tablet } from "lucide-react";
import { Button } from "#/components/ai/button";
import {
  Select,
  SelectItem,
  SelectList,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "#/components/ai/select";
import {
  type Viewport,
  WebPreview,
  WebPreviewAddress,
  WebPreviewContent,
  WebPreviewHeader,
  WebPreviewReload,
  useWebPreview,
} from "#/components/ai/web-preview";

const presets: Viewport[] = [null, 768, 375];

const icons = [Monitor, Tablet, Smartphone];
const labels = ["Fit", "Tablet", "Mobile"];

const sites = [
  { value: "/demo/reasoning/basic", label: "Reasoning" },
  { value: "/demo/composer/basic", label: "Composer" },
  { value: "/demo/document/basic", label: "Document" },
];

function SiteSelect() {
  const { url, setUrl } = useWebPreview();
  const current = sites.find((s) => s.value === url) ?? sites[0];

  return (
    <Select
      value={current}
      onValueChange={(v) => setUrl((v as (typeof sites)[number]).value)}
    >
      <SelectTrigger variant="subtle" className="mr-auto w-36 shrink-0">
        <SelectValue placeholder="Site" />
      </SelectTrigger>
      <SelectPopup>
        <SelectList>
          {sites.map((s) => (
            <SelectItem key={s.value} value={s}>
              {s.label}
            </SelectItem>
          ))}
        </SelectList>
      </SelectPopup>
    </Select>
  );
}

function ViewportCycle() {
  const { viewport, setViewport } = useWebPreview();
  const matched = presets.findIndex((p) => p === viewport);
  const index = matched >= 0 ? matched : 0;
  const Icon = icons[index];
  const next = () => setViewport(presets[(index + 1) % presets.length]);

  return (
    <Button
      iconOnly
      variant="ghost"
      onClick={next}
      aria-label={`Switch viewport (current: ${labels[index]})`}
      className="text-muted-foreground hover:text-foreground"
    >
      <Icon />
    </Button>
  );
}

export default function Basic() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <WebPreview defaultUrl="/demo/reasoning/basic">
        <WebPreviewHeader>
          <div className="w-1/3">
            <SiteSelect />
          </div>
          <div className="w-1/3 flex items-center justify-center gap-1.5">
            <WebPreviewReload
              render={
                <Button
                  iconOnly
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                />
              }
            >
              <RotateCw />
            </WebPreviewReload>
            <WebPreviewAddress />
            <ViewportCycle />
          </div>
        </WebPreviewHeader>
        <WebPreviewContent className="h-120" />
      </WebPreview>
    </div>
  );
}
