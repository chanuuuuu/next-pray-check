import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./RequestRegistForm.module.css";
import useRequestForm from "@/app/hooks/useRequestForm";

interface RequestRegistFormProps {
  insertId: number;
  onClose?: () => void;
}

// 기도제목 입력 폼
export function RequestRegistForm({
  insertId,
  onClose,
}: RequestRegistFormProps) {
  const router = useRouter();
  const { state, formAction, inputs, keys, handleAppend, handleDelete } =
    useRequestForm(insertId);

  useEffect(() => {
    if (state.success) {
      alert("기도제목 등록을 완료하였습니다.");
      router.refresh();
      if (onClose) onClose();
    }
  }, [state, onClose, router]);

  return (
    <form action={formAction} className={styles.container}>
      <div className={styles.urgentSection} style={{ display: "none" }}>
        <label htmlFor="isUrgent" className={styles.urgentLabel}>
          🚨 긴급
        </label>
        <input
          type="checkbox"
          name="isUrgent"
          id="isUrgent"
          defaultChecked={state.isUrgent}
          className={styles.checkbox}
        />
      </div>

      {inputs.map(({ text, error }, index) => (
        <div key={`section_${keys[index]}`} className={styles.inputSection}>
          <div className={styles.textareaWrapper}>
            <textarea
              key={keys[index]}
              placeholder="기도제목을 입력하세요"
              autoComplete="off"
              name="text"
              defaultValue={text || ""}
              className={styles.textarea}
            />
            <button
              type="button"
              onClick={() => handleDelete(index)}
              className={styles.deleteBtn}
              disabled={inputs.length <= 1}
              title="삭제"
            >
              ✕
            </button>
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      ))}

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={() => handleAppend()}
          className={styles.addBtn}
          disabled={inputs.length >= 3}
        >
          추가
        </button>
        <button type="submit" className={styles.submitButton}>
          등록하기
        </button>
      </div>
    </form>
  );
}
