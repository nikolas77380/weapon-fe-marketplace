function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatLabel(segment: string, customLabels?: Record<string, string>) {
  // Check if there is a custom name for this segment
  if (customLabels && customLabels[segment]) {
    return customLabels[segment];
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
const HIDDEN_SEGMENTS = ["company", "edit-product", "marketplace"];

function shouldHideSegment(segment: string, segments: string[], index: number) {
  // If this is an intermediate route for a dynamic route, hide it.
  if (HIDDEN_SEGMENTS.includes(segment)) {
    // Check that the next segment looks like ID (numbers)
    const nextSegment = segments[index + 1];
    if (nextSegment && /^\d+$/.test(nextSegment)) {
      return true;
    }
  }
  return false;
}

export function generateBreadcrumbs(
  pathname: string,
  customLabels?: Record<string, string>
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
      label: formatLabel(item.segment, customLabels),
      href,
      isLast: filteredIndex === visibleSegments.length - 1,
    };
  });
}
