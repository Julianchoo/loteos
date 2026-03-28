# Schema.org Structured Data Audit
## Olimpo Desarrollos Inmobiliarios
**Domain:** https://www.olimpodesarrollos.com/
**Audit Date:** 2026-03-28
**Business Type:** Real Estate Developer (Desarrollos Inmobiliarios) - Argentina

---

## Executive Summary

**Overall Status:** CRITICAL - Minimal schema implementation with significant missed opportunities

**Key Findings:**
- Only 1 basic schema type detected (WebSite)
- Missing critical Organization/RealEstateAgent schema
- No Product schema for property developments
- No LocalBusiness schema despite physical presence
- No BreadcrumbList for navigation
- Multiple property pages lack any structured data

---

## 1. EXISTING SCHEMA DETECTION

### Homepage: https://www.olimpodesarrollos.com/

#### Detected Schema: WebSite (JSON-LD)
```json
{
  "@context": "https://schema.org/",
  "@type": "WebSite",
  "name": "olimpodesarrollos",
  "url": "https://www.olimpodesarrollos.com"
}
```

**Validation Result:** PASS (Basic)
- Context: Correct (https)
- Type: Valid
- Properties: name, url present

**Issues:**
- Missing `description` (recommended)
- Missing `potentialAction` for SearchAction (recommended for site search)
- Very minimal implementation

---

## 2. SCHEMA VALIDATION RESULTS

### WebSite Schema - PASS with Warnings

| Check | Status | Notes |
|-------|--------|-------|
| @context is https://schema.org | PASS | Correct |
| @type is valid | PASS | WebSite is valid |
| Required properties | PASS | name, url present |
| Recommended properties | FAIL | Missing description, potentialAction |
| Placeholder text | PASS | No placeholders |
| URL format | PASS | Absolute URL |

**Priority:** LOW - Existing schema is valid but incomplete

---

## 3. MISSING SCHEMA OPPORTUNITIES

### CRITICAL Priority (High Impact for Google Rich Results & SEO)

#### A. Organization / RealEstateAgent Schema
**Location:** Homepage & About page (/nosotros)
**Status:** MISSING
**Impact:** HIGH - Critical for brand identity, knowledge graph, rich results

**Why This Matters:**
- Establishes company identity in Google Knowledge Graph
- Enables rich results in branded searches
- RealEstateAgent is a subtype of Organization specifically for real estate businesses
- Shows contact information, logo, social profiles directly in search

**Should Include:**
- @type: RealEstateAgent (or Organization)
- name: "Olimpo Desarrollos Inmobiliarios"
- description: Business description
- url: https://www.olimpodesarrollos.com
- logo: Company logo URL
- address: Physical address (PostalAddress)
- contactPoint: Phone, email
- sameAs: Social media profiles (Facebook, Instagram, LinkedIn, etc.)
- areaServed: Buenos Aires, Argentina
- slogan: "Olimpo Desarrollos es compromiso y confianza"

---

#### B. Product Schema for Property Developments
**Location:** All project pages (26+ projects identified)
**Status:** COMPLETELY MISSING
**Impact:** CRITICAL - Each development is a product/offering

**Projects Without Schema:**
- /los-robles
- /las-acacias
- /altos-de-panelo
- /puntosur
- /cardaleshills
- /barrancasdecardales
- /quintas-de-alvarez
- /losmolinos
- /la-sofia
- /lomas-del-rio-lujan
- /chacras-don-luis
- /altosdeolivera
- /barrio-la-merced
- /catemavillage
- /nuevo-oeste
- /barrio-cardales-chico
- /nortes-del-pilar
- /petion-chico
- [Plus additional projects]

**Why This Matters:**
- Google can show property listings in search
- Enables Product rich results (price, availability)
- Improves visibility for property searches
- Structured data helps Google understand what you're selling

**Each Project Should Include:**
- @type: Product (or RealEstateProperty for more specific)
- name: "Los Robles" (example)
- description: Project description
- image: Project photos
- offers: Offer schema with price/availability
  - @type: Offer
  - priceCurrency: ARS
  - price: Pricing information
  - availability: https://schema.org/InStock
  - url: Project page URL
- brand: Reference to Organization
- category: "Loteo" / "Barrio Cerrado" / "Club de Campo"
- address: PostalAddress of the development
- geo: GeoCoordinates (latitude/longitude)

