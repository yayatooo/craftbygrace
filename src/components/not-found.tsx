import { Link } from "@tanstack/react-router";

export function NotFoundComponent() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">Page not found.</p>
      <div className="py-8">
        <img src="/donut-cat.png" alt="my-daughter" className="w-80" />
      </div>
      <Link to="/" className="px-4 py-2 text-primary-foreground">
        Back Home !
      </Link>
    </main>
  );
}
