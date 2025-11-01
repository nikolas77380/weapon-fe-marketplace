import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { UserProfile } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const COUNTRIES = [
  { name: "Afghanistan", iso2: "AF", ua: "Афганістан" },
  { name: "Albania", iso2: "AL", ua: "Албанія" },
  { name: "Algeria", iso2: "DZ", ua: "Алжир" },
  { name: "Andorra", iso2: "AD", ua: "Андорра" },
  { name: "Angola", iso2: "AO", ua: "Ангола" },
  { name: "Antigua and Barbuda", iso2: "AG", ua: "Антигуа і Барбуда" },
  { name: "Argentina", iso2: "AR", ua: "Аргентина" },
  { name: "Armenia", iso2: "AM", ua: "Вірменія" },
  { name: "Australia", iso2: "AU", ua: "Австралія" },
  { name: "Austria", iso2: "AT", ua: "Австрія" },
  { name: "Azerbaijan", iso2: "AZ", ua: "Азербайджан" },
  { name: "Bahamas", iso2: "BS", ua: "Багамські Острови" },
  { name: "Bahrain", iso2: "BH", ua: "Бахрейн" },
  { name: "Bangladesh", iso2: "BD", ua: "Бангладеш" },
  { name: "Barbados", iso2: "BB", ua: "Барбадос" },
  { name: "Belarus", iso2: "BY", ua: "Білорусь" },
  { name: "Belgium", iso2: "BE", ua: "Бельгія" },
  { name: "Belize", iso2: "BZ", ua: "Беліз" },
  { name: "Benin", iso2: "BJ", ua: "Бенін" },
  { name: "Bhutan", iso2: "BT", ua: "Бутан" },
  { name: "Bolivia", iso2: "BO", ua: "Болівія" },
  { name: "Bosnia and Herzegovina", iso2: "BA", ua: "Боснія і Герцеговина" },
  { name: "Botswana", iso2: "BW", ua: "Ботсвана" },
  { name: "Brazil", iso2: "BR", ua: "Бразилія" },
  { name: "Brunei", iso2: "BN", ua: "Бруней" },
  { name: "Bulgaria", iso2: "BG", ua: "Болгарія" },
  { name: "Burkina Faso", iso2: "BF", ua: "Буркіна-Фасо" },
  { name: "Burundi", iso2: "BI", ua: "Бурунді" },
  { name: "Cambodia", iso2: "KH", ua: "Камбоджа" },
  { name: "Cameroon", iso2: "CM", ua: "Камерун" },
  { name: "Canada", iso2: "CA", ua: "Канада" },
  { name: "Cape Verde", iso2: "CV", ua: "Кабо-Верде" },
  {
    name: "Central African Republic",
    iso2: "CF",
    ua: "Центральноафриканська Республіка",
  },
  { name: "Chad", iso2: "TD", ua: "Чад" },
  { name: "Chile", iso2: "CL", ua: "Чилі" },
  { name: "China", iso2: "CN", ua: "Китай" },
  { name: "Colombia", iso2: "CO", ua: "Колумбія" },
  { name: "Comoros", iso2: "KM", ua: "Комори" },
  { name: "Congo", iso2: "CG", ua: "Конго" },
  { name: "Costa Rica", iso2: "CR", ua: "Коста-Рика" },
  { name: "Croatia", iso2: "HR", ua: "Хорватія" },
  { name: "Cuba", iso2: "CU", ua: "Куба" },
  { name: "Cyprus", iso2: "CY", ua: "Кіпр" },
  { name: "Czech Republic", iso2: "CZ", ua: "Чехія" },
  {
    name: "Democratic Republic of the Congo",
    iso2: "CD",
    ua: "Демократична Республіка Конго",
  },
  { name: "Denmark", iso2: "DK", ua: "Данія" },
  { name: "Djibouti", iso2: "DJ", ua: "Джибуті" },
  { name: "Dominica", iso2: "DM", ua: "Домініка" },
  { name: "Dominican Republic", iso2: "DO", ua: "Домініканська Республіка" },
  { name: "East Timor", iso2: "TL", ua: "Східний Тимор" },
  { name: "Ecuador", iso2: "EC", ua: "Еквадор" },
  { name: "Egypt", iso2: "EG", ua: "Єгипет" },
  { name: "El Salvador", iso2: "SV", ua: "Сальвадор" },
  { name: "Equatorial Guinea", iso2: "GQ", ua: "Екваторіальна Гвінея" },
  { name: "Eritrea", iso2: "ER", ua: "Еритрея" },
  { name: "Estonia", iso2: "EE", ua: "Естонія" },
  { name: "Eswatini", iso2: "SZ", ua: "Есватіні" },
  { name: "Ethiopia", iso2: "ET", ua: "Ефіопія" },
  { name: "Fiji", iso2: "FJ", ua: "Фіджі" },
  { name: "Finland", iso2: "FI", ua: "Фінляндія" },
  { name: "France", iso2: "FR", ua: "Франція" },
  { name: "Gabon", iso2: "GA", ua: "Габон" },
  { name: "Gambia", iso2: "GM", ua: "Гамбія" },
  { name: "Georgia", iso2: "GE", ua: "Грузія" },
  { name: "Germany", iso2: "DE", ua: "Німеччина" },
  { name: "Ghana", iso2: "GH", ua: "Гана" },
  { name: "Greece", iso2: "GR", ua: "Греція" },
  { name: "Grenada", iso2: "GD", ua: "Гренада" },
  { name: "Guatemala", iso2: "GT", ua: "Гватемала" },
  { name: "Guinea", iso2: "GN", ua: "Гвінея" },
  { name: "Guinea-Bissau", iso2: "GW", ua: "Гвінея-Бісау" },
  { name: "Guyana", iso2: "GY", ua: "Гаяна" },
  { name: "Haiti", iso2: "HT", ua: "Гаїті" },
  { name: "Honduras", iso2: "HN", ua: "Гондурас" },
  { name: "Hungary", iso2: "HU", ua: "Угорщина" },
  { name: "Iceland", iso2: "IS", ua: "Ісландія" },
  { name: "India", iso2: "IN", ua: "Індія" },
  { name: "Indonesia", iso2: "ID", ua: "Індонезія" },
  { name: "Iran", iso2: "IR", ua: "Іран" },
  { name: "Iraq", iso2: "IQ", ua: "Ірак" },
  { name: "Ireland", iso2: "IE", ua: "Ірландія" },
  { name: "Israel", iso2: "IL", ua: "Ізраїль" },
  { name: "Italy", iso2: "IT", ua: "Італія" },
  { name: "Ivory Coast", iso2: "CI", ua: "Кот-д'Івуар" },
  { name: "Jamaica", iso2: "JM", ua: "Ямайка" },
  { name: "Japan", iso2: "JP", ua: "Японія" },
  { name: "Jordan", iso2: "JO", ua: "Йорданія" },
  { name: "Kazakhstan", iso2: "KZ", ua: "Казахстан" },
  { name: "Kenya", iso2: "KE", ua: "Кенія" },
  { name: "Kiribati", iso2: "KI", ua: "Кірибаті" },
  { name: "Kuwait", iso2: "KW", ua: "Кувейт" },
  { name: "Kyrgyzstan", iso2: "KG", ua: "Киргизстан" },
  { name: "Laos", iso2: "LA", ua: "Лаос" },
  { name: "Latvia", iso2: "LV", ua: "Латвія" },
  { name: "Lebanon", iso2: "LB", ua: "Ліван" },
  { name: "Lesotho", iso2: "LS", ua: "Лесото" },
  { name: "Liberia", iso2: "LR", ua: "Ліберія" },
  { name: "Libya", iso2: "LY", ua: "Лівія" },
  { name: "Liechtenstein", iso2: "LI", ua: "Ліхтенштейн" },
  { name: "Lithuania", iso2: "LT", ua: "Литва" },
  { name: "Luxembourg", iso2: "LU", ua: "Люксембург" },
  { name: "Madagascar", iso2: "MG", ua: "Мадагаскар" },
  { name: "Malawi", iso2: "MW", ua: "Малаві" },
  { name: "Malaysia", iso2: "MY", ua: "Малайзія" },
  { name: "Maldives", iso2: "MV", ua: "Мальдіви" },
  { name: "Mali", iso2: "ML", ua: "Малі" },
  { name: "Malta", iso2: "MT", ua: "Мальта" },
  { name: "Marshall Islands", iso2: "MH", ua: "Маршаллові Острови" },
  { name: "Mauritania", iso2: "MR", ua: "Мавританія" },
  { name: "Mauritius", iso2: "MU", ua: "Маврикій" },
  { name: "Mexico", iso2: "MX", ua: "Мексика" },
  { name: "Micronesia", iso2: "FM", ua: "Мікронезія" },
  { name: "Moldova", iso2: "MD", ua: "Молдова" },
  { name: "Monaco", iso2: "MC", ua: "Монако" },
  { name: "Mongolia", iso2: "MN", ua: "Монголія" },
  { name: "Montenegro", iso2: "ME", ua: "Чорногорія" },
  { name: "Morocco", iso2: "MA", ua: "Марокко" },
  { name: "Mozambique", iso2: "MZ", ua: "Мозамбік" },
  { name: "Myanmar", iso2: "MM", ua: "М'янма" },
  { name: "Namibia", iso2: "NA", ua: "Намібія" },
  { name: "Nauru", iso2: "NR", ua: "Науру" },
  { name: "Nepal", iso2: "NP", ua: "Непал" },
  { name: "Netherlands", iso2: "NL", ua: "Нідерланди" },
  { name: "New Zealand", iso2: "NZ", ua: "Нова Зеландія" },
  { name: "Nicaragua", iso2: "NI", ua: "Нікарагуа" },
  { name: "Niger", iso2: "NE", ua: "Нігер" },
  { name: "Nigeria", iso2: "NG", ua: "Нігерія" },
  { name: "North Korea", iso2: "KP", ua: "Північна Корея" },
  { name: "North Macedonia", iso2: "MK", ua: "Північна Македонія" },
  { name: "Norway", iso2: "NO", ua: "Норвегія" },
  { name: "Oman", iso2: "OM", ua: "Оман" },
  { name: "Pakistan", iso2: "PK", ua: "Пакистан" },
  { name: "Palau", iso2: "PW", ua: "Палау" },
  { name: "Panama", iso2: "PA", ua: "Панама" },
  { name: "Papua New Guinea", iso2: "PG", ua: "Папуа-Нова Гвінея" },
  { name: "Paraguay", iso2: "PY", ua: "Парагвай" },
  { name: "Peru", iso2: "PE", ua: "Перу" },
  { name: "Philippines", iso2: "PH", ua: "Філіппіни" },
  { name: "Poland", iso2: "PL", ua: "Польща" },
  { name: "Portugal", iso2: "PT", ua: "Португалія" },
  { name: "Qatar", iso2: "QA", ua: "Катар" },
  { name: "Romania", iso2: "RO", ua: "Румунія" },
  { name: "Rwanda", iso2: "RW", ua: "Руанда" },
  { name: "Saint Kitts and Nevis", iso2: "KN", ua: "Сент-Кітс і Невіс" },
  { name: "Saint Lucia", iso2: "LC", ua: "Сент-Люсія" },
  {
    name: "Saint Vincent and the Grenadines",
    iso2: "VC",
    ua: "Сент-Вінсент і Гренадини",
  },
  { name: "Samoa", iso2: "WS", ua: "Самоа" },
  { name: "San Marino", iso2: "SM", ua: "Сан-Марино" },
  { name: "Sao Tome and Principe", iso2: "ST", ua: "Сан-Томе і Принсіпі" },
  { name: "Saudi Arabia", iso2: "SA", ua: "Саудівська Аравія" },
  { name: "Senegal", iso2: "SN", ua: "Сенегал" },
  { name: "Serbia", iso2: "RS", ua: "Сербія" },
  { name: "Seychelles", iso2: "SC", ua: "Сейшели" },
  { name: "Sierra Leone", iso2: "SL", ua: "Сьєрра-Леоне" },
  { name: "Singapore", iso2: "SG", ua: "Сінгапур" },
  { name: "Slovakia", iso2: "SK", ua: "Словаччина" },
  { name: "Slovenia", iso2: "SI", ua: "Словенія" },
  { name: "Solomon Islands", iso2: "SB", ua: "Соломонові Острови" },
  { name: "Somalia", iso2: "SO", ua: "Сомалі" },
  { name: "South Africa", iso2: "ZA", ua: "Південна Африка" },
  { name: "South Korea", iso2: "KR", ua: "Південна Корея" },
  { name: "South Sudan", iso2: "SS", ua: "Південний Судан" },
  { name: "Spain", iso2: "ES", ua: "Іспанія" },
  { name: "Sri Lanka", iso2: "LK", ua: "Шрі-Ланка" },
  { name: "Sudan", iso2: "SD", ua: "Судан" },
  { name: "Suriname", iso2: "SR", ua: "Суринам" },
  { name: "Sweden", iso2: "SE", ua: "Швеція" },
  { name: "Switzerland", iso2: "CH", ua: "Швейцарія" },
  { name: "Syria", iso2: "SY", ua: "Сирія" },
  { name: "Taiwan", iso2: "TW", ua: "Тайвань" },
  { name: "Tajikistan", iso2: "TJ", ua: "Таджикистан" },
  { name: "Tanzania", iso2: "TZ", ua: "Танзанія" },
  { name: "Thailand", iso2: "TH", ua: "Таїланд" },
  { name: "Togo", iso2: "TG", ua: "Того" },
  { name: "Tonga", iso2: "TO", ua: "Тонга" },
  { name: "Trinidad and Tobago", iso2: "TT", ua: "Тринідад і Тобаго" },
  { name: "Tunisia", iso2: "TN", ua: "Туніс" },
  { name: "Turkey", iso2: "TR", ua: "Туреччина" },
  { name: "Turkmenistan", iso2: "TM", ua: "Туркменістан" },
  { name: "Tuvalu", iso2: "TV", ua: "Тувалу" },
  { name: "Uganda", iso2: "UG", ua: "Уганда" },
  { name: "Ukraine", iso2: "UA", ua: "Україна" },
  {
    name: "United Arab Emirates",
    iso2: "AE",
    ua: "Об'єднані Арабські Емірати",
  },
  { name: "United Kingdom", iso2: "GB", ua: "Велика Британія" },
  { name: "United States", iso2: "US", ua: "Сполучені Штати Америки" },
  { name: "Uruguay", iso2: "UY", ua: "Уругвай" },
  { name: "Uzbekistan", iso2: "UZ", ua: "Узбекистан" },
  { name: "Vanuatu", iso2: "VU", ua: "Вануату" },
  { name: "Vatican City", iso2: "VA", ua: "Ватикан" },
  { name: "Venezuela", iso2: "VE", ua: "Венесуела" },
  { name: "Vietnam", iso2: "VN", ua: "В'єтнам" },
  { name: "Yemen", iso2: "YE", ua: "Ємен" },
  { name: "Zambia", iso2: "ZM", ua: "Замбія" },
  { name: "Zimbabwe", iso2: "ZW", ua: "Зімбабве" },
];