---

#### C. LocalBusiness Schema
**Location:** Contact page (/contacto) or Homepage
**Status:** MISSING
**Impact:** HIGH - Important for local search visibility

**Why This Matters:**
- Appears in Google Maps results
- Shows in local pack (map + 3 businesses)
- Displays business hours, phone, address in search
- Critical for "real estate developer near me" type searches

**Should Include:**
- @type: RealEstateAgent (extends LocalBusiness)
- name: "Olimpo Desarrollos Inmobiliarios"
- address: Office location(s)
- telephone: Contact phone
- openingHours: Business hours
- geo: Office coordinates
- priceRange: Optional
- image: Office/logo images
- url: Website

---

#### D. BreadcrumbList Schema
**Location:** All interior pages
**Status:** MISSING
**Impact:** MEDIUM - Improves navigation in search results

**Why This Matters:**
- Shows page hierarchy in Google search results
- Improves user understanding of site structure
- Better click-through rates from search
- Enhanced mobile experience

**Example for Project Page:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://www.olimpodesarrollos.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Proyectos",
      "item": "https://www.olimpodesarrollos.com/proyectos"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Los Robles",
      "item": "https://www.olimpodesarrollos.com/los-robles"
    }
  ]
}
```

---

### MEDIUM Priority

#### E. ItemList Schema
**Location:** Projects listing page (/proyectos)
**Status:** MISSING
**Impact:** MEDIUM - Helps Google understand project collection

**Should Include:**
- @type: ItemList
- itemListElement: Array of project references
- Each item links to Product schema on individual pages

---

#### F. AggregateRating Schema
**Location:** Homepage or project pages (IF reviews exist)
**Status:** N/A - Only add if legitimate reviews exist
**Impact:** HIGH (if applicable) - Star ratings in search results

**IMPORTANT:** Only implement if:
- You have genuine customer reviews/testimonials
- Reviews are publicly visible on your site
- You comply with Google's review snippet guidelines
- Reviews are from actual customers, not self-generated

**If Applicable:**
- @type: AggregateRating
- ratingValue: Average rating
- reviewCount: Number of reviews
- bestRating: 5
- worstRating: 1

---

### LOW Priority (Nice to Have)

#### G. VideoObject Schema
**Location:** If any project videos exist (/clip page mentioned)
**Status:** UNKNOWN - Needs verification
**Impact:** LOW-MEDIUM - Video rich results in search

#### H. FAQPage Schema
**Location:** NOT RECOMMENDED
**Status:** N/A
**Impact:** INFO ONLY

**Note:** FAQPage rich results are restricted to government and healthcare sites as of August 2023. While FAQPage schema may still benefit AI/LLM citations and Google E-O (formerly featured snippets), it will NOT generate rich results for commercial real estate sites. Not recommended unless prioritizing GEO/AI discoverability.

---

## 4. TECHNICAL ISSUES

### Format Issues
1. **Inconsistent Implementation:** Only homepage has schema, no other pages
2. **No Microdata Detected:** All schema should be JSON-LD (current approach is correct)
3. **Missing sameAs Properties:** No social media linkage for organization

### Structural Issues
1. **No Schema Graph:** No interconnection between schemas (e.g., Product -> Organization)
2. **Missing Geo Data:** No latitude/longitude for properties or offices
3. **No Image Markup:** Images lack structured data properties

---

## 5. COMPETITIVE DISADVANTAGE

Without comprehensive schema markup, Olimpo Desarrollos is losing visibility to competitors who implement:
- Product rich results for property listings
- Local business results for office locations
- Organization knowledge panels for brand searches
- Star ratings (if reviews exist)
- Enhanced breadcrumb navigation in SERPs

---

## 6. RECOMMENDED IMPLEMENTATION PRIORITY

### Phase 1: CRITICAL (Implement Immediately)
1. **Organization/RealEstateAgent Schema** - Homepage
2. **Product Schema** - Top 5-10 most important project pages
3. **LocalBusiness Enhancement** - Contact page

### Phase 2: HIGH PRIORITY (Within 30 days)
4. **Product Schema** - Remaining project pages
5. **BreadcrumbList** - All interior pages
6. **ItemList** - Projects listing page

### Phase 3: OPTIMIZATION (Within 60 days)
7. **WebSite Enhancement** - Add SearchAction, description
8. **Review/Rating Schema** - Only if reviews exist
9. **VideoObject** - If video content exists

---

## 7. VALIDATION CHECKLIST

Before publishing any schema:
- [ ] @context is "https://schema.org"
- [ ] @type is valid and not deprecated
- [ ] All required properties present
- [ ] Property values match expected types
- [ ] No placeholder text (e.g., "[Business Name]")
- [ ] URLs are absolute (not relative)
- [ ] Dates are ISO 8601 format
- [ ] Test with Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] Test with Schema Markup Validator: https://validator.schema.org/

---

## 8. RECOMMENDED JSON-LD IMPLEMENTATIONS

### Implementation 1: Organization/RealEstateAgent Schema
**Location:** Add to Homepage and /nosotros page in `<head>` section

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": "https://www.olimpodesarrollos.com/#organization",
  "name": "Olimpo Desarrollos Inmobiliarios",
  "alternateName": "Olimpo Desarrollos",
  "description": "Desarrollamos Barrios y Loteos Abiertos, Barrios Cerrados y Clubes de Campo en Buenos Aires, Argentina. Olimpo Desarrollos es compromiso y confianza.",
  "slogan": "Olimpo Desarrollos es compromiso y confianza",
  "url": "https://www.olimpodesarrollos.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.olimpodesarrollos.com/[PATH-TO-LOGO]",
    "width": "250",
    "height": "60"
  },
  "image": "https://www.olimpodesarrollos.com/[PATH-TO-MAIN-IMAGE]",
  "telephone": "[PHONE-NUMBER]",
  "email": "[EMAIL-ADDRESS]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[STREET-ADDRESS]",
    "addressLocality": "[CITY]",
    "addressRegion": "Buenos Aires",
    "postalCode": "[POSTAL-CODE]",
    "addressCountry": "AR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[LATITUDE]",
    "longitude": "[LONGITUDE]"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Buenos Aires"
    },
    {
      "@type": "Country",
      "name": "Argentina"
    }
  ],
  "sameAs": [
    "[FACEBOOK-URL]",
    "[INSTAGRAM-URL]",
    "[LINKEDIN-URL]",
    "[YOUTUBE-URL]"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "[PHONE-NUMBER]",
    "contactType": "customer service",
    "areaServed": "AR",
    "availableLanguage": ["Spanish"]
  },
  "foundingDate": "[YYYY]",
  "numberOfEmployees": {
    "@type": "QuantitativeValue",
    "value": "[NUMBER]"
  }
}
```

