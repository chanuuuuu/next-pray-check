import styles from "./page.module.css";

export default function Home() {
  // 최초 진입시 세션 체크 및 로그인 확인

  return (
    <div className={styles.page}>
      <main className={styles.main}></main>
    </div>
  );
}
