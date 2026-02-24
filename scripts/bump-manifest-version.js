#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const CHROME_MAX_PART = 65535;
const VERSION_PART_BASE = 100;
const DEFAULT_PARTS = [1, 0, 0]; // major.minor.patch

function fail(message) {
  console.error(`[bump-manifest-version] ${message}`);
  process.exit(1);
}

function parseVersion(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return [...DEFAULT_PARTS];
  }

  const rawParts = value.trim().split(".");
  if (rawParts.length < 1 || rawParts.length > 3) {
    fail(`Unsupported version format "${value}". Expected major.minor.patch (up to 3 numeric parts).`);
  }

  const parts = rawParts.map((part) => {
    if (!/^\d+$/.test(part)) {
      fail(`Invalid version part "${part}" in "${value}".`);
    }
    const parsed = Number(part);
    if (!Number.isInteger(parsed) || parsed < 0) {
      fail(`Version part out of range in "${value}".`);
    }
    return parsed;
  });

  while (parts.length < 3) {
    parts.push(0);
  }

  const [major, minor, patch] = parts;
  if (major > CHROME_MAX_PART) {
    fail(`Major version out of Chrome range (0-${CHROME_MAX_PART}) in "${value}".`);
  }
  if (minor >= VERSION_PART_BASE || patch >= VERSION_PART_BASE) {
    fail(
      `Minor/patch must be within 0-${VERSION_PART_BASE - 1} for base-${VERSION_PART_BASE} rollover in "${value}".`
    );
  }

  return parts;
}

function incrementVersion(parts) {
  const next = [...parts];
  next[2] += 1;

  if (next[2] >= VERSION_PART_BASE) {
    next[2] = 0;
    next[1] += 1;
  }

  if (next[1] >= VERSION_PART_BASE) {
    next[1] = 0;
    next[0] += 1;
  }

  if (next[0] > CHROME_MAX_PART) {
    fail(`Version overflow. Major version cannot exceed ${CHROME_MAX_PART}.`);
  }

  return next;
}

function parseArgs(argv) {
  const args = Array.isArray(argv) ? [...argv] : [];
  let dryRun = false;
  let fromVersion = "";

  for (let index = 0; index < args.length; index += 1) {
    const arg = String(args[index] || "");
    if (!arg) {
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--from") {
      const candidate = String(args[index + 1] || "").trim();
      if (!candidate) {
        fail('Missing value for "--from". Example: --from 1.99.99');
      }
      fromVersion = candidate;
      index += 1;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/bump-manifest-version.js [--dry-run] [--from <major.minor.patch>]");
      process.exit(0);
    }
    fail(`Unknown argument "${arg}". Use --help for usage.`);
  }

  return { dryRun, fromVersion };
}

function main() {
  const { dryRun, fromVersion } = parseArgs(process.argv.slice(2));
  const manifestPath = path.resolve(__dirname, "..", "manifest.json");
  const manifestRaw = fs.readFileSync(manifestPath, "utf8");
  const manifest = JSON.parse(manifestRaw);

  const currentVersion = fromVersion || manifest.version || DEFAULT_PARTS.join(".");
  const parts = parseVersion(currentVersion);
  const nextVersion = incrementVersion(parts).join(".");

  if (!fromVersion && !dryRun) {
    manifest.version = nextVersion;
    manifest.version_name = nextVersion;
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  }

  const suffix = fromVersion || dryRun ? " (dry-run)" : "";
  console.log(`[bump-manifest-version] ${currentVersion} -> ${nextVersion}${suffix}`);
}

main();
