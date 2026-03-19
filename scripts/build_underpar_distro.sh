#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_path="$repo_root/underpar_distro.zip"
archive_root_name="underpar-distro"
staging_dir="$(mktemp -d "${TMPDIR:-/tmp}/underpar-distro.XXXXXX")"

cleanup() {
  rm -rf "$staging_dir"
}

trap cleanup EXIT

cd "$repo_root"
find "$repo_root" -maxdepth 1 -type f -name '*.zip' ! -name "$(basename "$output_path")" -delete
rm -f "$output_path"

mkdir -p "$staging_dir/$archive_root_name"

while IFS= read -r -d '' tracked_path; do
  source_path="$repo_root/$tracked_path"
  target_path="$staging_dir/$archive_root_name/$tracked_path"
  mkdir -p "$(dirname "$target_path")"
  if [[ -e "$source_path" ]]; then
    cp -p "$source_path" "$target_path"
  else
    git checkout-index --force --prefix="$staging_dir/$archive_root_name/" -- "$tracked_path"
  fi
done < <(git ls-files -z)

if [[ ! -d "$staging_dir/$archive_root_name" ]]; then
  echo "No repository files available to package." >&2
  exit 1
fi

rm -rf \
  "$staging_dir/$archive_root_name/.githooks" \
  "$staging_dir/$archive_root_name/scripts" \
  "$staging_dir/$archive_root_name/tests"
rm -f "$staging_dir/$archive_root_name/AGENTS.md"

find "$staging_dir/$archive_root_name" \( -name '*.zip' -o -name '.DS_Store' \) -delete

(
  cd "$staging_dir"
  zip -q -r -9 "$output_path" "$archive_root_name"
)

printf '%s\n' "$output_path"