export const SELLER_TYPES = [
  {
    key: "manufacturer",
    label: "Manufacturer",
    ua: "Виробник",
    category: "Primary",
    categoryUa: "Основні",
    description: "Designs and produces products.",
    descriptionUa: "Проектує та виробляє продукцію.",
  },
  {
    key: "dealer",
    label: "Dealer",
    ua: "Дилер",
    category: "Distribution",
    categoryUa: "Дистрибуція",
    description: "Authorized seller of products.",
    descriptionUa: "Авторизований продавець продукції.",
  },
  {
    key: "wholesaler",
    label: "Wholesaler",
    ua: "Оптовий продавець",
    category: "Distribution",
    categoryUa: "Дистрибуція",
    description: "Buys in bulk and resells to dealers/retailers.",
    descriptionUa: "Купує оптом та перепродає дилерам/роздрібним продавцям.",
  },
  {
    key: "retailer",
    label: "Retailer",
    ua: "Роздрібний продавець",
    category: "Retail",
    categoryUa: "Роздрібна торгівля",
    description: "Sells products directly to end users.",
    descriptionUa: "Продає продукцію безпосередньо кінцевим споживачам.",
  },
  {
    key: "importer",
    label: "Importer",
    ua: "Імпортер",
    category: "Import/Export",
    categoryUa: "Імпорт/Експорт",
    description: "Imports products into a country.",
    descriptionUa: "Імпортує продукцію в країну.",
  },
  {
    key: "broker-agent",
    label: "Broker/Agent",
    ua: "Агент/Брокер",
    category: "Intermediaries",
    categoryUa: "Посередники",
    description: "Facilitates deals without owning stock; commission-based.",
    descriptionUa:
      "Сприяє угодам без володіння запасами; на комісійній основі.",
  },
] as const;

