import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ArticleCard from "@/components/public/ArticleCard";
import { getAuthorById, getArticlesByAuthor } from "@/lib/articles-service";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Briefcase, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AuthorProfilePage({ params }: Props) {
  const { id } = await params;
  const author = await getAuthorById(id);

  if (!author) {
    notFound();
  }

  const articles = await getArticlesByAuthor(id);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="h-32 bg-gradient-to-r from-red-600 to-red-800" />
          <div className="px-8 pb-8">
            <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-12 mb-6">
              <div className="relative h-32 w-32 rounded-2xl overflow-hidden border-4 border-white bg-gray-100 shadow-md">
                {author.avatar_url ? (
                  <Image src={author.avatar_url} alt={author.name} fill className="object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-gray-400 bg-gray-50">
                    {author.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-black text-gray-900 font-playfair">{author.name}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-gray-600">
                  <span className="flex items-center gap-1.5 text-sm">
                    <Briefcase className="h-4 w-4 text-red-600" />
                    {author.title || "Staff Reporter"}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-4 w-4 text-red-600" />
                    {author.department || "Editorial"}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <Calendar className="h-4 w-4 text-red-600" />
                    Joined {formatDate(new Date(author.created_at || Date.now()))}
                  </span>
                </div>
              </div>
              <div className="shrink-0 flex gap-3">
                <a 
                  href={`mailto:${author.email}`}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Contact Author"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Role</p>
                <p className="text-sm font-medium text-gray-900 capitalize">{author.role.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Articles Published</p>
                <p className="text-sm font-medium text-gray-900">{articles.length}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <Badge variant={author.active ? "emerald" : "red"}>
                  {author.active ? "Active Reporter" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Author's Articles */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 font-playfair">
              Articles by {author.name}
            </h2>
          </div>
          
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No published articles found for this reporter.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
