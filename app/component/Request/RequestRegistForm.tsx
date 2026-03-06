"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useRequestForm from "@/app/hooks/useRequestForm";
import { X } from "lucide-react";

type RequestRegistFormProps = {
  insertId: number;
  onClose?: () => void;
};

export function RequestRegistForm({
  insertId,
  onClose,
}: RequestRegistFormProps) {
  const router = useRouter();
  const { state, formAction, inputs, keys, handleAppend, handleDelete } =
    useRequestForm(insertId);
  const [visibility, setVisibility] = useState<"team" | "group">("team");

  useEffect(() => {
    if (state.success) {
      alert("기도제목 등록을 완료하였습니다.");
      router.refresh();
      if (onClose) onClose();
    }
  }, [state, onClose, router]);

  const canAddMore = inputs.length < 3 && insertId + inputs.length < 3;

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {/* 숨겨진 입력 (기존 로직 유지) */}
      <input type="hidden" name="visibility" value={visibility} />

      {/* Textarea 입력들 */}
      {inputs.map(({ text, error }, index) => (
        <div key={keys[index]} style={{ position: "relative" }}>
          <textarea
            key={keys[index]}
            placeholder={`기도제목 ${index + 1}을 작성해주세요...`}
            autoComplete="off"
            name="text"
            defaultValue={text || ""}
            rows={2}
            maxLength={100}
            style={{
              width: "100%",
              borderRadius: "0.75rem",
              backgroundColor: "hsl(var(--secondary) / 0.5)",
              border: "none",
              padding: "0.75rem 2.5rem 0.75rem 1rem",
              fontSize: "0.875rem",
              color: "hsl(var(--foreground))",
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
              lineHeight: 1.5,
            }}
          />
          {index > 0 && (
            <button
              type="button"
              onClick={() => handleDelete(index)}
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                padding: "0.25rem",
                borderRadius: "0.5rem",
                color: "hsl(var(--muted-foreground) / 0.5)",
              }}
            >
              <X style={{ width: "0.875rem", height: "0.875rem" }} />
            </button>
          )}
          {error && (
            <p style={{ color: "hsl(var(--destructive))", fontSize: "0.75rem", marginTop: "0.25rem", fontWeight: 500 }}>
              {error}
            </p>
          )}
        </div>
      ))}

      {/* 기도제목 추가 버튼 */}
      {canAddMore && (
        <button
          type="button"
          onClick={() => handleAppend()}
          disabled={inputs.length >= 3}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "0.75rem",
            border: "1px dashed hsl(var(--border))",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: "hsl(var(--muted-foreground))",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          + 기도제목 추가 ({inputs.length}/{Math.min(3 - insertId, 3)})
        </button>
      )}

      {/* 공개범위 */}
      <div style={{ padding: "0.75rem", borderRadius: "1rem", backgroundColor: "hsl(var(--secondary) / 0.3)" }}>
        <span style={{ fontSize: "0.6875rem", fontWeight: 500, color: "hsl(var(--muted-foreground))", display: "block", marginBottom: "0.5rem" }}>
          공개범위
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["team", "group"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVisibility(v)}
              style={{
                flex: 1,
                padding: "0.375rem 0",
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                border: visibility === v ? "1px solid hsl(var(--primary))" : "1px solid transparent",
                backgroundColor: visibility === v ? "hsl(var(--primary) / 0.1)" : "transparent",
                color: visibility === v ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                cursor: "pointer",
              }}
            >
              {v === "team" ? "팀 전체" : "우리 조만"}
            </button>
          ))}
        </div>
      </div>

      {/* 취소 / 등록 버튼 */}
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
        <button
          type="button"
          onClick={onClose}
          className="glass"
          style={{
            flex: 1,
            padding: "0.625rem",
            borderRadius: "9999px",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "hsl(var(--muted-foreground))",
            cursor: "pointer",
          }}
        >
          취소
        </button>
        <button
          type="submit"
          style={{
            flex: 1,
            padding: "0.625rem",
            borderRadius: "9999px",
            fontSize: "0.875rem",
            fontWeight: 600,
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            cursor: "pointer",
            border: "none",
          }}
        >
          등록
        </button>
      </div>
    </form>
  );
}