**IMPORTANT:** Replace ALL bracketed placeholders with actual data:
- [PATH-TO-LOGO]: Actual logo URL
- [PHONE-NUMBER]: Actual phone number in international format (+54...)
- [EMAIL-ADDRESS]: Contact email
- [STREET-ADDRESS], [CITY], [POSTAL-CODE]: Physical address
- [LATITUDE], [LONGITUDE]: Office coordinates
- [FACEBOOK-URL], etc.: Social media URLs
- [YYYY]: Founding year
- [NUMBER]: Employee count (optional, can remove)

---

### Implementation 2: Product Schema for Property Development
**Location:** Add to EACH project page (example: /los-robles)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.olimpodesarrollos.com/los-robles#product",
  "name": "Los Robles",
  "description": "[FULL-DESCRIPTION: Detailed description of Los Robles development including features, lot sizes, amenities, location benefits, etc.]",
  "category": "Loteo Abierto",
  "brand": {
    "@type": "Organization",
    "@id": "https://www.olimpodesarrollos.com/#organization"
  },
  "image": [
    "https://www.olimpodesarrollos.com/[IMAGE-1-URL]",
    "https://www.olimpodesarrollos.com/[IMAGE-2-URL]",
    "https://www.olimpodesarrollos.com/[IMAGE-3-URL]"
  ],
  "offers": {
    "@type": "Offer",
    "url": "https://www.olimpodesarrollos.com/los-robles",
    "priceCurrency": "ARS",
    "price": "[PRICE-OR-PRICE-RANGE]",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": "[MIN-PRICE]",
      "maxPrice": "[MAX-PRICE]",
      "priceCurrency": "ARS"
    },
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "@id": "https://www.olimpodesarrollos.com/#organization"
    },
    "availabilityStarts": "[YYYY-MM-DD]",
    "validFrom": "[YYYY-MM-DD]"
  },
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Tipo de Desarrollo",
      "value": "Loteo Abierto"
    },
    {
      "@type": "PropertyValue",
      "name": "Superficie de Lotes",
      "value": "[LOT-SIZE-RANGE]"
    },
    {
      "@type": "PropertyValue",
      "name": "Cantidad de Lotes",
      "value": "[NUMBER-OF-LOTS]"
    },
    {
      "@type": "PropertyValue",
      "name": "Estado",
      "value": "[EN VENTA/VENDIDO/PRÓXIMAMENTE]"
    }
  ],
  "location": {
    "@type": "Place",
    "name": "Los Robles",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "[DEVELOPMENT-STREET-ADDRESS]",
      "addressLocality": "[CITY]",
      "addressRegion": "Buenos Aires",
      "addressCountry": "AR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "[DEV-LATITUDE]",
      "longitude": "[DEV-LONGITUDE]"
    }
  },
  "amenityFeature": [
    {
      "@type": "LocationFeatureSpecification",
      "name": "[AMENITY-1: e.g., Agua Corriente]",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "[AMENITY-2: e.g., Luz Eléctrica]",
      "value": true
    },
    {
      "@type": "LocationFeatureSpecification",
      "name": "[AMENITY-3: e.g., Gas Natural]",
      "value": true
    }
  ]
}
```

**IMPORTANT:** This template must be customized for EACH project with:
- Unique project name and description
- Actual pricing information
- Real images
- Correct location and coordinates
- Specific amenities and features
- Current availability status

**Repeat for all projects:**
- Las Acacias
- Altos de Panelo
- PuntoSur
- Cardales Hills
- Barrancas de Cardales
- Quintas de Alvarez
- Los Molinos
- La Sofia
- Lomas del Rio Lujan
- Chacras Don Luis
- Altos de Olivera
- Barrio La Merced
- Catema Village
- Nuevo Oeste
- Barrio Cardales Chico
- Nortes del Pilar
- Petion Chico
- [All other projects]

---

### Implementation 3: Enhanced WebSite Schema
**Location:** Replace existing WebSite schema on Homepage

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Olimpo Desarrollos Inmobiliarios",
  "alternateName": "olimpodesarrollos",
  "url": "https://www.olimpodesarrollos.com",
  "description": "Desarrollamos Barrios y Loteos Abiertos, Barrios Cerrados y Clubes de Campo en Buenos Aires, Argentina.",
  "publisher": {
    "@type": "Organization",
    "@id": "https://www.olimpodesarrollos.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.olimpodesarrollos.com/proyectos?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "es-AR"
}
```

