SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help
NIX ?= nix

.PHONY: help
help: ## 利用可能な操作を表示する
	@printf '使用方法: make <target>\n\n'
	@printf '  %-12s %s\n' 'check' 'すべての検査を実行'
	@printf '  %-12s %s\n' 'env' '開発環境を確認'
	@printf '  %-12s %s\n' 'fmt' 'Nix と shell script を整形'

.PHONY: check
check: ## すべての検査を実行する
	$(NIX) flake check
	scripts/check-env.sh

.PHONY: env
env: ## 開発環境を確認する
	scripts/check-env.sh

.PHONY: fmt
fmt: ## Nix と shell script を整形する
	$(NIX) fmt
	shfmt --write --indent 2 --case-indent scripts/*.sh
