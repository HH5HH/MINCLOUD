#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${ROOT}" ]]; then
  echo "error: not inside a git repository" >&2
  exit 1
fi
cd "$ROOT"

MANIFEST_PATH="manifest.json"

usage() {
  cat <<USAGE
Usage: check_manifest_version_bump.sh [--staged] [--base-ref <ref>] [--head-ref <ref>]

Modes:
  --staged                 Check staged changes in the index (pre-commit style).
  --base-ref <ref>         Base ref for range checks (CI style). Default: HEAD~1
  --head-ref <ref>         Head ref for range checks (CI style). Default: HEAD

Behavior:
  - Uses the same trigger boundaries as auto_bump_manifest_version.sh.
  - Fails when trigger files changed but manifest version did not change.
  - Also validates version_name matches version in the checked manifest.
USAGE
}

mode="range"
base_ref=""
head_ref=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --staged)
      mode="staged"
      shift
      ;;
    --base-ref)
      [[ $# -ge 2 ]] || { echo "error: --base-ref requires a value" >&2; exit 1; }
      base_ref="$2"
      shift 2
      ;;
    --head-ref)
      [[ $# -ge 2 ]] || { echo "error: --head-ref requires a value" >&2; exit 1; }
      head_ref="$2"
      shift 2
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      echo "error: unknown argument '$1'" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ "$mode" == "staged" && ( -n "$base_ref" || -n "$head_ref" ) ]]; then
  echo "error: --staged cannot be combined with --base-ref/--head-ref" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "error: jq is required for manifest version checks" >&2
  exit 1
fi

trigger_file() {
  local path="$1"

  case "$path" in
    .git/*|.githooks/*|scripts/*)
      return 1
      ;;
  esac

  case "$path" in
    manifest.json|.DS_Store)
      return 1
      ;;
  esac

  case "$path" in
    docs/*|*/docs/*)
      return 1
      ;;
  esac

  case "$path" in
    *.zip|*.md|*.MD)
      return 1
      ;;
  esac

  return 0
}

read_manifest_field_from_json() {
  local json="$1"
  local field="$2"
  printf '%s' "$json" | jq -r --arg field "$field" '.[$field] // empty'
}

changed_files=()
if [[ "$mode" == "staged" ]]; then
  while IFS= read -r line; do
    changed_files+=("$line")
  done < <(git diff --cached --name-only --diff-filter=ACMR)
else
  base_ref="${base_ref:-HEAD~1}"
  head_ref="${head_ref:-HEAD}"
  git rev-parse --verify "$base_ref" >/dev/null 2>&1 || {
    echo "error: unable to resolve base ref '$base_ref'" >&2
    exit 1
  }
  git rev-parse --verify "$head_ref" >/dev/null 2>&1 || {
    echo "error: unable to resolve head ref '$head_ref'" >&2
    exit 1
  }
  while IFS= read -r line; do
    changed_files+=("$line")
  done < <(git diff --name-only --diff-filter=ACMR "$base_ref" "$head_ref")
fi

has_trigger_changes=0
if [[ ${#changed_files[@]} -gt 0 ]]; then
  for path in "${changed_files[@]}"; do
    [[ -n "$path" ]] || continue
    if trigger_file "$path"; then
      has_trigger_changes=1
      break
    fi
  done
fi

if [[ "$has_trigger_changes" -ne 1 ]]; then
  echo "manifest-version-check: no triggering UnderPAR file changes detected; skipping."
  exit 0
fi

if [[ "$mode" == "staged" ]]; then
  head_manifest="$(git show "HEAD:${MANIFEST_PATH}" 2>/dev/null || true)"
  staged_manifest="$(git show ":${MANIFEST_PATH}" 2>/dev/null || true)"

  if [[ -z "$staged_manifest" ]]; then
    echo "error: manifest.json is not staged. Stage a version bump before commit." >&2
    exit 1
  fi

  base_version="$(read_manifest_field_from_json "$head_manifest" "version")"
  staged_version="$(read_manifest_field_from_json "$staged_manifest" "version")"
  staged_version_name="$(read_manifest_field_from_json "$staged_manifest" "version_name")"

  if [[ -z "$staged_version" ]]; then
    echo "error: staged manifest.json is missing version." >&2
    exit 1
  fi
  if [[ "$staged_version_name" != "$staged_version" ]]; then
    echo "error: staged manifest version_name ($staged_version_name) does not match version ($staged_version)." >&2
    exit 1
  fi
  if [[ -n "$base_version" && "$staged_version" == "$base_version" ]]; then
    echo "error: trigger files changed but manifest version did not change ($staged_version)." >&2
    exit 1
  fi

  echo "manifest-version-check: PASS (staged manifest version $staged_version)."
  exit 0
fi

base_manifest="$(git show "${base_ref}:${MANIFEST_PATH}" 2>/dev/null || true)"
head_manifest="$(git show "${head_ref}:${MANIFEST_PATH}" 2>/dev/null || true)"

base_version="$(read_manifest_field_from_json "$base_manifest" "version")"
head_version="$(read_manifest_field_from_json "$head_manifest" "version")"
head_version_name="$(read_manifest_field_from_json "$head_manifest" "version_name")"

if [[ -z "$head_version" ]]; then
  echo "error: ${head_ref}:${MANIFEST_PATH} is missing version." >&2
  exit 1
fi
if [[ "$head_version_name" != "$head_version" ]]; then
  echo "error: ${head_ref}:${MANIFEST_PATH} has version_name ($head_version_name) that does not match version ($head_version)." >&2
  exit 1
fi
if [[ -n "$base_version" && "$head_version" == "$base_version" ]]; then
  echo "error: trigger files changed between ${base_ref}..${head_ref}, but manifest version stayed $head_version." >&2
  exit 1
fi

echo "manifest-version-check: PASS (${base_ref}:${base_version:-none} -> ${head_ref}:${head_version})."
