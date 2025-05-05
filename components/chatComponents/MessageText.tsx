"use client";

import LinkPreview from "./LinkPreview";


const urlRegex = /((https?:\/\/)?[\w-]+\.[\w./?=&%-]+)/gi;

const normalizeUrl = (url: string) => {
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};

const MessageText = ({ text }: { text: string }) => {
  const urls = Array.from(text.matchAll(urlRegex), (match) => match[0]);
  const uniqueUrls = Array.from(new Set(urls));

  const parsedText = text.split(urlRegex).map((part, i) => {
    if (urlRegex.test(part)) {
      const href = normalizeUrl(part);
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
