import { useState, useActionState, useEffect } from "react";
import {
  actionRequest,
  RequestState,
  RequestInput,
} from "@/app/action/requestAction";
import { removeAtIndex } from "@/app/utils/clientUtils";

export default function useRequestForm(insertId: number) {
  const [state, formAction] = useActionState(actionRequest, {
    requestInputs: [{ text: "" }],
    insertId,
  } as RequestState);

  const [inputs, setInputs] = useState<RequestInput[]>([{ text: "" }]);
  const [keys, setKeys] = useState<number[]>([Date.now()]);

  useEffect(() => {
    handleFocus();
  }, []);

  useEffect(() => {
    setInputs(state.requestInputs);
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

  return {
    state,
    formAction,
    inputs,
    keys,
    handleDelete,
    handleAppend,
  };
}
