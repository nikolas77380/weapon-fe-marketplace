import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const COUNTRIES = [
  { name: "Afghanistan", iso2: "AF" },
  { name: "Albania", iso2: "AL" },
  { name: "Algeria", iso2: "DZ" },
  { name: "Andorra", iso2: "AD" },
  { name: "Angola", iso2: "AO" },
  { name: "Antigua and Barbuda", iso2: "AG" },
  { name: "Argentina", iso2: "AR" },
  { name: "Armenia", iso2: "AM" },
  { name: "Australia", iso2: "AU" },
  { name: "Austria", iso2: "AT" },
  { name: "Azerbaijan", iso2: "AZ" },
  { name: "Bahamas", iso2: "BS" },
  { name: "Bahrain", iso2: "BH" },
  { name: "Bangladesh", iso2: "BD" },
  { name: "Barbados", iso2: "BB" },
  { name: "Belarus", iso2: "BY" },
  { name: "Belgium", iso2: "BE" },
  { name: "Belize", iso2: "BZ" },
  { name: "Benin", iso2: "BJ" },
  { name: "Bhutan", iso2: "BT" },
  { name: "Bolivia", iso2: "BO" },
  { name: "Bosnia and Herzegovina", iso2: "BA" },
  { name: "Botswana", iso2: "BW" },
  { name: "Brazil", iso2: "BR" },
  { name: "Brunei", iso2: "BN" },
  { name: "Bulgaria", iso2: "BG" },
  { name: "Burkina Faso", iso2: "BF" },
  { name: "Burundi", iso2: "BI" },
  { name: "Cambodia", iso2: "KH" },
  { name: "Cameroon", iso2: "CM" },
  { name: "Canada", iso2: "CA" },
  { name: "Cape Verde", iso2: "CV" },
  { name: "Central African Republic", iso2: "CF" },
  { name: "Chad", iso2: "TD" },
  { name: "Chile", iso2: "CL" },
  { name: "China", iso2: "CN" },
  { name: "Colombia", iso2: "CO" },
  { name: "Comoros", iso2: "KM" },
  { name: "Congo", iso2: "CG" },
  { name: "Costa Rica", iso2: "CR" },
  { name: "Croatia", iso2: "HR" },
  { name: "Cuba", iso2: "CU" },
  { name: "Cyprus", iso2: "CY" },
  { name: "Czech Republic", iso2: "CZ" },
  { name: "Democratic Republic of the Congo", iso2: "CD" },
  { name: "Denmark", iso2: "DK" },
  { name: "Djibouti", iso2: "DJ" },
  { name: "Dominica", iso2: "DM" },
  { name: "Dominican Republic", iso2: "DO" },
  { name: "East Timor", iso2: "TL" },
  { name: "Ecuador", iso2: "EC" },
  { name: "Egypt", iso2: "EG" },
  { name: "El Salvador", iso2: "SV" },
  { name: "Equatorial Guinea", iso2: "GQ" },
  { name: "Eritrea", iso2: "ER" },
  { name: "Estonia", iso2: "EE" },
  { name: "Eswatini", iso2: "SZ" },
  { name: "Ethiopia", iso2: "ET" },
  { name: "Fiji", iso2: "FJ" },
  { name: "Finland", iso2: "FI" },
  { name: "France", iso2: "FR" },
  { name: "Gabon", iso2: "GA" },
  { name: "Gambia", iso2: "GM" },
  { name: "Georgia", iso2: "GE" },
  { name: "Germany", iso2: "DE" },
  { name: "Ghana", iso2: "GH" },
  { name: "Greece", iso2: "GR" },
  { name: "Grenada", iso2: "GD" },
  { name: "Guatemala", iso2: "GT" },
  { name: "Guinea", iso2: "GN" },
  { name: "Guinea-Bissau", iso2: "GW" },
  { name: "Guyana", iso2: "GY" },
  { name: "Haiti", iso2: "HT" },
  { name: "Honduras", iso2: "HN" },
  { name: "Hungary", iso2: "HU" },
  { name: "Iceland", iso2: "IS" },
  { name: "India", iso2: "IN" },
  { name: "Indonesia", iso2: "ID" },
  { name: "Iran", iso2: "IR" },
  { name: "Iraq", iso2: "IQ" },
  { name: "Ireland", iso2: "IE" },
  { name: "Israel", iso2: "IL" },
  { name: "Italy", iso2: "IT" },
  { name: "Ivory Coast", iso2: "CI" },
  { name: "Jamaica", iso2: "JM" },
  { name: "Japan", iso2: "JP" },
  { name: "Jordan", iso2: "JO" },
  { name: "Kazakhstan", iso2: "KZ" },
  { name: "Kenya", iso2: "KE" },
  { name: "Kiribati", iso2: "KI" },
  { name: "Kuwait", iso2: "KW" },
  { name: "Kyrgyzstan", iso2: "KG" },
  { name: "Laos", iso2: "LA" },
  { name: "Latvia", iso2: "LV" },
  { name: "Lebanon", iso2: "LB" },
  { name: "Lesotho", iso2: "LS" },
  { name: "Liberia", iso2: "LR" },
  { name: "Libya", iso2: "LY" },
  { name: "Liechtenstein", iso2: "LI" },
  { name: "Lithuania", iso2: "LT" },
  { name: "Luxembourg", iso2: "LU" },
  { name: "Madagascar", iso2: "MG" },
  { name: "Malawi", iso2: "MW" },
  { name: "Malaysia", iso2: "MY" },
  { name: "Maldives", iso2: "MV" },
  { name: "Mali", iso2: "ML" },
  { name: "Malta", iso2: "MT" },
  { name: "Marshall Islands", iso2: "MH" },
  { name: "Mauritania", iso2: "MR" },
  { name: "Mauritius", iso2: "MU" },
  { name: "Mexico", iso2: "MX" },
  { name: "Micronesia", iso2: "FM" },
  { name: "Moldova", iso2: "MD" },
  { name: "Monaco", iso2: "MC" },
  { name: "Mongolia", iso2: "MN" },
  { name: "Montenegro", iso2: "ME" },
  { name: "Morocco", iso2: "MA" },
  { name: "Mozambique", iso2: "MZ" },
  { name: "Myanmar", iso2: "MM" },
  { name: "Namibia", iso2: "NA" },
  { name: "Nauru", iso2: "NR" },
  { name: "Nepal", iso2: "NP" },
  { name: "Netherlands", iso2: "NL" },
  { name: "New Zealand", iso2: "NZ" },
  { name: "Nicaragua", iso2: "NI" },
  { name: "Niger", iso2: "NE" },
  { name: "Nigeria", iso2: "NG" },
  { name: "North Korea", iso2: "KP" },
  { name: "North Macedonia", iso2: "MK" },
  { name: "Norway", iso2: "NO" },
  { name: "Oman", iso2: "OM" },
  { name: "Pakistan", iso2: "PK" },
  { name: "Palau", iso2: "PW" },
  { name: "Panama", iso2: "PA" },
  { name: "Papua New Guinea", iso2: "PG" },
  { name: "Paraguay", iso2: "PY" },
  { name: "Peru", iso2: "PE" },
  { name: "Philippines", iso2: "PH" },
  { name: "Poland", iso2: "PL" },
  { name: "Portugal", iso2: "PT" },
  { name: "Qatar", iso2: "QA" },
  { name: "Romania", iso2: "RO" },
  { name: "Rwanda", iso2: "RW" },
  { name: "Saint Kitts and Nevis", iso2: "KN" },
  { name: "Saint Lucia", iso2: "LC" },
  { name: "Saint Vincent and the Grenadines", iso2: "VC" },
  { name: "Samoa", iso2: "WS" },
  { name: "San Marino", iso2: "SM" },
  { name: "Sao Tome and Principe", iso2: "ST" },
  { name: "Saudi Arabia", iso2: "SA" },
  { name: "Senegal", iso2: "SN" },
  { name: "Serbia", iso2: "RS" },
  { name: "Seychelles", iso2: "SC" },
  { name: "Sierra Leone", iso2: "SL" },
  { name: "Singapore", iso2: "SG" },
  { name: "Slovakia", iso2: "SK" },
  { name: "Slovenia", iso2: "SI" },
  { name: "Solomon Islands", iso2: "SB" },
  { name: "Somalia", iso2: "SO" },
  { name: "South Africa", iso2: "ZA" },
  { name: "South Korea", iso2: "KR" },
  { name: "South Sudan", iso2: "SS" },
  { name: "Spain", iso2: "ES" },
  { name: "Sri Lanka", iso2: "LK" },
  { name: "Sudan", iso2: "SD" },
  { name: "Suriname", iso2: "SR" },
  { name: "Sweden", iso2: "SE" },
  { name: "Switzerland", iso2: "CH" },
  { name: "Syria", iso2: "SY" },
  { name: "Taiwan", iso2: "TW" },
  { name: "Tajikistan", iso2: "TJ" },
  { name: "Tanzania", iso2: "TZ" },
  { name: "Thailand", iso2: "TH" },
  { name: "Togo", iso2: "TG" },
  { name: "Tonga", iso2: "TO" },
  { name: "Trinidad and Tobago", iso2: "TT" },
  { name: "Tunisia", iso2: "TN" },
  { name: "Turkey", iso2: "TR" },
  { name: "Turkmenistan", iso2: "TM" },
  { name: "Tuvalu", iso2: "TV" },
  { name: "Uganda", iso2: "UG" },
  { name: "Ukraine", iso2: "UA" },
  { name: "United Arab Emirates", iso2: "AE" },
  { name: "United Kingdom", iso2: "GB" },
  { name: "United States", iso2: "US" },
  { name: "Uruguay", iso2: "UY" },
  { name: "Uzbekistan", iso2: "UZ" },
  { name: "Vanuatu", iso2: "VU" },
  { name: "Vatican City", iso2: "VA" },
  { name: "Venezuela", iso2: "VE" },
  { name: "Vietnam", iso2: "VN" },
  { name: "Yemen", iso2: "YE" },
  { name: "Zambia", iso2: "ZM" },
  { name: "Zimbabwe", iso2: "ZW" },
];

