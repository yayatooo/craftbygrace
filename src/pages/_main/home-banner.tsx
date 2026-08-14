import { CardProfile } from "./components/card-profile";

export const Banner = () => {
  return (
    <div className="text-sm leading-6 sm:text-base sm:leading-7">
      <CardProfile />
      <section>
        <p className="py-4">
          Hi, I'm a Fullstack Engineer currently in{" "}
          <span className="font-semibold text-accent">Jakarta, Indonesia</span>,
          deep in the TypeScript thoughtful architecture, and clean, maintainable code. turn ideas into clean,
          performant, and user first solutions. really love Coffee and Huh
          Yunjin
        </p>
      </section>
    </div>
  );
};
