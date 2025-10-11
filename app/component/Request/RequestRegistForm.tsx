import { useActionState, useState, useEffect } from "react";
import {
  actionRequest,
  RequestState,
  RequestInput,
} from "@/app/action/requestAction";
import { useRouter } from "next/navigation";
import { removeAtIndex } from "@/app/utils/clientUtils";
import styles from "./RequestRegistForm.module.css";

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
  const [state, formAction] = useActionState(actionRequest, {
    requestInputs: [{ text: "" }],
    insertId,
  } as RequestState);

  const [inputs, setInputs] = useState<RequestInput[]>([{ text: "" }]);
  const [keys, setKeys] = useState<number[]>([Date.now()]);

  useEffect(() => {
    setInputs(state.requestInputs);
  }, [state]);

  useEffect(() => {
    if (state.success) {
      alert("기도제목 등록을 완료하였습니다.");
      router.refresh();
      if (onClose) onClose();
    }
  }, [state, onClose, router]);

  function handleDelete(index: number) {
    if (inputs.length <= 1) return; // 최소 하나의 입력은 유지
    setInputs(removeAtIndex([...inputs], index));
    setKeys(removeAtIndex([...keys], index));
    handleFocus();
  }

  function handleAppend() {
    if (inputs.length >= 3) return;
    setInputs([...inputs, { text: "" }]);
    setKeys([...keys, Date.now()]);
    handleFocus();
  }

  function handleFocus() {
    setTimeout(() => {
      const newInput = document.querySelectorAll(`textarea[name="text"]`);
      if (newInput) {
        (newInput[newInput.length - 1] as HTMLInputElement).focus();
      }
    });
  }

  return (
    <form action={formAction} className={styles.container}>
      <div className={styles.urgentSection}>
        <label htmlFor="isUrgent" className={styles.urgentLabel}>
          🚨
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
