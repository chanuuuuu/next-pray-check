import LoginForm from "../component/LoginForm";
import styles from "../page.module.css";
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ errorCode: string }>;
}) {
  const { errorCode } = await searchParams;
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <LoginForm errorCode={errorCode} />
      </main>
    </div>
  );
}
