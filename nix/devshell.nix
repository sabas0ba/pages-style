{ pkgs }:

pkgs.mkShellNoCC {
  name = "pages-style";
  packages = import ./packages.nix { inherit pkgs; };

  env = {
    LC_ALL = "C.UTF-8";
    PAGES_STYLE_ENV = "nix-develop";
  };

  shellHook = ''
    echo "pages-style dev shell (${pkgs.stdenv.hostPlatform.system})"
    echo "  make check: 検査を実行"
  '';
}
