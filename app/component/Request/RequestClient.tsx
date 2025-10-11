"use client";

import { Request } from "@/types/request.type";
import { useMemo, useState } from "react";
import { RequestRegistForm } from "./RequestRegistForm";
import { RequestGrid } from "./RequestGrid";
import { Modal } from "../Modal";
interface RequestClientProps {
  requests: Request[];
  userId: number;
}
export function RequestClient({ requests, userId }: RequestClientProps) {
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
    <div>
      <button onClick={() => setIsOpen(true)}>등록</button>
      <RequestGrid requests={requests} />
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="기도제목 등록"
      >
        <RequestRegistForm insertId={insertId} />
      </Modal>
    </div>
  );
}
