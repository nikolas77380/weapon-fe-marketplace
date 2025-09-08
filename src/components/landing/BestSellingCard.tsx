import Image from "next/image";
import { Button } from "../ui/button";

interface BestSellingCardProps {
  id: number;
  title: string;
  image: string;
}

const BestSellingCard = ({ title, image }: BestSellingCardProps) => {
  return (
    <div className="border border-black rounded-2xl pb-8.5 bg-white">
      <div className="h-[330px] rounded-t-2xl overflow-hidden border-b border-black">
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="object-cover rounded-t-2xl overflow-hidden"
        />
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <h1 className="mt-7.5 font-bold text-3xl text-center max-w-[280px] w-full min-h-[76px]">
          {title}
        </h1>
        <Button
          className="mt-7.5 h-17 w-53 bg-gray-primary font-bold text-2xl text-black 
        hover:bg-gray-primary/80 cursor-pointer"
        >
          Contact seller
        </Button>
      </div>
    </div>
  );
};

export default BestSellingCard;