export const PRODUCT_CATEGORY_FORM = [
  {
    key: "armour",
    label: "armour",
  },
  {
    key: "weapons",
    label: "weapons",
  },
  {
    key: "accessories",
    label: "accessories",
  },
] as const;

export const PRODUCT_CONDITION_FORM = [
  {
    key: "New",
    label: "New",
  },
  {
    key: "In-Stock",
    label: "In Stock",
  },
  {
    key: "Pre-Order",
    label: "Pre-Order",
  },
] as const;

export const PRODUCT_STATUS_FORM = [
  {
    key: "available",
    label: "Available",
  },
  {
    key: "unavailable",
    label: "Unavailable",
  },
] as const;

// Function to get translated product status options (available/unavailable)
export const getProductStatusOptions = (t: (key: string) => string) =>
  [
    {
      key: "available",
      label: t("available"),
    },
    {
      key: "unavailable",
      label: t("unavailable"),
    },
  ] as const;

// Function to get translated product condition options (new/used)
export const getProductConditionOptions = (t: (key: string) => string) =>
  [
    {
      key: "new",
      label: t("new"),
    },
    {
      key: "used",
      label: t("used"),
    },
  ] as const;

export const PRODUCT_CURRENCY_FORM = [
  {
    key: "USD",
    label: "USD",
  },
  {
    key: "EUR",
    label: "EUR",
  },
  {
    key: "UAH",
    label: "UAH",
  },
] as const;

