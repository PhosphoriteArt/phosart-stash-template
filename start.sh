#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="${ROOT_DIR}/.bin"

log() {
	printf '[start] %s\n' "$*"
}

die() {
	printf '[start] %s\n' "$*" >&2
	exit 1
}

download() {
	local url="$1"
	local out="$2"

	if command -v curl >/dev/null 2>&1; then
		curl -fsSL "$url" -o "$out"
	elif command -v wget >/dev/null 2>&1; then
		wget -qO "$out" "$url"
	else
		die "Missing curl or wget; cannot download ${url}"
	fi
}

detect_platform() {
	local uname_s
	local uname_m
	uname_s="$(uname -s)"
	uname_m="$(uname -m)"

	case "$uname_s" in
		Linux) OS_ID="linux" ;;
		Darwin) OS_ID="darwin" ;;
		*) die "Unsupported OS: ${uname_s}" ;;
	esac

	case "$uname_m" in
		x86_64|amd64) ARCH_ID="x64" ;;
		arm64|aarch64) ARCH_ID="arm64" ;;
		*) die "Unsupported architecture: ${uname_m}" ;;
	esac

	PLATFORM="${OS_ID}-${ARCH_ID}"
}

ensure_node() {
	local node_dir="${BIN_DIR}/node-${PLATFORM}"
	local node_bin="${node_dir}/bin/node"

	if [ -x "$node_bin" ]; then
		local major
		major="$("$node_bin" -p "process.versions.node.split('.')[0]")"
		if [ "$major" = "22" ]; then
			NODE_DIR="$node_dir"
			return
		fi
	fi

	log "Installing Node.js 22 for ${PLATFORM}..."
	mkdir -p "$BIN_DIR"
	local tmp
	tmp="$(mktemp -d)"
	local dist="https://nodejs.org/dist/latest-v22.x"
	local shasums="${tmp}/SHASUMS256.txt"
	download "${dist}/SHASUMS256.txt" "$shasums"

	local archive
	archive="$(awk "/${PLATFORM}\\.tar\\.(xz|gz)/ {print \$2; exit}" "$shasums")"
	[ -n "$archive" ] || die "Node.js archive for ${PLATFORM} not found."

	download "${dist}/${archive}" "${tmp}/${archive}"

	case "$archive" in
		*.tar.xz) tar -xJf "${tmp}/${archive}" -C "$tmp" ;;
		*.tar.gz) tar -xzf "${tmp}/${archive}" -C "$tmp" ;;
		*) die "Unsupported Node.js archive format: ${archive}" ;;
	esac

	local folder="${archive%.tar.xz}"
	folder="${folder%.tar.gz}"
	rm -rf "$node_dir"
	mv "${tmp}/${folder}" "$node_dir"
	rm -rf "$tmp"

	NODE_DIR="$node_dir"
}

resolve_pnpm_version() {
	local pm_version=""
	if [ -f "${ROOT_DIR}/package.json" ]; then
		pm_version="$("${NODE_DIR}/bin/node" -p "require('${ROOT_DIR}/package.json').packageManager || ''" 2>/dev/null || true)"
	fi

	if [[ "$pm_version" == pnpm@* ]]; then
		pm_version="${pm_version#pnpm@}"
		pm_version="${pm_version%%+*}"
		printf '%s' "$pm_version"
		return
	fi

	printf '%s' "10.26.2"
}

ensure_pnpm() {
	local pnpm_bin="${NODE_DIR}/bin/pnpm"
	if [ -x "$pnpm_bin" ]; then
		return
	fi

	local pnpm_version
	pnpm_version="$(resolve_pnpm_version)"
	log "Installing pnpm ${pnpm_version}..."
	export NPM_CONFIG_PREFIX="$NODE_DIR"
	"${NODE_DIR}/bin/npm" install -g "pnpm@${pnpm_version}"
}

ensure_git() {
	local git_dir="${BIN_DIR}/git-${PLATFORM}"
	local git_bin="${git_dir}/bin/git"

	if [ -x "$git_bin" ]; then
		GIT_DIR="$git_dir"
		return
	fi

	local git_version="${GIT_VERSION:-2.47.1}"
	log "Installing Git ${git_version} for ${PLATFORM}..."
	mkdir -p "$BIN_DIR"
	local tmp
	tmp="$(mktemp -d)"

	local archive="git-${git_version}.tar.xz"
	local url="${GIT_BASE_URL:-https://mirrors.edge.kernel.org/pub/software/scm/git}/${archive}"
	download "$url" "${tmp}/${archive}"
	tar -xJf "${tmp}/${archive}" -C "$tmp"

	local src_dir="${tmp}/git-${git_version}"
	[ -d "$src_dir" ] || die "Git source directory not found after extract."

	command -v make >/dev/null 2>&1 || die "Missing make; cannot build Git."
	command -v cc >/dev/null 2>&1 || command -v gcc >/dev/null 2>&1 || die "Missing C compiler; cannot build Git."

	local jobs="4"
	if command -v nproc >/dev/null 2>&1; then
		jobs="$(nproc)"
	elif command -v sysctl >/dev/null 2>&1; then
		jobs="$(sysctl -n hw.ncpu)"
	fi

	(
		cd "$src_dir"
		if [ ! -x "./configure" ]; then
			make configure
		fi
		./configure --prefix="$git_dir"
		make -j"$jobs"
		make install
	)

	rm -rf "$tmp"
	GIT_DIR="$git_dir"
}

main() {
	detect_platform
	ensure_node
	ensure_pnpm
	ensure_git

	export PATH="${GIT_DIR}/bin:${NODE_DIR}/bin:${PATH}"
	cd "$ROOT_DIR"
	pnpm install
	pnpm run editpreview
}

main "$@"
