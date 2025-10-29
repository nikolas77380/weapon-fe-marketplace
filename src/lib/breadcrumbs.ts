function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function segmentToTranslationKey(segment: string): string {
  // Convert kebab-case to camelCase for translation keys
  return segment.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Known breadcrumb segments and their translation keys
const BREADCRUMB_TRANSLATION_MAP: Record<string, string> = {
  account: "account",
  "add-product": "addProduct",
  "edit-product": "editProduct",
  "user-profile": "userProfile",
  // Add more mappings as needed
};

function formatLabel(
  segment: string,
  customLabels?: Record<string, string>,
  t?: (key: string) => string
) {
  // Check if there is a custom name for this segment
  if (customLabels && customLabels[segment]) {
    return customLabels[segment];
  }

  // Try to get translation for the segment
  if (t) {
    // Helper function to safely get translation
    const safeTranslate = (key: string): string | null => {
      try {
        const translation = t(`Breadcrumb.${key}`);
        return translation && translation !== key ? translation : null;
      } catch {
        return null;
      }
    };

    // First, check if we have a known mapping for this segment
    const mappedKey = BREADCRUMB_TRANSLATION_MAP[segment];
    if (mappedKey) {
      const mappedTranslation = safeTranslate(mappedKey);
      if (mappedTranslation) {
        return mappedTranslation;
      }
    }

    // Then try the segment as-is
    const directTranslation = safeTranslate(segment);
    if (directTranslation) {
      return directTranslation;
    }

    // Finally try converting to camelCase (e.g., "add-product" -> "addProduct")
    const camelCaseKey = segmentToTranslationKey(segment);
    if (camelCaseKey !== segment) {
      const camelCaseTranslation = safeTranslate(camelCaseKey);
      if (camelCaseTranslation) {
        return camelCaseTranslation;
      }
    }
  }

  // Decoding URL segment
  const decoded = decodeURIComponent(segment);
  const withSpaces = decoded.replace(/-/g, " ");
  const capitalized = withSpaces
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");

  return capitalized;
}

// Segments that should be hidden from breadcrumbs (intermediate routes for dynamic pages)
const HIDDEN_SEGMENTS = ["company", "edit-product", "marketplace", "category"];

function shouldHideSegment(segment: string, segments: string[], index: number) {
  // If this is an intermediate route for a dynamic route, hide it.
  if (HIDDEN_SEGMENTS.includes(segment)) {
    // Check that the next segment exists (for dynamic routes)
    const nextSegment = segments[index + 1];
    if (nextSegment) {
      return true;
    }
  }
  return false;
}

export function generateBreadcrumbs(
  pathname: string,
  customLabels?: Record<string, string>,
  t?: (key: string) => string
) {
  const segments = pathname.split("/").filter(Boolean);

  // Create an array with indices to track the original positions
  const segmentsWithIndex = segments.map((segment, index) => ({
    segment,
    originalIndex: index,
    shouldHide: shouldHideSegment(segment, segments, index),
  }));

  const visibleSegments = segmentsWithIndex.filter((item) => !item.shouldHide);

  return visibleSegments.map((item, filteredIndex) => {
    const href = "/" + segments.slice(0, item.originalIndex + 1).join("/");

    return {
      label: formatLabel(item.segment, customLabels, t),
      href,
      isLast: filteredIndex === visibleSegments.length - 1,
    };
  });
}
