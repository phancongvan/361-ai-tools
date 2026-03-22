import { getDb } from './db';

export default async function seed() {
  const sql = getDb();

  // ─── Create Tables ──────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      slug        TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      parent_id   TEXT REFERENCES categories(id) ON DELETE CASCADE,
      sort_order  INT DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tools (
      id             TEXT PRIMARY KEY,
      name           TEXT NOT NULL,
      slug           TEXT UNIQUE NOT NULL,
      category_id    TEXT REFERENCES categories(id) ON DELETE SET NULL,
      badge          TEXT DEFAULT '',
      pricing_tier   TEXT DEFAULT '',
      pricing_amount TEXT DEFAULT '',
      verdict        TEXT DEFAULT '',
      features       JSONB DEFAULT '[]',
      pros           JSONB DEFAULT '[]',
      cons           JSONB DEFAULT '[]',
      external_link  TEXT DEFAULT '',
      image          TEXT DEFAULT '',
      rating         NUMERIC(2,1) DEFAULT 0,
      api_available  BOOLEAN DEFAULT false,
      open_source    BOOLEAN DEFAULT false,
      mobile_app     BOOLEAN DEFAULT false,
      popular        BOOLEAN DEFAULT false,
      created_at     TIMESTAMPTZ DEFAULT NOW(),
      updated_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS articles (
      id             TEXT PRIMARY KEY,
      type           TEXT NOT NULL CHECK(type IN ('blog','listicle')),
      title          TEXT NOT NULL,
      slug           TEXT UNIQUE NOT NULL,
      category_id    TEXT REFERENCES categories(id) ON DELETE SET NULL,
      excerpt        TEXT DEFAULT '',
      subtitle       TEXT DEFAULT '',
      image          TEXT DEFAULT '',
      author         TEXT DEFAULT '',
      author_avatar  TEXT DEFAULT '',
      status         TEXT DEFAULT 'draft',
      tags           JSONB DEFAULT '[]',
      featured       BOOLEAN DEFAULT false,
      introduction   TEXT DEFAULT '',
      conclusion     TEXT DEFAULT '',
      content        TEXT DEFAULT '',
      created_at     TIMESTAMPTZ DEFAULT NOW(),
      updated_at     TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS article_tools (
      id          TEXT PRIMARY KEY,
      article_id  TEXT REFERENCES articles(id) ON DELETE CASCADE,
      tool_id     TEXT REFERENCES tools(id) ON DELETE CASCADE,
      sort_order  INT DEFAULT 0,
      UNIQUE(article_id, tool_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS subscribers (
      id         TEXT PRIMARY KEY,
      email      TEXT UNIQUE NOT NULL,
      name       TEXT DEFAULT '',
      status     TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // ─── Seed Categories ────────────────────────────────────────
  await sql`
    INSERT INTO categories (id, name, slug, description, parent_id, sort_order)
    VALUES 
      ('cat-1', 'Generative AI', 'generative-ai', 'Tools that generate text, images, or other media.', NULL, 1),
      ('cat-1-1', 'Software', 'software', 'Comprehensive reviews of software solutions.', 'cat-1', 1),
      ('cat-1-1-1', 'Productivity', 'productivity', 'Productivity tools and apps.', 'cat-1-1', 1),
      ('cat-1-1-2', 'Design', 'design', 'Design tools and creative software.', 'cat-1-1', 2),
      ('cat-1-1-3', 'Development', 'development', 'Development tools and IDEs.', 'cat-1-1', 3),
      ('cat-2', 'Hardware', 'hardware', 'Hardware tools and devices.', NULL, 2)
    ON CONFLICT (id) DO NOTHING
  `;

  // ─── Seed Tools ─────────────────────────────────────────────
  await sql`
    INSERT INTO tools (id, name, slug, category_id, badge, pricing_tier, pricing_amount, verdict, features, pros, cons, external_link, rating, api_available, open_source, mobile_app, popular)
    VALUES 
      ('tool-omnimind-pro', 'OmniMind Pro', 'omnimind-pro', 'cat-1-1-1', 'Most Versatile', 'Free + Premium', '$20/mo',
       'The best all-around AI assistant for daily workflows.',
       '["Multi-modal reasoning", "Real-time collaboration", "Plugin ecosystem"]'::jsonb,
       '["Extremely versatile", "Great API documentation"]'::jsonb,
       '["Can be slow on complex tasks", "Premium pricing"]'::jsonb,
       'https://example.com/omnimind', 4.8, true, false, true, true),
      ('tool-codepilot-x', 'CodePilot X', 'codepilot-x', 'cat-1-1-1', 'Best for Developers', 'Freemium', '$15/mo',
       'The most powerful AI coding assistant on the market.',
       '["Context-aware completions", "Multi-file editing", "Test generation"]'::jsonb,
       '["Lightning fast", "Supports 50+ languages"]'::jsonb,
       '["Requires good prompting skills"]'::jsonb,
       'https://example.com/codepilot', 4.5, true, true, false, true)
    ON CONFLICT (id) DO NOTHING
  `;

  // ─── Seed Articles ──────────────────────────────────────────
  await sql`
    INSERT INTO articles (id, type, title, slug, category_id, excerpt, image, author, author_avatar, status, tags, featured, introduction, conclusion)
    VALUES 
      ('listicle-1', 'listicle', 'Top 10 Best AI Tools for 2026: The Productivity Revolution', 'top-10-best-ai-tools-2026', 'cat-1-1-1',
       'Explore the next generation of LLMs and autonomous agents.',
       'https://lh3.googleusercontent.com/aida-public/AB6AXuD5cHwHZAEQtG-DGb1WiOs-QecmLOiBIFNPwwmR4ak9ELScpoBygBeUY9y--hqvkw3ONm60YwGe4nBZONhcPOdCJhVrMMOXOt2l-YCWAwuYlyEe0LPoESqqWOywsRXGHyGqZK1lmTqthZyz22IbKSCY4UHZ-MFPWxHftjWHDBqIgBCsRaflJlewrSBPTflFEArfjKUApsZ-nLxbSCjpVDHx75kKvaq0NBLZTx2-iFJdntyYlZoMUoi88NU8JVL4RcYm5vhmBpG5PKk',
       'Alex Rivera', '', 'published',
       '["AI", "Productivity", "Tools"]'::jsonb,
       true,
       'The landscape of artificial intelligence is evolving at terminal velocity.',
       'The AI tools landscape in 2026 is more exciting than ever.')
    ON CONFLICT (id) DO NOTHING
  `;

  await sql`
    INSERT INTO article_tools (id, article_id, tool_id, sort_order)
    VALUES 
      ('at-1', 'listicle-1', 'tool-omnimind-pro', 1),
      ('at-2', 'listicle-1', 'tool-codepilot-x', 2)
    ON CONFLICT (id) DO NOTHING
  `;

  return { success: true, message: 'Database seeded successfully' };
}
