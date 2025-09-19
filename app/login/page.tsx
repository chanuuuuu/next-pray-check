import LoginForm from "../component/LoginForm";
import styles from "../page.module.css";
export default async function LoginPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <LoginForm />
      </main>
    </div>
  );
}
