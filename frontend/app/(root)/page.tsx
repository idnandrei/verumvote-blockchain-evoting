import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  console.log(process.env.NEXT_PUBLIC_FILEBASE_KEY);
  return (
    <>
      <section className="w-full flex flex-col items-center justify-center">
        <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold text-white my-10">
          <span className="text-blue-500">Verum</span>Vote
        </h1>
        <div className="w-full flex items-center justify-evenly my-10">
          <Button className="text-base sm:text-lg md:text-xl px-10 sm:px-16 sm:py-8 font-medium">
            Organization
          </Button>
          <Button className="text-base sm:text-lg md:text-xl px-10 sm:px-16 sm:py-8 font-medium">
            Voter
          </Button>
        </div>
      </section>
    </>
  );
}
