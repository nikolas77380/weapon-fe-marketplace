import { getIcon, IconName } from "@/lib/iconUtils";

interface WhyChooseCardProps {
  icon: IconName;
  title: string;
  description: string;
}

const WhyChooseCard = ({ icon, title, description }: WhyChooseCardProps) => {
  return (
    <div className="p-7.5 border border-border-foreground bg-[#e4c6ba]/50 w-full flex flex-col">
      <div className="flex items-center gap-3.5">
        <div className="size-10 flex items-center justify-center">
          {getIcon(icon)}
        </div>
        <h1 className="text-2xl font-medium bg-gradient-to-b from-gold-main to-gray-secondary bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
      <p className="mt-6 font-light">{description}</p>
    </div>
  );
};

export default WhyChooseCard;
