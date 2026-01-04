$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$BinDir = Join-Path $Root ".bin"
New-Item -ItemType Directory -Force -Path $BinDir | Out-Null

function Write-Log {
	param([string]$Message)
	Write-Host "[start] $Message"
}

function Invoke-Download {
	param(
		[string]$Url,
		[string]$OutFile
	)
	Invoke-WebRequest -Uri $Url -OutFile $OutFile
}

function Get-PnpmVersion {
	$defaultVersion = "10.26.2"
	$packageJson = Join-Path $Root "package.json"
	if (-not (Test-Path $packageJson)) {
		return $defaultVersion
	}

	try {
		$pm = (Get-Content $packageJson -Raw | ConvertFrom-Json).packageManager
		if ($pm -and $pm -match "^pnpm@(.+)$") {
			$raw = $Matches[1]
			if ($raw -match "^([^+]+)") {
				return $Matches[1]
			}
			return $raw
		}
	} catch {
	}

	return $defaultVersion
}

function Resolve-Platform {
	$arch = $env:PROCESSOR_ARCHITECTURE
	switch -Regex ($arch) {
		"AMD64" { $script:ArchId = "x64" }
		"ARM64" { $script:ArchId = "arm64" }
		"x86" { $script:ArchId = "x86" }
		default { throw "Unsupported architecture: $arch" }
	}

	$script:Platform = "win-$ArchId"
}

function Ensure-Node {
	$nodeDir = Join-Path $BinDir "node-$Platform"
	$nodeExe = Join-Path $nodeDir "node.exe"
	$needsInstall = $true

	if (Test-Path $nodeExe) {
		try {
			$major = & $nodeExe -p "process.versions.node.split('.')[0]"
			if ($major -eq "22") {
				$needsInstall = $false
			}
		} catch {
		}
	}

	if (-not $needsInstall) {
		$script:NodeDir = $nodeDir
		return
	}

	Write-Log "Installing Node.js 22 for $Platform..."
	$temp = New-Item -ItemType Directory -Path ([System.IO.Path]::Combine($BinDir, ".tmp-node")) -Force
	$dist = "https://nodejs.org/dist/latest-v22.x"
	$shaFile = Join-Path $temp.FullName "SHASUMS256.txt"
	Invoke-Download "$dist/SHASUMS256.txt" $shaFile

	$match = Select-String -Path $shaFile -Pattern "$Platform\.zip" | Select-Object -First 1
	if (-not $match) {
		throw "Node.js archive for $Platform not found."
	}
	$archive = ($match.Line -split "\s+")[1]
	$archivePath = Join-Path $temp.FullName $archive
	Invoke-Download "$dist/$archive" $archivePath

	Expand-Archive -Path $archivePath -DestinationPath $temp.FullName -Force
	$folder = [System.IO.Path]::GetFileNameWithoutExtension($archive)
	$extracted = Join-Path $temp.FullName $folder

	Remove-Item -Recurse -Force $nodeDir -ErrorAction SilentlyContinue
	Move-Item -Path $extracted -Destination $nodeDir
	Remove-Item -Recurse -Force $temp.FullName

	$script:NodeDir = $nodeDir
}

function Ensure-Pnpm {
	$pnpmCmd = Join-Path $NodeDir "pnpm.cmd"
	if (Test-Path $pnpmCmd) {
		return
	}

	$pnpmVersion = Get-PnpmVersion
	Write-Log "Installing pnpm $pnpmVersion..."
	$env:NPM_CONFIG_PREFIX = $NodeDir
	& (Join-Path $NodeDir "npm.cmd") install -g "pnpm@$pnpmVersion"
}

function Ensure-Git {
	$gitDir = Join-Path $BinDir "git-$Platform"
	$gitExe = Join-Path $gitDir "cmd\git.exe"
	if (Test-Path $gitExe) {
		$script:GitDir = $gitDir
		return
	}

	$gitVersion = if ($env:GIT_VERSION) { $env:GIT_VERSION } else { "2.47.1" }
	$gitWindowsVersion = if ($env:GIT_WINDOWS_VERSION) { $env:GIT_WINDOWS_VERSION } else { "$gitVersion.windows.1" }

	$archSuffix = if ($ArchId -eq "x86") { "32-bit" } else { "64-bit" }
	if ($ArchId -eq "arm64") {
		Write-Log "ARM64 detected; using x64 MinGit build."
	}

	$gitFile = "MinGit-$gitVersion-$archSuffix.zip"
	$gitUrl = "https://github.com/git-for-windows/git/releases/download/v$gitWindowsVersion/$gitFile"

	Write-Log "Installing Git $gitVersion for $Platform..."
	$temp = New-Item -ItemType Directory -Path ([System.IO.Path]::Combine($BinDir, ".tmp-git")) -Force
	$gitZip = Join-Path $temp.FullName $gitFile
	Invoke-Download $gitUrl $gitZip

	New-Item -ItemType Directory -Force -Path $gitDir | Out-Null
	Expand-Archive -Path $gitZip -DestinationPath $gitDir -Force
	Remove-Item -Recurse -Force $temp.FullName

	$script:GitDir = $gitDir
}

Resolve-Platform
Ensure-Node
Ensure-Pnpm
Ensure-Git

$env:Path = "$(Join-Path $GitDir "cmd");$NodeDir;$env:Path"
Set-Location $Root
& (Join-Path $NodeDir "pnpm.cmd") install --fix-lockfile
& (Join-Path $NodeDir "pnpm.cmd") update phosart-devtool phosart-common phosart-bsky
& (Join-Path $NodeDir "pnpm.cmd") run editpreview
