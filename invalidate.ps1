# Configuration
$CLOUDFRONT_DISTRIBUTION_ID = "E3EX9JVKMSIGL9"

Write-Host "Starting CloudFront invalidation script..."

# Check if AWS CLI is installed
try {
    $null = Get-Command aws -ErrorAction Stop
} catch {
    Write-Host "AWS CLI is not installed. Please install it first."
    exit 1
}

# Check AWS credentials
try {
    $null = aws sts get-caller-identity
} catch {
    Write-Host "AWS credentials not found. Please configure AWS CLI first using:"
    Write-Host "aws configure"
    Write-Host "Or set environment variables:"
    Write-Host "`$env:AWS_ACCESS_KEY_ID = 'your-access-key'"
    Write-Host "`$env:AWS_SECRET_ACCESS_KEY = 'your-secret-key'"
    Write-Host "`$env:AWS_DEFAULT_REGION = 'us-east-2'"
    exit 1
}

# Create CloudFront invalidation
Write-Host "`nCreating CloudFront invalidation..."
$INVALIDATION_ID = aws cloudfront create-invalidation `
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" `
    --paths "/*" `
    --query 'Invalidation.Id' `
    --output text

Write-Host "Invalidation created with ID: $INVALIDATION_ID"

# Monitor invalidation status
Write-Host "Monitoring invalidation status..."
while ($true) {
    $STATUS = aws cloudfront get-invalidation `
        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" `
        --id "$INVALIDATION_ID" `
        --query 'Invalidation.Status' `
        --output text
    
    Write-Host "Current status: $STATUS"
    
    if ($STATUS -eq "Completed") {
        Write-Host "Invalidation completed. Your changes should now be visible."
        break
    }
    
    Start-Sleep -Seconds 10
} 