export const SELLER_TYPES = [
  {
    key: "oem-manufacturer",
    label: "OEM Manufacturer",
    category: "Primary Producers",
    description:
      "Designs and produces complete weapons/systems under its own brand.",
  },
  {
    key: "component-subsystem-manufacturer",
    label: "Component/Sub-system Manufacturer",
    category: "Primary Producers",
    description:
      "Produces parts and modules (barrels, optics, triggers, UAV parts, armor plates).",
  },
  {
    key: "ammunition-manufacturer",
    label: "Ammunition Manufacturer",
    category: "Primary Producers",
    description:
      "Manufactures small-arms ammo and/or mortar/artillery rounds (where legal).",
  },

  // Import/Export & Distribution
  {
    key: "licensed-importer",
    label: "Licensed Importer",
    category: "Import/Export & Distribution",
    description:
      "Imports regulated products into a country under export/import controls.",
  },
  {
    key: "authorized-distributor",
    label: "Authorized Distributor",
    category: "Import/Export & Distribution",
    description:
      "Holds territory/segment rights from OEMs to distribute products.",
  },
  {
    key: "wholesaler",
    label: "Wholesaler",
    category: "Import/Export & Distribution",
    description: "Buys in bulk and resells to dealers/retailers.",
  },

  // Retail & Dealers
  {
    key: "licensed-retailer",
    label: "Licensed Retailer (Brick-and-Mortar)",
    category: "Retail & Dealers",
    description:
      "Physical storefront selling to end users under local licensing.",
  },
  {
    key: "online-retailer",
    label: "Online Retailer (Licensed)",
    category: "Retail & Dealers",
    description:
      "E-commerce dealer operating with required licenses and compliance.",
  },
  {
    key: "specialty-dealer",
    label: "Specialty Dealer",
    category: "Retail & Dealers",
    description:
      "Focuses on a niche (tactical, hunting, precision shooting, UAVs, etc.).",
  },
  {
    key: "consignment-dealer",
    label: "Consignment Dealer",
    category: "Retail & Dealers",
    description: "Sells items on behalf of owners and takes a commission.",
  },

  // Intermediaries
  {
    key: "broker-agent",
    label: "Broker/Agent",
    category: "Intermediaries",
    description:
      "Facilitates B2B/B2G deals without owning stock; commission-based.",
  },
  {
    key: "system-integrator",
    label: "System Integrator",
    category: "Intermediaries",
    description:
      "Builds multi-vendor solutions (e.g., drone + optics + comms).",
  },

  // Secondary Market
  {
    key: "certified-pre-owned-dealer",
    label: "Certified Pre-Owned Dealer",
    category: "Secondary Market",
    description:
      "Sells inspected/verified used items with documented provenance.",
  },
  {
    key: "licensed-auction-house",
    label: "Auction House (Licensed)",
    category: "Secondary Market",
    description: "Runs live/online auctions under regulatory compliance.",
  },
  {
    key: "gov-military-surplus",
    label: "Government/Military Surplus Seller",
    category: "Secondary Market",
    description: "Disposes of decommissioned stock per demilitarization rules.",
  },

  // Services & Support
  {
    key: "gunsmith-armorer",
    label: "Gunsmith/Armorer",
    category: "Services & Support",
    description:
      "Builds, repairs, and modifies firearms; may sell parts/accessories.",
  },
  {
    key: "mro-refurbishment",
    label: "MRO/Refurbishment Provider",
    category: "Services & Support",
    description: "Maintenance, repair, overhaul, and upgrades for systems.",
  },
  {
    key: "training-range-provider",
    label: "Training/Ranges Provider",
    category: "Services & Support",
    description: "Operates ranges/training and may sell limited gear.",
  },

  // Special Categories (jurisdiction-dependent)
  {
    key: "licensed-collector-private-seller",
    label: "Collector/Private Seller (Licensed)",
    category: "Special Categories",
    description: "Peer-to-peer sales where permitted and licensed.",
  },
  {
    key: "demil-disposal-vendor",
    label: "Demilitarization/Disposal Vendor",
    category: "Special Categories",
    description: "Performs compliant demilitarization and disposal services.",
  },
] as const;

// Role utilities
export const isSeller = (user: any): boolean => {
  return user?.role?.name === "seller";
};

export const isBuyer = (user: any): boolean => {
  return user?.role?.name === "buyer";
};

export const getUserRole = (user: any): string | null => {
  return user?.role?.name || null;
};

export const hasRole = (user: any, role: string): boolean => {
  return user?.role?.name === role;
};