// Role utilities
export const isSeller = (user: UserProfile): boolean => {
  return user?.role?.name === "seller";
};

export const isBuyer = (user: UserProfile): boolean => {
  return user?.role?.name === "buyer";
};

export const getUserRole = (user: UserProfile): string | null => {
  return user?.role?.name || null;
};

export const hasRole = (user: UserProfile, role: string): boolean => {
  return user?.role?.name === role;
};

export const STORAGE_KEY = "add-product-form-draft";

// Date formatting utilities
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // If less than 1 day, show relative time
  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      if (diffInMinutes === 0) {
        return "Just now";
      }
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    }
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  // If less than 7 days, show "X days ago"
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  // Otherwise show formatted date
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const protectFromXSS = (text: string) => {
  return text
    .replace(/\&/g, "&amp;")
    .replace(/\</g, "&lt;")
    .replace(/\>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/\'/g, "&apos;");
};

export const timestampToTime = (timestamp: number) => {
  const now = new Date().getTime();
  const nowDate = moment
    .unix(now.toString().length === 13 ? now / 1000 : now)
    .format("MM/DD");
  let date = moment
    .unix(timestamp.toString().length === 13 ? timestamp / 1000 : timestamp)
    .format("MM/DD");
  if (date === "Invalid date") {
    date = "";
  }
  return nowDate === date
    ? moment
        .unix(timestamp.toString().length === 13 ? timestamp / 1000 : timestamp)
        .format("HH:mm")
    : date;
};

export const handleEnterPress = (
  event: React.KeyboardEvent,
  callback: () => void
) => {
  if (event.key === "Enter") {
    callback();
  }
};

export const triggerClasses =
  "w-full text-lg font-medium text-muted-foreground flex justify-start px-3.5";
