const fs = require("node:fs")
const path = require("node:path")
const { execSync } = require("node:child_process")

const projectRoot = path.resolve(__dirname, "..")
const publicDir = path.join(projectRoot, "public")

function getBaseUrl() {
    const baseUrlFromEnv = process.env.BASE_URL
    if (baseUrlFromEnv) {
        return `https://${baseUrlFromEnv.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
    }
    return "https://fusiongenerator.fun"
}

function getIsoDateFromTimestampMs(timestampMs) {
    return new Date(timestampMs).toISOString().split("T")[0]
}

function tryGetGitLastCommitDate(filePath) {
    const gitPath = filePath.replace(/\\/g, "/")
    try {
        const output = execSync(`git log -1 --format=%cs -- "${gitPath}"`, {
            cwd: projectRoot,
            stdio: ["ignore", "pipe", "ignore"],
        })
            .toString()
            .trim()
        return output || null
    } catch {
        return null
    }
}

function getFileMtimeDate(filePath) {
    try {
        const stat = fs.statSync(path.join(projectRoot, filePath))
        return getIsoDateFromTimestampMs(stat.mtimeMs)
    } catch {
        return null
    }
}

function getLastModifiedForFiles(filePaths) {
    const dates = filePaths.map((p) => tryGetGitLastCommitDate(p) || getFileMtimeDate(p)).filter(Boolean)
    if (dates.length === 0) return getIsoDateFromTimestampMs(Date.now())
    return dates.sort().at(-1)
}

function escapeXml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;")
}

const routes = [
    { route: "/", files: ["app/page.tsx"], changefreq: "weekly", priority: 1.0 },
    { route: "/dragon-ball", files: ["app/dragon-ball/page.tsx"], changefreq: "weekly", priority: 0.7 },
    { route: "/pokemon", files: ["app/pokemon/page.tsx"], changefreq: "weekly", priority: 0.7 },
    { route: "/ai", files: ["app/ai/page.tsx"], changefreq: "weekly", priority: 0.7 },
    { route: "/gallery", files: ["app/gallery/page.tsx"], changefreq: "weekly", priority: 0.7 },
    { route: "/blog", files: ["app/blog/page.tsx"], changefreq: "weekly", priority: 0.7 },
    { route: "/blog/top-dragon-ball-fusions", files: ["app/blog/top-dragon-ball-fusions/page.tsx"], changefreq: "monthly", priority: 0.6 },
    { route: "/blog/pokemon-fusion-technology", files: ["app/blog/pokemon-fusion-technology/page.tsx"], changefreq: "monthly", priority: 0.6 },
    { route: "/blog/fusion-design-tips", files: ["app/blog/fusion-design-tips/page.tsx"], changefreq: "monthly", priority: 0.6 },
    { route: "/pricing", files: ["app/pricing/page.tsx", "app/pricing/client-page.tsx"], changefreq: "monthly", priority: 0.7 },
    { route: "/about", files: ["app/about/page.tsx", "app/about/client-page.tsx"], changefreq: "monthly", priority: 0.7 },
    { route: "/contact", files: ["app/contact/page.tsx", "app/contact/client-page.tsx"], changefreq: "monthly", priority: 0.7 },
    { route: "/privacy", files: ["app/privacy/page.tsx", "app/privacy/client-page.tsx"], changefreq: "yearly", priority: 0.3 },
    { route: "/terms", files: ["app/terms/page.tsx", "app/terms/client-page.tsx"], changefreq: "yearly", priority: 0.3 },
]

function buildSitemapXml({ baseUrl }) {
    const itemsXml = routes
        .map((entry) => {
            const lastmod = getLastModifiedForFiles(entry.files)
            const loc = `${baseUrl}${entry.route}`
            return [
                "  <url>",
                `    <loc>${escapeXml(loc)}</loc>`,
                `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
                `    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`,
                `    <priority>${entry.priority.toFixed(1)}</priority>`,
                "  </url>",
            ].join("\n")
        })
        .join("\n")

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        itemsXml,
        "</urlset>",
        "",
    ].join("\n")
}

function main() {
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true })
    }
    const baseUrl = getBaseUrl()
    const xml = buildSitemapXml({ baseUrl })
    const outputPath = path.join(publicDir, "sitemap.xml")
    fs.writeFileSync(outputPath, xml, "utf8")
    process.stdout.write(`Generated ${outputPath}\n`)
}

main()
