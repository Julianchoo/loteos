const WP_GRAPHQL_URL =
  process.env.WORDPRESS_GRAPHQL_URL ||
  "https://fitzroyadesarrollos.com/graphql";

async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 }, // cache 1 hora
  });

  if (!res.ok) {
    throw new Error(`WordPress GraphQL error: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message ?? "GraphQL error");
  }

  return json.data as T;
}

export interface WPPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  modified: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  } | null;
  categories: {
    nodes: { name: string; slug: string }[];
  };
  author: {
    node: { name: string };
  };
}

export interface WPPostFull extends WPPost {
  content: string;
  seo?: {
    title: string;
    metaDesc: string;
    opengraphTitle: string;
    opengraphDescription: string;
    opengraphImage: { sourceUrl: string } | null;
  };
}

const POST_FIELDS = `
  id
  slug
  title
  excerpt
  date
  modified
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
  categories {
    nodes {
      name
      slug
    }
  }
  author {
    node {
      name
    }
  }
`;

export async function getPosts(first = 12, after?: string) {
  const data = await fetchGraphQL<{
    posts: {
      nodes: WPPost[];
      pageInfo: { hasNextPage: boolean; endCursor: string };
    };
  }>(
    `query GetPosts($first: Int!, $after: String) {
      posts(first: $first, after: $after, where: { status: PUBLISH }) {
        nodes { ${POST_FIELDS} }
        pageInfo { hasNextPage endCursor }
      }
    }`,
    { first, after }
  );
  return data.posts;
}

export async function getPostBySlug(slug: string) {
  const data = await fetchGraphQL<{ post: WPPostFull | null }>(
    `query GetPost($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        ${POST_FIELDS}
        content
      }
    }`,
    { slug }
  );
  return data.post;
}

export async function getAllPostSlugs() {
  const data = await fetchGraphQL<{ posts: { nodes: { slug: string }[] } }>(
    `query GetSlugs {
      posts(first: 1000, where: { status: PUBLISH }) {
        nodes { slug }
      }
    }`
  );
  return data.posts.nodes.map((n) => n.slug);
}

export function formatWPDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
