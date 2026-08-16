import type { MetadataRoute } from "next";
import { getAllPosts } from "../lib/posts";
import { siteConfig } from "../siteConfig";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const staticPaths = ["", "/about", "/projects", "/timeline", "/moments", "/photowall", "/friends", "/chatter"];

  return [
    ...staticPaths.map((path) => ({
      url: `${siteConfig.siteUrl}${path}`,
      lastModified: new Date(siteConfig.buildDate),
      changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.siteUrl}/posts/${post.slug.split("/").map(encodeURIComponent).join("/")}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
