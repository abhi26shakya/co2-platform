"use client";

import { tokens } from "@/lib/auth-tokens";
import type { ImageOut } from "@/types/image";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number; filename: string }
  | { status: "done"; image: ImageOut }
  | { status: "error"; message: string };

/** fetch() has no upload progress events, so uploads go through XHR. */
export function useUpload() {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const qc = useQueryClient();

  const upload = useCallback(
    (file: File) => {
      setState({ status: "uploading", progress: 0, filename: file.name });
      const form = new FormData();
      form.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/v1/uploads");
      const access = tokens.access;
      if (access) xhr.setRequestHeader("Authorization", `Bearer ${access}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setState({
            status: "uploading",
            progress: Math.round((e.loaded / e.total) * 100),
            filename: file.name,
          });
        }
      };
      xhr.onload = () => {
        if (xhr.status === 201) {
          setState({ status: "done", image: JSON.parse(xhr.responseText) });
          qc.invalidateQueries({ queryKey: ["dashboard"] });
          qc.invalidateQueries({ queryKey: ["images"] });
        } else {
          let message = `Upload failed (${xhr.status})`;
          try {
            message = JSON.parse(xhr.responseText).detail ?? message;
          } catch {
            /* non-JSON body */
          }
          setState({ status: "error", message });
        }
      };
      xhr.onerror = () => setState({ status: "error", message: "Network error during upload" });
      xhr.send(form);
    },
    [qc]
  );

  const reset = useCallback(() => setState({ status: "idle" }), []);
  return { state, upload, reset };
}
