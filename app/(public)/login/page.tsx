"use client";

/**
 * app/(public)/login/page.tsx
 *
 * Sign in / create account — and, when already signed in, the account
 * card (sync status, sign out). Accounts stay optional: the copy says
 * plainly that everything works without one, and that signing in
 * *adds* this device's progress to the account rather than replacing it.
 */
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/Form";
import { ApiError } from "@/lib/api-client";
import { AUTH_CHANGED_EVENT, readSession, type AuthSession } from "@/lib/authSession";
import { signIn, signOut, signUp } from "@/services/authService";
import { getLastSyncedAt, syncNow, PROGRESS_SYNCED_EVENT } from "@/services/syncService";
import { formatDate } from "@/lib/formatDate";

type Mode = "signIn" | "signUp";

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status >= 500) return "CamPath's server can't be reached right now. Your progress is still saved on this device.";
    return err.message;
  }
  return "CamPath's server can't be reached right now. Your progress is still saved on this device.";
}

export default function LoginPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null | undefined>(undefined);
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [syncNote, setSyncNote] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setSession(readSession());
      setLastSynced(getLastSyncedAt());
    };
    update();
    window.addEventListener(AUTH_CHANGED_EVENT, update);
    window.addEventListener(PROGRESS_SYNCED_EVENT, update);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, update);
      window.removeEventListener(PROGRESS_SYNCED_EVENT, update);
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const outcome =
        mode === "signIn"
          ? await signIn(email.trim(), password)
          : await signUp(email.trim(), password, displayName.trim());
      if (outcome.status === "failed") {
        // Signed in, but the first sync didn't go through — say so honestly.
        setSyncNote(`Signed in, but syncing failed: ${outcome.message} We'll retry automatically.`);
        return;
      }
      router.push("/my-journey");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
      setPassword("");
    }
  }

  async function handleSyncNow() {
    setSyncNote(null);
    setBusy(true);
    const outcome = await syncNow();
    setBusy(false);
    setSyncNote(
      outcome.status === "synced"
        ? outcome.changedLocally
          ? "Synced — progress from your other devices is now on this one."
          : "Synced — everything is up to date."
        : outcome.status === "failed"
          ? `Sync failed: ${outcome.message}`
          : null
    );
  }

  if (session === undefined) {
    return (
      <main className="max-w-md mx-auto px-6 py-24">
        <p className="text-small text-ink-soft">Loading…</p>
      </main>
    );
  }

  // ------------------------------------------------------ signed in
  if (session) {
    return (
      <main className="max-w-md mx-auto px-6 py-24">
        <p className="text-caption mb-3">Account</p>
        <h1 className="text-h1 mb-6">Hi, {session.user.displayName}.</h1>
        <Card className="mb-6">
          <p className="card-eyebrow mb-1">Signed in as</p>
          <p className="text-body mb-4">{session.user.email}</p>
          <p className="card-eyebrow mb-1">Progress sync</p>
          <p className="text-body">
            {lastSynced ? `Last synced ${formatDate(lastSynced)}` : "Not synced yet on this device."}
          </p>
        </Card>
        {syncNote && (
          <Card className="mb-6">
            <p className="text-body" role="status">{syncNote}</p>
          </Card>
        )}
        <div className="flex flex-wrap gap-3">
          <Link href="/my-journey">
            <Button variant="primary" size="lg">Go to My Journey</Button>
          </Link>
          <Button variant="secondary" size="lg" onClick={handleSyncNow} disabled={busy}>
            {busy ? "Syncing…" : "Sync now"}
          </Button>
          <Button variant="tertiary" size="lg" onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
        <p className="text-small text-ink-soft mt-6">
          Signing out keeps your progress on this device. It stays saved in your account too.
        </p>
      </main>
    );
  }

  // ----------------------------------------------------- signed out
  return (
    <main className="max-w-md mx-auto px-6 py-24">
      <p className="text-caption mb-3">{mode === "signIn" ? "Sign in" : "Create account"}</p>
      <h1 className="text-h1 mb-4">{mode === "signIn" ? "Welcome back." : "Save your progress."}</h1>
      <p className="text-body text-ink-soft mb-8">
        An account is optional. It backs up your Placement Test result and progress and keeps them in
        sync across your devices. Anything you&apos;ve already done on this device is added to your account.
      </p>

      <div className="flex gap-2 mb-6" role="tablist" aria-label="Sign in or create account">
        {(["signIn", "signUp"] as const).map((m) => (
          <Button
            key={m}
            role="tab"
            aria-selected={mode === m}
            variant={mode === m ? "primary" : "secondary"}
            size="sm"
            onClick={() => {
              setMode(m);
              setError(null);
            }}
          >
            {m === "signIn" ? "Sign in" : "Create account"}
          </Button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {mode === "signUp" && (
          <TextField
            label="Name"
            autoComplete="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={60}
            required
          />
        )}
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          autoComplete={mode === "signIn" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={mode === "signUp" ? 8 : undefined}
          required
        />
        {mode === "signUp" && <p className="text-caption mb-4">At least 8 characters.</p>}

        {error && (
          <Card className="mb-4">
            <p className="text-body" role="alert">{error}</p>
          </Card>
        )}
        {syncNote && (
          <Card className="mb-4">
            <p className="text-body" role="status">{syncNote}</p>
          </Card>
        )}

        <Button type="submit" variant="primary" size="lg" disabled={busy}>
          {busy ? "Please wait…" : mode === "signIn" ? "Sign in" : "Create account"}
        </Button>
      </form>
    </main>
  );
}
