"use client";

import LinkPreview from "./LinkPreview";

// URL matching regex, allowing optional `https://` and protocols
const urlRegex = /((?:https?:\/\/)?[\w-]+\.[\w./?=&%-]+)/gi;

// Normalize the URL to ensure a single `https://` protocol is added
const normalizeUrl = (url: string) => {
  try {
    const trimmed = url.trim().replace(/^(https?:\/\/)+/, ""); // remove any existing protocol
    return `https://${trimmed}`;
  } catch {
    return "#"; // fallback if URL is invalid
  }
};

const MessageText = ({ text }: { text: string }) => {
  const urls = Array.from(text.matchAll(urlRegex), (match) => match[0]);
  const uniqueUrls = Array.from(new Set(urls)); // ensure unique URLs for preview

  // Split the message into parts where URLs are detected and render links accordingly
  const parsedText = text.split(urlRegex).map((part, i) => {
    if (urlRegex.test(part)) {
      const href = normalizeUrl(part); // normalize each URL
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline break-words"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });

  return (
    <div className="space-y-2">
      <p className="text-sm leading-snug break-words">{parsedText}</p>
      {uniqueUrls.map((url, i) => (
        <LinkPreview key={i} url={normalizeUrl(url)} />
      ))}
    </div>
  );
};

export default MessageText;
