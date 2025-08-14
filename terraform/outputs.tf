# Keep api_url the same (APIGW)
output "api_url" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}

# Optional: keep bucket name for uploads
output "frontend_bucket" {
  value = aws_s3_bucket.frontend.bucket
}

# Website URL is now CloudFront domain
output "website_url" {
  value = aws_cloudfront_distribution.site.domain_name
}
