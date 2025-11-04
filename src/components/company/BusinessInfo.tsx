import { UserProfile } from "@/lib/types"

interface BusinessInfoProps {
  sellerData: UserProfile
}

const BusinessInfo = ({ sellerData }: BusinessInfoProps) => {
  return (
    <div className='mt-4'>
      <div>
        {sellerData?.metadata?.businessId &&(
          <p className="flex items-center gap-2">
            <span className="font-bold">Business ID:</span>
            <span className="text-gray-700 font-light">{sellerData?.metadata?.businessId}</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default BusinessInfo
