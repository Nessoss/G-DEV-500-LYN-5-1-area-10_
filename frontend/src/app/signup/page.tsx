import { AuthLayout } from "@/components/auth/auth-layout"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Start automating today"
      subtitle="Create your account and connect your first workflow in minutes"
      visualType="register"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
