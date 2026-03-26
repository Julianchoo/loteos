import Airtable from "airtable";
import { config } from "dotenv";

// Load environment variables
config();

if (!process.env.AIRTABLE_API_TOKEN) {
  throw new Error("AIRTABLE_API_TOKEN is not defined");
}

if (!process.env.AIRTABLE_TICKETS_TABLE_ID) {
  throw new Error("AIRTABLE_TICKETS_TABLE_ID is not defined");
}

const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_TOKEN,
});

const base = airtable.base(process.env.AIRTABLE_BASE_ID!);
const tickets = base(process.env.AIRTABLE_TICKETS_TABLE_ID!);

// SEO Audit tickets from the comprehensive audit
const seoTickets = [
  // P0 - Critical Priority (Week 1)
  {
    Name: "SEO P0-1: Fix Mixed Content Security Error (HTTP API calls)",
    Description: "Fix critical security error: HTTP API calls on HTTPS pages blocking authentication. Change all 'http://loteos.vercel.app/api/' calls to relative URLs '/api/'. Check auth-client.ts and all components making API calls. This is blocking user sign-in/registration completely.",
    Status: "Todo",
    Priority: "Critical",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P0-2: Fix Sitemap/Robots.txt Conflict",
    Description: "Fix sitemap.xml conflict with robots.txt. Currently robots.txt blocks /dashboard/ and /chat/ but sitemap includes them. Remove dashboard and chat from sitemap, add /proyectos/san-matias and /proyectos/guernica instead. Change all http:// URLs to https://.",
    Status: "Todo",
    Priority: "Critical",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P0-3: Add Organization Schema Markup to Homepage",
    Description: "Add RealEstateAgent schema markup to homepage with JSON-LD. Include company name, description, contact info, address, geo coordinates, and social media links. This enables rich snippets and Knowledge Graph in search results.",
    Status: "Todo",
    Priority: "Critical",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P0-4: Add Product Schema for San Matías Project",
    Description: "Add Product schema markup to /proyectos/san-matias page with pricing (USD 12,500-20,000), availability, lot details, and images. This will display price and availability in search results rich snippets.",
    Status: "Todo",
    Priority: "Critical",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P0-5: Fix Duplicate Title Tags on All Pages",
    Description: "All 3 pages use identical title 'Fitzroya Desarrollos | Desarrollos Inmobiliarios'. Update each page with unique, keyword-optimized titles: Homepage with 'Lotes en Venta en Buenos Aires', San Matías with price, Guernica with location.",
    Status: "Todo",
    Priority: "Critical",
    Type: "Infrastructure"
  },

  // P1 - High Priority (Week 2-3)
  {
    Name: "SEO P1-1: Add Unique Meta Descriptions to All Pages",
    Description: "All pages share the same meta description. Write unique, compelling 150-160 character descriptions for homepage, San Matías, and Guernica pages that include key selling points and calls-to-action.",
    Status: "Todo",
    Priority: "High",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P1-2: Create llms.txt File for AI Search Engines",
    Description: "Create /llms.txt file with structured information about Fitzroya Desarrollos, projects, pricing, and key details. This optimizes visibility in AI search engines (ChatGPT, Perplexity, Claude).",
    Status: "Todo",
    Priority: "High",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P1-3: Add OpenGraph and Twitter Card Meta Tags",
    Description: "Add OpenGraph and Twitter Card meta tags to all pages for better social media sharing. Create 1200x630px OG images for homepage, San Matías, and Guernica. This improves click-through from social platforms.",
    Status: "Todo",
    Priority: "High",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P1-4: Fix React Hydration Error on Guernica Page",
    Description: "Debug and fix React error #418 (hydration mismatch) on Guernica page. Check for server/client rendering differences, conditional rendering, or random ID generation issues.",
    Status: "Todo",
    Priority: "High",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P1-5: Add Security Headers to Next.js Config",
    Description: "Add security headers to next.config.js: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy. This improves security score and trust signals.",
    Status: "Todo",
    Priority: "High",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P1-6: Add Product Schema for Guernica Project",
    Description: "Add Product schema markup to /proyectos/guernica page similar to San Matías, with pricing, lot count, and project details for rich snippets in search results.",
    Status: "Todo",
    Priority: "High",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P1-7: Add BreadcrumbList Schema to Project Pages",
    Description: "Implement BreadcrumbList schema markup on San Matías and Guernica pages. Also add visible breadcrumb UI component (Inicio > Proyectos > Project Name) for better navigation and search display.",
    Status: "Todo",
    Priority: "High",
    Type: "Infrastructure"
  },

  // P2 - Medium Priority (Month 1)
  {
    Name: "SEO P2-1: Expand Guernica Page Content to 800+ Words",
    Description: "Guernica page has only ~400 words (thin content). Expand to 800+ words by adding detailed lot information, infrastructure specs, legal documentation process, area amenities, investment potential, and 6-10 photos.",
    Status: "Todo",
    Priority: "Medium",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P2-2: Add Canonical Tags to All Pages",
    Description: "Add canonical link tags to all pages in metadata to prevent duplicate content issues and consolidate SEO signals.",
    Status: "Todo",
    Priority: "Medium",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P2-3: Optimize H1 Tags with Target Keywords",
    Description: "Update H1 tags to include target keywords: Homepage 'Lotes en Venta en Buenos Aires', Guernica 'Lotes en Guernica - 20 Terrenos con Financiación Directa' for better on-page SEO.",
    Status: "Todo",
    Priority: "Medium",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P2-5: Implement Performance Monitoring (Vercel Analytics)",
    Description: "Install and configure @vercel/analytics and @vercel/speed-insights to track Core Web Vitals (LCP, INP, CLS) and user behavior. Add to root layout.",
    Status: "Todo",
    Priority: "Medium",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P2-6: Create FAQ Section with Schema Markup",
    Description: "Create FAQ section with 10+ common questions about lot purchasing, financing, documentation, construction. Add FAQPage schema markup for rich snippet display in search results.",
    Status: "Todo",
    Priority: "Medium",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P2-7: Audit and Fix Image Alt Text Site-Wide",
    Description: "Audit all images across the site for descriptive alt text. Fix missing or generic alt text ('image', 'photo') with detailed descriptions for accessibility and image SEO.",
    Status: "Todo",
    Priority: "Medium",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P2-8: Add Hreflang Tags for Regional Targeting",
    Description: "Add hreflang tags (es-AR and x-default) to all pages for regional SEO targeting to Argentina.",
    Status: "Todo",
    Priority: "Medium",
    Type: "Infrastructure"
  },

  // P3 - Long-term (Month 2-3)
  {
    Name: "SEO P3-1: Create 'Nosotros' (About Us) Page",
    Description: "Create comprehensive About Us page with company history, founder/team profiles with photos, values, completed projects portfolio, customer testimonials, awards, and community involvement. Critical for E-E-A-T signals and trust.",
    Status: "Todo",
    Priority: "Low",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P3-2: Add Customer Testimonials Section with Schema",
    Description: "Create customer testimonials section with photos, ratings, and Review schema markup. Collect 5-10 real customer testimonials from San Matías and Guernica buyers.",
    Status: "Todo",
    Priority: "Low",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P3-3: Create Area Guide Pages for Local SEO",
    Description: "Create 3 comprehensive area guide pages: 'Vivir en Arroyo de la Cruz', 'Invertir en Exaltación de la Cruz', and 'Guernica: Ubicación y Conectividad'. Include demographics, amenities, transportation, and market trends. Target long-tail local keywords.",
    Status: "Todo",
    Priority: "Low",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P3-4: Implement Blog System for Content Marketing",
    Description: "Set up /blog with categories: Guides, Market Updates, Project Updates, Investment Tips. Plan for 2-4 posts per month to drive organic traffic and establish authority. Set up blog post template with proper schema.",
    Status: "Todo",
    Priority: "Low",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P3-5: Create and Optimize Google Business Profile",
    Description: "Create Google Business Profile for Fitzroya Desarrollos. Add 20+ photos, business hours, services, weekly posts. Set up review collection system. Manage ongoing with weekly updates.",
    Status: "Todo",
    Priority: "Low",
    Type: "Marketing"
  },
  {
    Name: "SEO P3-6: Build Local Citations on Real Estate Directories",
    Description: "Create business listings on ZonaProp, Argenprop, MercadoLibre Inmuebles, Properati, and local directories. Ensure NAP (Name, Address, Phone) consistency across all listings.",
    Status: "Todo",
    Priority: "Low",
    Type: "Marketing"
  },
  {
    Name: "SEO P3-7: Add Privacy Policy and Terms Pages",
    Description: "Create legal pages: Privacy Policy (/privacidad), Terms & Conditions (/terminos), and Legal Notice (/aviso-legal) for compliance with Argentina data protection laws and to build trust.",
    Status: "Todo",
    Priority: "Low",
    Type: "Infrastructure"
  },
  {
    Name: "SEO P3-8: Implement Review Collection System",
    Description: "Set up automated review request system via email 2 weeks after purchase. Create on-site review display with AggregateRating schema. Encourage Google and Facebook reviews.",
    Status: "Todo",
    Priority: "Low",
    Type: "Infrastructure"
  },
];

async function createSEOTickets() {
  try {
    console.log("🎫 Creating SEO Audit Tickets in Airtable...\n");

    let successCount = 0;
    let errorCount = 0;

    for (const ticket of seoTickets) {
      try {
        const record = await tickets.create(ticket);
        console.log(`✅ Created: ${ticket.Name}`);
        console.log(`   ID: ${record.id}`);
        console.log(`   Priority: ${ticket.Priority} | Type: ${ticket.Type}\n`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to create: ${ticket.Name}`);
        console.error(`   Error: ${error instanceof Error ? error.message : String(error)}\n`);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   Total tickets: ${seoTickets.length}`);
    console.log(`   ✅ Successfully created: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log("=".repeat(60));

    if (errorCount > 0) {
      console.log("\n⚠️  Some tickets failed to create. Check the errors above.");
      process.exit(1);
    } else {
      console.log("\n🎉 All SEO tickets created successfully!");
    }

  } catch (error) {
    console.error("❌ Error creating SEO tickets:", error);
    process.exit(1);
  }

  process.exit(0);
}

createSEOTickets();
