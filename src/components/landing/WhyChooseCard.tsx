import Image from "next/image";

interface WhyChooseCardProps {
  icon: string;
  title: string;
  description: string;
}

const WhyChooseCard = ({ icon, title, description }: WhyChooseCardProps) => {
  return (
    <div className="border border-black rounded-2xl px-5 pt-10 pb-16">
      <div className="flex items-center justify-center gap-15">
        <Image src={icon} alt="icon" width={50} height={50} />
        <h1 className="max-w-[150px] w-full font-roboto text-xl text-center font-semibold">
          {title}
        </h1>
      </div>
      <p className="mt-12 font-light text-[32px] text-center">{description}</p>
    </div>
  );
};

export default WhyChooseCard;
