"use client";

import { useEffect, useState } from "react";

const LinkPreview = ({ url }: { url: string }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch("/api/link-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const preview = await res.json();
        setData(preview);
      } catch (err) {
        console.error("Preview fetch failed", err);
      }
    };

    fetchPreview();
  }, [url]);

  if (!data || !data.title) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-lg overflow-hidden shadow hover:shadow-md transition bg-white dark:bg-gray-900 max-w-md"
    >
      {data.images?.[0] && (
        <img
          src={data.images[0]}
          alt="preview"
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <p className="font-semibold text-sm">{data.title}</p>
        {data.description && (
          <p className="text-xs text-gray-600">{data.description}</p>
        )}
        <p className="text-xs text-blue-500 mt-1">{url}</p>
      </div>
    </a>
  );
};

export default LinkPreview;
