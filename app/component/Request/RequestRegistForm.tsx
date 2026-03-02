import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./RequestRegistForm.module.css";
import useRequestForm from "@/app/hooks/useRequestForm";
import { Button } from "@/app/component/ui/button";
import { Textarea } from "@/app/component/ui/textarea";

type RequestRegistFormProps = {
  insertId: number;
  onClose?: () => void;
};

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
          긴급
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
            <Textarea
              key={keys[index]}
              placeholder="기도제목을 입력하세요"
              autoComplete="off"
              name="text"
              defaultValue={text || ""}
              className={styles.textarea}
            />
            <Button
              type="button"
              onClick={() => handleDelete(index)}
              variant="ghost"
              size="icon"
              disabled={inputs.length <= 1}
              title="삭제"
              className={styles.deleteBtn}
            >
              ✕
            </Button>
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      ))}

      <div className={styles.buttonGroup}>
        <Button
          type="button"
          onClick={() => handleAppend()}
          variant="outline"
          disabled={inputs.length >= 3}
          className="w-full"
        >
          추가
        </Button>
        <Button type="submit" variant="default" className="w-full">
          등록하기
        </Button>
      </div>
    </form>
  );
}
