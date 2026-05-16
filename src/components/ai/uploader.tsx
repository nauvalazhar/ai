import {
  createContext,
  Fragment,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "#/lib/utils";

export type UploadItem = {
  id: string;
  name: string;
  size?: number;
  type?: string;
  status: "pending" | "uploading" | "success" | "error" | "canceled";
  progress: number;
  file?: File;
  previewUrl?: string;
  preview?: string;
  result?: unknown;
  error?: { code: string; message: string };
};

export type UploaderFn = (input: {
  id: string;
  file: File;
  signal: AbortSignal;
  onProgress: (progress: number) => void;
}) => Promise<unknown>;

type UploaderContextValue = {
  items: UploadItem[];
  open: () => void;
  add: (files: File[] | FileList) => void;
  cancel: (id: string) => void;
  retry: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  accept?: string;
  multiple: boolean;
  maxFiles?: number;
};

const UploaderContext = createContext<UploaderContextValue | null>(null);

export function useUploader() {
  const ctx = use(UploaderContext);
  if (!ctx) throw new Error("Uploader parts must be used inside <Uploader>");
  return ctx;
}

type UploaderProps = {
  uploader: UploaderFn;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
  autoUpload?: boolean;
  items?: UploadItem[];
  defaultItems?: UploadItem[];
  onItemsChange?: (items: UploadItem[]) => void;
  onProgress?: (id: string, progress: number) => void;
  onSuccess?: (item: UploadItem) => void;
  onError?: (item: UploadItem) => void;
  children?: React.ReactNode;
};

export function Uploader({
  uploader,
  accept,
  maxFiles,
  maxSize,
  multiple = true,
  autoUpload = true,
  items: itemsProp,
  defaultItems,
  onItemsChange,
  onProgress,
  onSuccess,
  onError,
  children,
}: UploaderProps) {
  const isControlled = itemsProp !== undefined;
  const [internalItems, setInternalItems] = useState<UploadItem[]>(
    defaultItems ?? [],
  );
  const items = isControlled ? itemsProp : internalItems;

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const [liveProgress, setLiveProgress] = useState<Record<string, number>>({});
  const [blobUrls, setBlobUrls] = useState<Record<string, string>>({});
  const blobUrlsRef = useRef(blobUrls);
  blobUrlsRef.current = blobUrls;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const controllersRef = useRef<Map<string, AbortController>>(new Map());
  const startedRef = useRef<Set<string>>(new Set());

  const uploaderRef = useRef(uploader);
  uploaderRef.current = uploader;
  const onItemsChangeRef = useRef(onItemsChange);
  onItemsChangeRef.current = onItemsChange;
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const mutate = useCallback(
    (updater: (prev: UploadItem[]) => UploadItem[]) => {
      const next = updater(itemsRef.current);
      itemsRef.current = next;
      if (!isControlled) setInternalItems(next);
      onItemsChangeRef.current?.(next);
    },
    [isControlled],
  );

  const validate = useCallback(
    (file: File): { code: string; message: string } | null => {
      if (maxSize !== undefined && file.size > maxSize) {
        return {
          code: "max_size",
          message: `File exceeds ${maxSize} bytes`,
        };
      }
      if (accept) {
        const tokens = accept
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        const matched = tokens.some((t) => {
          if (t.endsWith("/*")) return file.type.startsWith(t.slice(0, -1));
          if (t.startsWith("."))
            return file.name.toLowerCase().endsWith(t.toLowerCase());
          return file.type === t;
        });
        if (!matched)
          return { code: "accept", message: "File type not accepted" };
      }
      return null;
    },
    [accept, maxSize],
  );

  const add = useCallback(
    (input: File[] | FileList) => {
      const incoming = Array.from(input);
      if (incoming.length === 0) return;

      const current = itemsRef.current;
      const live = current.filter(
        (i) => i.status !== "canceled" && i.status !== "error",
      );
      const remaining =
        maxFiles === undefined
          ? incoming.length
          : Math.max(0, maxFiles - live.length);
      const limit = multiple ? remaining : 1;
      const accepted = incoming.slice(0, limit);

      const newBlobs: Record<string, string> = {};
      const newItems: UploadItem[] = accepted.map((file) => {
        const error = validate(file);
        const id =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        if (!error && file.type.startsWith("image/")) {
          newBlobs[id] = URL.createObjectURL(file);
        }
        return {
          id,
          name: file.name,
          size: file.size,
          type: file.type,
          status: error ? "error" : "pending",
          progress: 0,
          file,
          error: error ?? undefined,
        };
      });

      if (newItems.length === 0) return;

      if (Object.keys(newBlobs).length > 0) {
        setBlobUrls((prev) => ({ ...prev, ...newBlobs }));
      }

      if (maxFiles === 1) {
        mutate(() => newItems);
      } else {
        mutate((prev) => [...prev, ...newItems]);
      }
    },
    [maxFiles, multiple, mutate, validate],
  );

  const runUpload = useCallback(
    async (id: string) => {
      const item = itemsRef.current.find((i) => i.id === id);
      if (!item || !item.file) return;
      if (startedRef.current.has(id)) return;
      startedRef.current.add(id);

      const controller = new AbortController();
      controllersRef.current.set(id, controller);

      mutate((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, status: "uploading", error: undefined } : i,
        ),
      );

      try {
        const result = await uploaderRef.current({
          id,
          file: item.file,
          signal: controller.signal,
          onProgress: (p) => {
            setLiveProgress((prev) => ({ ...prev, [id]: p }));
            onProgressRef.current?.(id, p);
          },
        });

        const maybeUrl =
          result && typeof result === "object" && "url" in result
            ? (result as { url?: unknown }).url
            : undefined;
        const previewUrl = typeof maybeUrl === "string" ? maybeUrl : undefined;

        mutate((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: "success",
                  progress: 100,
                  result,
                  previewUrl: previewUrl ?? i.previewUrl,
                }
              : i,
          ),
        );
        setLiveProgress((prev) => ({ ...prev, [id]: 100 }));

        const finalItem = itemsRef.current.find((i) => i.id === id);
        if (finalItem) onSuccessRef.current?.(finalItem);
      } catch (e) {
        if (controller.signal.aborted) {
          mutate((prev) =>
            prev.map((i) => (i.id === id ? { ...i, status: "canceled" } : i)),
          );
        } else {
          const err = e as { code?: string; message?: string };
          const error = {
            code: err?.code ?? "upload_failed",
            message: err?.message ?? "Upload failed",
          };
          mutate((prev) =>
            prev.map((i) =>
              i.id === id ? { ...i, status: "error", error } : i,
            ),
          );
          const finalItem = itemsRef.current.find((i) => i.id === id);
          if (finalItem) onErrorRef.current?.(finalItem);
        }
      } finally {
        controllersRef.current.delete(id);
        startedRef.current.delete(id);
      }
    },
    [mutate],
  );

  useEffect(() => {
    if (!autoUpload) return;
    for (const item of items) {
      if (
        item.status === "pending" &&
        item.file &&
        !startedRef.current.has(item.id)
      ) {
        runUpload(item.id);
      }
    }
  }, [items, autoUpload, runUpload]);

  const open = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const cancel = useCallback((id: string) => {
    controllersRef.current.get(id)?.abort();
  }, []);

  const retry = useCallback(
    (id: string) => {
      mutate((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, status: "pending", error: undefined } : i,
        ),
      );
    },
    [mutate],
  );

  const remove = useCallback(
    (id: string) => {
      controllersRef.current.get(id)?.abort();
      setLiveProgress((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
      mutate((prev) => prev.filter((i) => i.id !== id));
    },
    [mutate],
  );

  const clear = useCallback(() => {
    for (const c of controllersRef.current.values()) c.abort();
    controllersRef.current.clear();
    setLiveProgress({});
    mutate(() => []);
  }, [mutate]);

  useEffect(() => {
    let mutated = false;
    const next = { ...blobUrlsRef.current };
    const liveIds = new Set(items.map((i) => i.id));

    for (const id of Object.keys(next)) {
      if (!liveIds.has(id)) {
        URL.revokeObjectURL(next[id]);
        delete next[id];
        mutated = true;
      }
    }
    for (const item of items) {
      if (item.file && item.file.type.startsWith("image/") && !next[item.id]) {
        next[item.id] = URL.createObjectURL(item.file);
        mutated = true;
      }
    }

    if (mutated) setBlobUrls(next);
  }, [items]);

  useEffect(
    () => () => {
      for (const url of Object.values(blobUrlsRef.current)) {
        URL.revokeObjectURL(url);
      }
    },
    [],
  );

  const mergedItems = useMemo(
    () =>
      items.map((i) => {
        const live = liveProgress[i.id];
        const progress = live !== undefined ? live : i.progress;
        const preview = i.previewUrl ?? blobUrls[i.id];
        return { ...i, progress, preview };
      }),
    [items, liveProgress, blobUrls],
  );

  const ctxValue = useMemo<UploaderContextValue>(
    () => ({
      items: mergedItems,
      open,
      add,
      cancel,
      retry,
      remove,
      clear,
      accept,
      multiple,
      maxFiles,
    }),
    [
      mergedItems,
      open,
      add,
      cancel,
      retry,
      remove,
      clear,
      accept,
      multiple,
      maxFiles,
    ],
  );

  return (
    <UploaderContext value={ctxValue}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => {
          const files = e.target.files;
          if (files) add(files);
          e.target.value = "";
        }}
      />
      {children}
    </UploaderContext>
  );
}

