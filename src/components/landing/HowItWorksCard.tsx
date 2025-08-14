interface HowItWorksCardProps {
  id: number;
  title: string;
  description: string;
}

const HowItWorksCard = ({ id, title, description }: HowItWorksCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[255px]">
      <div className="rounded-full items-center justify-center flex bg-black size-16">
        <span className="text-white font-bold text-2xl">{id}</span>
      </div>
      <h1 className="mt-5.5 font-bold text-2xl">
        {title}
      </h1>
      <p className="mt-5.5 font-roboto text-xl text-center">
        {description}
      </p>
    </div>
  )
}

export default HowItWorksCard
