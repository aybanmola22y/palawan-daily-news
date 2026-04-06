import Image from "next/image";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getPublishedArticles } from "@/lib/articles-service";
import { CalendarIcon } from "lucide-react";

interface AuthorHoverCardProps {
  authorId?: string | number | null;
  authorName: string;
  authorAvatar?: string | null;
  role?: string;
}

export default async function AuthorHoverCard({
  authorId,
  authorName,
  authorAvatar,
  role = "Staff Reporter",
}: AuthorHoverCardProps) {
  // Fetch author's most recent articles for the hover card
  // For now, we manually filter the published articles since we don't have a dedicated getArticlesByAuthor query
  const allArticles = await getPublishedArticles();
  
  // Try to match by authorId if present, else by authorName (for imported ones)
  const authorArticles = allArticles
    .filter(a => authorId ? String(a.authorId) === String(authorId) : a.authorName === authorName)
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, 3); // Get 3 most recent

  const renderTriggerContent = () => (
    <div className="flex items-center gap-2">
      <div className={`relative h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${authorId ? 'transition-ring group-hover:ring-2 ring-red-500 ring-offset-2' : ''}`}>
        {authorAvatar ? (
          <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
        ) : (
          <span className="text-gray-500 text-xs font-bold">{authorName?.charAt(0) ?? "A"}</span>
        )}
      </div>
      <div>
        <p className={`font-semibold text-sm text-gray-900 ${authorId ? 'group-hover:text-red-600 transition-colors' : 'hover:text-red-600 transition-colors cursor-pointer'}`}>
          {authorName}
        </p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
    </div>
  );

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {authorId ? (
          <Link href={`/author/${authorId}`} className="group flex items-center gap-2">
            {renderTriggerContent()}
          </Link>
        ) : (
          <div className="group flex items-center gap-2">
            {renderTriggerContent()}
          </div>
        )}
      </HoverCardTrigger>
      
      <HoverCardContent className="w-80 p-4 bg-white z-50 shadow-xl border-gray-100 rounded-xl" align="start">
        <div className="flex justify-between space-x-4">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
            {authorAvatar ? (
              <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
            ) : (
              <span className="text-gray-500 text-sm font-bold flex items-center justify-center h-full w-full">
                {authorName?.charAt(0) ?? "A"}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold leading-none text-gray-900">{authorName}</h4>
            <span className="text-xs text-red-600 font-medium">{role}</span>
            <p className="text-xs text-gray-500 pt-2 border-t border-gray-100 mt-2">
              Recent articles:
            </p>
            {authorArticles.length > 0 ? (
              <ul className="space-y-2 mt-2">
                {authorArticles.map(article => (
                  <li key={article.id} className="text-xs">
                    <Link href={`/news/${article.slug}`} className="hover:text-red-600 text-gray-800 line-clamp-2 transition-colors">
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 mt-2 italic">No recent articles found.</p>
            )}
            
            {authorId && (
               <div className="mt-4 pt-2 w-full text-center">
                 <Link href={`/author/${authorId}`} className="text-xs text-red-600 font-medium hover:underline">
                   View all author articles
                 </Link>
               </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
