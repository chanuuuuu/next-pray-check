"use client";

import { Request } from "@/types/request.type";
import { useMemo, useState } from "react";
import { RequestRegistForm } from "./RequestRegistForm";
import { RequestGrid } from "./RequestGrid";
import { Modal } from "../Modal";
import styles from "./RequestClient.module.css";
import { RequestContextProvider } from "./RequestContext";

interface RequestClientProps {
  requests: Request[];
  userId: number;
}

export function RequestClientInner({ requests, userId }: RequestClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  const insertId = useMemo(
    () =>
      requests.reduce((cur, request) => {
        if (request.userId === userId) {
          return cur <= request.insertId ? request.insertId + 1 : cur;
        }
        return cur;
      }, 0),
    [requests, userId]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => setIsOpen(true)} className={styles.registerBtn}>
          등록
        </button>
      </div>
      <RequestGrid requests={requests} />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="기도제목 등록"
      >
        <RequestRegistForm
          insertId={insertId}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </div>
  );
}

// Provider를 제공하는 외부 컴포넌트
export function RequestClient({ requests, userId }: RequestClientProps) {
  return (
    <RequestContextProvider userId={userId}>
      <RequestClientInner requests={requests} userId={userId} />
    </RequestContextProvider>
  );
}
