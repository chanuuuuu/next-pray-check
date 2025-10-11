import { useActionState, useState, useEffect } from "react";
import {
  actionRequest,
  RequestState,
  RequestInput,
} from "@/app/action/requestAction";
import { removeAtIndex } from "@/app/utils/clientUtils";

// 기도제목 입력 폼
export function RequestRegistForm({ insertId }: { insertId: number }) {
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
    }
  }, [state]);

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
    <form action={formAction}>
      <section>
        <label>긴급</label>
        <input
          type="checkbox"
          name="isUrgent"
          defaultChecked={state.isUrgent}
        />
      </section>
      {inputs.map(({ text, error }, index) => (
        <section key={`section_${keys[index]}`}>
          <textarea
            style={{ width: "80%", resize: "none" }}
            key={keys[index]}
            placeholder="기도제목을 입력하세요"
            autoComplete="off"
            cols={2}
            name="text"
            defaultValue={text || ""}
          />
          <button type="button" onClick={() => handleDelete(index)}>
            삭제
          </button>
          {error && <p>{error}</p>}
        </section>
      ))}
      <button type="button" onClick={() => handleAppend()}>
        추가
      </button>
      <button type="submit">제출</button>
    </form>
  );
}
