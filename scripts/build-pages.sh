#!/usr/bin/env bash
set -euo pipefail

script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
repository_root=$(cd -- "$script_dir/.." && pwd)
cd "$repository_root"

# 生成物は git ignored の固定ディレクトリに限定する。
output_dir=.work/pages
rm -rf -- "$output_dir"
mkdir -p "$output_dir/assets"

cp examples/*.html "$output_dir/"
cp examples/assets/theme.js "$output_dir/assets/theme.js"
cp src/saba.css "$output_dir/assets/saba.css"
cp src/saba-sea.css "$output_dir/assets/saba-sea.css"
cp src/saba-sea.js "$output_dir/assets/saba-sea.js"
cp LICENSE "$output_dir/LICENSE.txt"

for html_file in "$output_dir"/*.html; do
  sed -i 's#href="../src/saba.css"#href="assets/saba.css"#' "$html_file"
  sed -i 's#href="../src/saba-sea.css"#href="assets/saba-sea.css"#' "$html_file"
  sed -i 's#src="../src/saba-sea.js"#src="assets/saba-sea.js"#' "$html_file"
done

: >"$output_dir/.nojekyll"

printf 'Pages artifact: %s\n' "$repository_root/$output_dir"
