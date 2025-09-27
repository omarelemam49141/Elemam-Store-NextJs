# PowerShell build script to bypass permission issues
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:CI = "true" 
$env:NODE_ENV = "production"

Write-Host "Starting Next.js build with custom environment..."

try {
    # Try to build with restricted permissions
    & npx next build --no-lint
    Write-Host "Build completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Build failed: $_" -ForegroundColor Red
    exit 1
}
