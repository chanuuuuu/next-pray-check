"use client";
import LoginForm from "./LoginForm";
import styles from "./LoginClient.module.css";

export default function LoginClient() {
  return (
    <div className={`bg-app-gradient ${styles.wrapper}`}>
      <LoginForm />
    </div>
  );
}
