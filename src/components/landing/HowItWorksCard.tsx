import { getIcon, IconName } from "@/lib/iconUtils";

interface HowItWorksCardProps {
  id: number;
  title: string;
  description: string;
  iconName: IconName;
}

const HowItWorksCard = ({
  id,
  title,
  description,
  iconName,
}: HowItWorksCardProps) => {
  return (
    <div className="relative flex flex-col w-full">
      <div className="absolute top-0 right-0 text-[150px] font-bold bg-gradient-to-b from-gold-main via-[#e4c6ba]/50 to-transparent bg-clip-text text-transparent select-none pointer-events-none z-0 leading-none">
        {id}
      </div>
      <div className="size-10 flex items-center justify-center">
        {getIcon(iconName)}
      </div>
      <h1 className="relative z-10 mt-5 font-bold text-2xl bg-gradient-to-b from-[#c29e8a] to-gray-secondary bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="font-light mt-5">{description}</p>
    </div>
  );
};

export default HowItWorksCard;
