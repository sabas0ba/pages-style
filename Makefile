SHELL := /usr/bin/env bash
.DEFAULT_GOAL := help

DOTFILES_REPO ?= ../dotfiles

.PHONY: help
help: ## 利用可能な操作を表示する
	@printf '使用方法: make <target>\n\n'
	@printf '  %-12s %s\n' 'check' 'dotfiles 環境を確認して全検査を実行'
	@printf '  %-12s %s\n' 'env' 'dotfiles 開発環境を確認'
	@printf '  %-12s %s\n' 'test' '静的検査を実行'
	@printf '  %-12s %s\n' 'pages' 'GitHub Pages artifact を生成'
	@printf '  %-12s %s\n' 'fmt' 'shell script を整形'

.PHONY: check
check: env test ## dotfiles 環境を確認して全検査を実行

.PHONY: env
env: ## dotfiles 開発環境を確認する
	bash "$(DOTFILES_REPO)/scripts/check-env.sh"

.PHONY: test
test: ## 静的検査を実行する
	shellcheck scripts/*.sh tests/*.sh
	shfmt --diff --indent 2 --case-indent scripts/*.sh tests/*.sh
	yq eval '.' .github/workflows/*.yml > /dev/null
	bash tests/check-static.sh
	bash scripts/build-pages.sh
	bash tests/check-pages.sh
	bash tests/check-workflows.sh

.PHONY: pages
pages: ## GitHub Pages artifact を生成する
	bash scripts/build-pages.sh

.PHONY: fmt
fmt: ## shell script を整形する
	shfmt --write --indent 2 --case-indent scripts/*.sh tests/*.sh
