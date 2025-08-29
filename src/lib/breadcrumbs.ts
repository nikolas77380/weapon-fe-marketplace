function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatLabel(segment: string) {
  // Декодируем URL сегмент
  const decoded = decodeURIComponent(segment);
  const withSpaces = decoded.replace(/-/g, " ");
  const capitalized = withSpaces
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");

  return capitalized;
}

// Paths that should not be clickable (don't have their own pages)
const NON_CLICKABLE_PATHS = [
  "/account/edit-product",
];

function isPathClickable(href: string) {
  return !NON_CLICKABLE_PATHS.includes(href);
}

export function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    return {
      label: formatLabel(segment),
      href,
      isLast: index === segments.length - 1,
      isClickable: isPathClickable(href),
    };
  });
}
