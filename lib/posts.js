// lib/posts.js
import matter from 'gray-matter';
import { getFile, listDir, putFile, deleteFile, rawUrl } from './github';

const POSTS_DIR = 'content/posts';
const DEFAULT_AUTHOR = process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Hujaifa';

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Roughly 200 words per minute, minimum 1 minute.
function calcReadingTime(content) {
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Returns all posts, sorted newest first. Each item has frontmatter + slug (no body).
export async function getAllPosts() {
  const files = await listDir(POSTS_DIR);
  const mdFiles = files.filter((f) => f.type === 'file' && f.name.endsWith('.md'));

  const posts = await Promise.all(
    mdFiles.map(async (f) => {
      const slug = f.name.replace(/\.md$/, '');
      const file = await getFile(`${POSTS_DIR}/${f.name}`);
      if (!file) return null;
      const { data, content } = matter(file.content);
      return {
        slug,
        title: data.title || slug,
        date: data.date || null,
        excerpt: data.excerpt || '',
        thumbnail: data.thumbnail || null,
        author: data.author || DEFAULT_AUTHOR,
        readingTime: calcReadingTime(content),
      };
    })
  );

  return posts
    .filter(Boolean)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

export async function getPostBySlug(slug) {
  const file = await getFile(`${POSTS_DIR}/${slug}.md`);
  if (!file) return null;
  const { data, content } = matter(file.content);
  return {
    slug,
    sha: file.sha,
    title: data.title || slug,
    date: data.date || null,
    excerpt: data.excerpt || '',
    thumbnail: data.thumbnail || null,
    author: data.author || DEFAULT_AUTHOR,
    readingTime: calcReadingTime(content),
    content,
  };
}

// Create a brand-new post. Throws if slug already exists.
export async function createPost({ title, date, excerpt, thumbnail, author, content }) {
  const slug = slugify(title);
  const existing = await getFile(`${POSTS_DIR}/${slug}.md`);
  if (existing) {
    throw new Error('A post with this title/slug already exists.');
  }
  const frontmatter = matter.stringify(content || '', {
    title,
    date: date || new Date().toISOString().slice(0, 10),
    excerpt: excerpt || '',
    thumbnail: thumbnail || '',
    author: author || DEFAULT_AUTHOR,
  });
  await putFile(`${POSTS_DIR}/${slug}.md`, frontmatter, `Add post: ${title}`);
  return slug;
}

// Update an existing post (needs current sha for safe overwrite).
export async function updatePost(slug, { title, date, excerpt, thumbnail, author, content, sha }) {
  const frontmatter = matter.stringify(content || '', {
    title,
    date: date || new Date().toISOString().slice(0, 10),
    excerpt: excerpt || '',
    thumbnail: thumbnail || '',
    author: author || DEFAULT_AUTHOR,
  });
  await putFile(`${POSTS_DIR}/${slug}.md`, frontmatter, `Update post: ${title}`, sha);
  return slug;
}

export async function deletePost(slug) {
  const file = await getFile(`${POSTS_DIR}/${slug}.md`);
  if (!file) throw new Error('Post not found.');
  await deleteFile(`${POSTS_DIR}/${slug}.md`, `Delete post: ${slug}`, file.sha);
}

export { slugify, rawUrl, calcReadingTime, DEFAULT_AUTHOR };