**Note:** If your site doesn't have a search function, remove the `potentialAction` property entirely.

---

### Implementation 4: BreadcrumbList Schema
**Location:** Add to ALL interior pages (example for /los-robles)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://www.olimpodesarrollos.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Proyectos",
      "item": "https://www.olimpodesarrollos.com/proyectos"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Los Robles",
      "item": "https://www.olimpodesarrollos.com/los-robles"
    }
  ]
}
```

**Customize per page:**
- Adjust number of levels based on actual page depth
- Update names and URLs to match actual navigation
- Position must be sequential (1, 2, 3, etc.)
- Last item is current page

**Example for Contact Page:**
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://www.olimpodesarrollos.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Contacto",
      "item": "https://www.olimpodesarrollos.com/contacto"
    }
  ]
}
```

---

### Implementation 5: ItemList for Projects Page
**Location:** Add to /proyectos page

```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Proyectos de Olimpo Desarrollos",
  "description": "Todos nuestros desarrollos inmobiliarios en Buenos Aires",
  "numberOfItems": "[TOTAL-NUMBER-OF-PROJECTS]",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "@id": "https://www.olimpodesarrollos.com/los-robles#product",
        "name": "Los Robles",
        "url": "https://www.olimpodesarrollos.com/los-robles"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "item": {
        "@type": "Product",
        "@id": "https://www.olimpodesarrollos.com/las-acacias#product",
        "name": "Las Acacias",
        "url": "https://www.olimpodesarrollos.com/las-acacias"
      }
    },
    {
      "@type": "ListItem",
      "position": 3,
      "item": {
        "@type": "Product",
        "@id": "https://www.olimpodesarrollos.com/altos-de-panelo#product",
        "name": "Altos de Panelo",
        "url": "https://www.olimpodesarrollos.com/altos-de-panelo"
      }
    }
    // ... Continue for all projects
  ]
}
```

