{ pkgs, src }:

let
  mkCheck =
    name: deps: script:
    pkgs.runCommandLocal "check-${name}" { nativeBuildInputs = deps; } ''
      cd ${src}
      ${script}
      touch "$out"
    '';
in
{
  nixfmt = mkCheck "nixfmt" [
    pkgs.findutils
    pkgs.nixfmt
  ] ''
    find . -type f -name '*.nix' -exec nixfmt --check {} +
  '';

  statix = mkCheck "statix" [ pkgs.statix ] ''
    statix check .
  '';

  deadnix = mkCheck "deadnix" [ pkgs.deadnix ] ''
    deadnix --fail .
  '';

  shellcheck = mkCheck "shellcheck" [ pkgs.shellcheck ] ''
    shellcheck scripts/*.sh
    shellcheck --shell=bash .envrc
  '';

  shfmt = mkCheck "shfmt" [ pkgs.shfmt ] ''
    shfmt --diff --indent 2 --case-indent scripts/*.sh
  '';

  static = mkCheck "static" [
    pkgs.bashInteractive
    pkgs.coreutils
    pkgs.gnugrep
  ] ''
    bash scripts/check-static.sh
  '';
}