export function UploaderTrigger({
  render,
  ...props
}: useRender.ComponentProps<"button">) {
  const { open } = useUploader();
  const userClick = (props as { onClick?: React.MouseEventHandler })["onClick"];
  return useRender({
    render,
    defaultTagName: "button",
    props: {
      type: "button",
      ...props,
      "data-slot": "uploader-trigger",
      onClick: (e: React.MouseEvent) => {
        userClick?.(e);
        if (e.defaultPrevented) return;
        open();
      },
    },
  });
}

export function UploaderDropzone({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { add } = useUploader();
  const [isOver, setIsOver] = useState(false);
  const depthRef = useRef(0);

  return (
    <div
      data-slot="uploader-dropzone"
      data-drag-over={isOver || undefined}
      onDragEnter={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        depthRef.current += 1;
        if (depthRef.current === 1) setIsOver(true);
      }}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
      }}
      onDragLeave={() => {
        depthRef.current = Math.max(0, depthRef.current - 1);
        if (depthRef.current === 0) setIsOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        depthRef.current = 0;
        setIsOver(false);
        if (e.dataTransfer.files.length > 0) add(e.dataTransfer.files);
      }}
      className={cn(className)}
      {...props}
    />
  );
}

type UploaderListProps = Omit<React.ComponentProps<"div">, "children"> & {
  children: (
    item: UploadItem,
    actions: { cancel: () => void; retry: () => void; remove: () => void },
  ) => React.ReactNode;
};