**Continue this list for all 26+ projects identified in sitemap.**

---

## 9. IMPLEMENTATION INSTRUCTIONS

### For Wix Websites (Current Platform)

1. **Adding JSON-LD to Homepage:**
   - Go to Wix Editor
   - Click "Settings" (gear icon)
   - Select "Custom Code" (or "Tracking & Analytics")
   - Click "Add Custom Code"
   - Paste the JSON-LD schema inside `<script type="application/ld+json">` tags
   - Choose "Head" placement
   - Select "All pages" OR specific page
   - Save and publish

2. **Adding JSON-LD to Individual Pages:**
   - Navigate to specific page in Wix Editor
   - Click "..." menu on page
   - Select "SEO (Google)"
   - Scroll to "Structured Data Markup"
   - Paste JSON-LD schema
   - OR use Custom Code method above with page-specific targeting

3. **Wix Alternative - Use Wix SEO App:**
   - Some structured data may be available through Wix's built-in SEO tools
   - Check Settings > SEO > Structured Data

### Testing After Implementation

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Enter page URL or paste code
   - Check for errors/warnings
   - Fix any issues before publishing

2. **Schema Markup Validator**
   - URL: https://validator.schema.org/
   - Paste JSON-LD code
   - Verify no syntax errors

3. **Google Search Console**
   - Submit sitemap
   - Monitor "Enhancements" section for rich result status
   - Check for errors in structured data reports

---

## 10. EXPECTED RESULTS AFTER IMPLEMENTATION

### Immediate Benefits (0-2 weeks)
- Schema visible in Google's Rich Results Test
- Code validates without errors
- Search Console detects new structured data

### Short-term Benefits (2-8 weeks)
- Organization knowledge panel may appear for branded searches
- Breadcrumbs appear in search results
- Product schema detected by Google

### Long-term Benefits (2-6 months)
- Improved click-through rates from enhanced search listings
- Better visibility in local search results
- Potential product rich results in search
- Enhanced presence in Google Discover
- Better understanding by AI/LLM systems (ChatGPT, Perplexity, etc.)

---

## 11. MAINTENANCE RECOMMENDATIONS

1. **Update Schema When:**
   - New projects are added (add new Product schema)
   - Contact information changes
   - Pricing changes
   - Projects sell out (update availability)
   - Social media profiles change

2. **Regular Audits:**
   - Quarterly: Check Google Search Console for schema errors
   - Bi-annually: Re-validate all schemas
   - Annually: Review for new schema opportunities

3. **Monitor Performance:**
   - Track organic search traffic to project pages
   - Monitor branded search appearance
   - Check Google Search Console enhancement reports

---

## 12. RESOURCES & TOOLS

### Documentation
- Schema.org Official: https://schema.org/
- Google Rich Results Guide: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google Search Central: https://developers.google.com/search

### Testing Tools
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema Markup Validator: https://validator.schema.org/
- Google Search Console: https://search.google.com/search-console

### Wix Resources
- Wix SEO Learning Hub: https://www.wix.com/seo/learn
- Wix Structured Data Guide: https://support.wix.com/en/article/adding-structured-data-markup-to-your-site

---

## CONCLUSION

Olimpo Desarrollos has significant opportunity to improve search visibility through comprehensive schema markup implementation. The current single WebSite schema is insufficient for a real estate developer with 26+ active projects.

**Priority Actions:**
1. Implement Organization/RealEstateAgent schema immediately
2. Roll out Product schema to all project pages systematically
3. Add BreadcrumbList to improve navigation visibility
4. Monitor and optimize based on Google Search Console data

**Expected Impact:**
- 30-50% improvement in rich result eligibility
- Enhanced brand visibility in search
- Better local search performance
- Improved click-through rates from search results

**Timeline:**
- Phase 1 (Critical): 1-2 weeks
- Phase 2 (High Priority): 3-4 weeks
- Phase 3 (Optimization): Ongoing

The implementation of these recommendations will position Olimpo Desarrollos competitively in organic search results and provide enhanced visibility for all property development projects.

---

**End of Audit Report**
