import RegisterForm from "./components/register-form";

export default function RegisterPage() {
    return (
        <main className="flex flex-col h-screen items-center justify-center gap-10">
            <h1 className="text-2xl font-bold">Register New Client</h1>
            <RegisterForm />
        </main>
    );
}
