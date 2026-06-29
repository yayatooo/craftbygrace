import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";

export const CardProfile = () => {
  return (
    <section className="py-4 flex items-center gap-2">
      <Avatar size="xl">
        <AvatarImage src="/avatar.jpg" alt="profile-picture" />
        <AvatarFallback>YT</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold sm:text-2xl">Rahmat Hidayat</h1>
          <img src="./verified.png" alt="logo" className="w-5 h-5 mt-1" />
        </div>
        <p className="text-sm">Full Stack Engineer</p>
      </div>
    </section>
  );
};
