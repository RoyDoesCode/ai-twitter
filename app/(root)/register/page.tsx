import RegisterForm from "./components/register-form";

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center pt-14 px-4">
            <div className="w-full max-w-[640px] space-y-2 text-center mb-2">
                <h1 className="text-2xl font-bold">Register a new client</h1>
                <p className="text-sm text-muted-foreground">
                    Set up a Twitter account to post AI-generated tweets on a schedule.
                </p>
            </div>
            <RegisterForm />
        </main>
    );
}
