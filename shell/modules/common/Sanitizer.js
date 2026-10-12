.pragma library

const BR_VARIANTS = /(&lt;|<)\s*\/?\s*br\s*\/?\s*(&gt;|>)\s*\n?/gi;
const CONTAINER_TAGS = /<\/?(div|span|p)\b[^>]*>/gi;

function cleanNotificationBody(raw) {
    if (!raw) return "";

    return String(raw)
        // 1. Normalize all HTML breaks, escaped variants, and newlines to <br>
        .replace(BR_VARIANTS, "<br>")
        .replace(/\r?\n/g, "<br>")
        // 2. Strip container bloat
        .replace(CONTAINER_TAGS, "")
        // 3. Convert Markdown formatting to HTML
        .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>')
        // 4. Autolink bare URLs not already inside an <a> tag
        .replace(/(^|[\s(])(https?:\/\/[^\s<)]+?)([.,;:!?]?)(?=[\s)]|$)/g, '$1<a href="$2">$2</a>$3')
        // 5. Escape lone brackets to protect shell/math (< 10, <(cmd))
        .replace(/<(?!\/?(b|i|u|s|a|code|br)\b)/gi, "&lt;")
        // 6. Decode entities StyledText fails to resolve
        .replace(/&quot;/g, '"')
        .replace(/&apos;|&#39;/g, "'")
        // 7. Collapse excessive line breaks (3+ down to 2)
        .replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>")
        // 8. Strip leading and trailing breaks
        .replace(/^(\s*<br\s*\/?>\s*)+/gi, "")
        .replace(/(\s*<br\s*\/?>\s*)+$/gi, "")
        .trim();
}

function cleanPreview(raw) {
    if (!raw) return "";

    return String(raw)
        .replace(BR_VARIANTS, " ")
        .replace(/\r?\n/g, " ")
        .replace(/<[^>]*>/g, " ")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[*`~]/g, "")
        .replace(/&quot;/g, '"')
        .replace(/&apos;|&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
}
