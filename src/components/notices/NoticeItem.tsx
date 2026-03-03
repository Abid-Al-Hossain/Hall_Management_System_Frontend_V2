import React, { useState } from "react";
import { Star, Star as StarFilled } from "lucide-react";

interface NoticeItemProps {
  title: string;
  date: string;
  description: string;
  type: "maintenance" | "events" | "updates";
}

const NoticeItem: React.FC<NoticeItemProps> = ({
  title,
  date,
  description,
  type,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  const handleRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRead(!isRead);
  };

  const typeColors = {
    maintenance: "bg-orange-50",
    events: "bg-purple-50",
    updates: "bg-emerald-50",
  };

  return (
    <div
      className={`p-4 ${typeColors[type]} shadow-md rounded-lg mb-4 hover:shadow-lg transition duration-200 cursor-pointer overflow-hidden`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-center">
        <h3
          className={`text-xl font-bold ${isRead ? "text-gray-500" : "text-indigo-800"}`}
        >
          {title}
        </h3>
        <button
          onClick={handleFavorite}
          aria-label="Toggle favorite"
          className="p-1 hover:bg-black/5 rounded-full z-10"
        >
          {isFavorite ? (
            <StarFilled className="text-yellow-500" />
          ) : (
            <Star className="text-gray-400" />
          )}
        </button>
      </div>
      <p className="text-sm text-gray-500">{date}</p>

      <div
        className={`transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0 overflow-hidden mt-0"}`}
      >
        <p
          className={`whitespace-pre-wrap ${isRead ? "text-gray-500" : "text-gray-700"}`}
        >
          {description}
        </p>
        <button
          onClick={handleRead}
          className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline z-10 transition-colors"
        >
          Mark as {isRead ? "Unread" : "Read"}
        </button>
      </div>

      {!isExpanded && (
        <p className="mt-2 text-sm text-indigo-600 font-medium">
          Click to expand details
        </p>
      )}
    </div>
  );
};

export default NoticeItem;