export function UploaderList({
  children,
  className,
  ...props
}: UploaderListProps) {
  const { items, cancel, retry, remove } = useUploader();
  return (
    <div data-slot="uploader-list" className={cn(className)} {...props}>
      {items.map((item) => (
        <Fragment key={item.id}>
          {children(item, {
            cancel: () => cancel(item.id),
            retry: () => retry(item.id),
            remove: () => remove(item.id),
          })}
        </Fragment>
      ))}
    </div>
  );
}

export function useUploaderAttach(
  target: React.RefObject<HTMLElement | null>,
  options?: { drop?: boolean; paste?: boolean },
): { isDragOver: boolean } {
  const ctx = useUploader();
  const addRef = useRef(ctx.add);
  addRef.current = ctx.add;

  const [isDragOver, setIsDragOver] = useState(false);
  const depthRef = useRef(0);
  const { drop = true, paste = true } = options ?? {};

  useEffect(() => {
    const el = target.current;
    if (!el) return;

    const onDragEnter = (e: DragEvent) => {
      if (!drop) return;
      if (!e.dataTransfer?.types.includes("Files")) return;
      e.preventDefault();
      depthRef.current += 1;
      if (depthRef.current === 1) setIsDragOver(true);
    };
    const onDragOver = (e: DragEvent) => {
      if (!drop) return;
      if (!e.dataTransfer?.types.includes("Files")) return;
      e.preventDefault();
    };
    const onDragLeave = () => {
      if (!drop) return;
      depthRef.current = Math.max(0, depthRef.current - 1);
      if (depthRef.current === 0) setIsDragOver(false);
    };
    const onDrop = (e: DragEvent) => {
      if (!drop) return;
      e.preventDefault();
      depthRef.current = 0;
      setIsDragOver(false);
      if (e.dataTransfer && e.dataTransfer.files.length > 0)
        addRef.current(e.dataTransfer.files);
    };
    const onPaste = (e: ClipboardEvent) => {
      if (!paste) return;
      const files = Array.from(e.clipboardData?.files ?? []);
      if (files.length > 0) addRef.current(files);
    };

    el.addEventListener("dragenter", onDragEnter);
    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);
    el.addEventListener("paste", onPaste);

    return () => {
      el.removeEventListener("dragenter", onDragEnter);
      el.removeEventListener("dragover", onDragOver);
      el.removeEventListener("dragleave", onDragLeave);
      el.removeEventListener("drop", onDrop);
      el.removeEventListener("paste", onPaste);
    };
  }, [target, drop, paste]);

  return { isDragOver };
}

export type CreateXhrUploaderOptions = {
  url: string;
  method?: string;
  field?: string;
  headers?: Record<string, string> | (() => Record<string, string>);
  withCredentials?: boolean;
};

export function createXhrUploader(
  options: CreateXhrUploaderOptions,
): UploaderFn {
  const {
    url,
    method = "POST",
    field = "file",
    headers,
    withCredentials = false,
  } = options;
  return ({ file, signal, onProgress }) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.withCredentials = withCredentials;
      const h = typeof headers === "function" ? headers() : (headers ?? {});
      for (const [k, v] of Object.entries(h)) xhr.setRequestHeader(k, v);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress((e.loaded / e.total) * 100);
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          let parsed: unknown;
          try {
            parsed = JSON.parse(xhr.responseText);
          } catch {
            parsed = { body: xhr.responseText };
          }
          resolve(parsed);
        } else {
          reject(
            Object.assign(new Error(`HTTP ${xhr.status}`), {
              code: `http_${xhr.status}`,
            }),
          );
        }
      };
      xhr.onerror = () =>
        reject(Object.assign(new Error("Network error"), { code: "network" }));
      xhr.onabort = () =>
        reject(Object.assign(new Error("Aborted"), { code: "aborted" }));

      signal.addEventListener("abort", () => xhr.abort());

      const formData = new FormData();
      formData.append(field, file);
      xhr.send(formData);
    });
}
