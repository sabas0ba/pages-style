# 開発シェルで使用するツールの単一情報源。
{ pkgs }:

with pkgs;
[
  bashInteractive
  coreutils
  findutils
  git
  gnumake
  gnugrep
  gnused
  ripgrep
  shellcheck
  shfmt
]
