import { CarouselSize } from "@/components/ScrollCard";

export default function Home() {
  return (
    <main className=" w-full h-[86vh] container flex  flex-col items-center justify-center  ">
      <section className="text-center ">
        <p className="text-5xl font-bold ">
          Unveil the Truth with SecretSender
        </p>
        <p className="text-xl  mt-4 leading-10 ">
          Your Gateway to Anonymous Feedback
        </p>
      </section>
      <CarouselSize />
    </main>
  );
}
