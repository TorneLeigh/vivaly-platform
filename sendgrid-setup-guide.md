# SendGrid Setup Guide for VIVALY Email Automation

## Step 1: Create SendGrid Account

1. Go to https://sendgrid.com/
2. Click "Start for Free"
3. Sign up with your business email address
4. Choose the Free plan (100 emails/day) or Essential plan for higher volume

## Step 2: Get Your API Key

1. After logging in, go to **Settings → API Keys**
2. Click **"Create API Key"**
3. Choose **"Restricted Access"** for security
4. Set these permissions:
   - **Mail Send**: Full Access
   - **Mail Settings**: Read Access
   - **Tracking**: Read Access
5. Name it: `VIVALY Production API Key`
6. Click **"Create & View"**
7. **COPY THE API KEY IMMEDIATELY** - you won't see it again

## Step 3: Domain Authentication (Critical)

1. Go to **Settings → Sender Authentication → Domain Authentication**
2. Click **"Authenticate Your Domain"**
3. Enter domain: `vivaly.com`
4. Select DNS host: Choose your domain provider (e.g., Cloudflare, GoDaddy, etc.)
5. Advanced Settings:
   - Check **"Use automated security"**
   - Check **"Use custom return path"**
6. Click **"Next"**

### DNS Records to Add

SendGrid will provide 3 DNS records you must add to vivaly.com:

```
Type: CNAME
Host: s1._domainkey.vivaly.com
Value: s1.domainkey.u[NUMBERS].wl[NUMBERS].sendgrid.net

Type: CNAME  
Host: s2._domainkey.vivaly.com
Value: s2.domainkey.u[NUMBERS].wl[NUMBERS].sendgrid.net

Type: CNAME
Host: em[NUMBERS].vivaly.com
Value: u[NUMBERS].wl[NUMBERS].sendgrid.net
```

7. Add these records to your DNS provider
8. Return to SendGrid and click **"Verify"**
9. Wait for verification (can take up to 48 hours)

## Step 4: Sender Identity Setup

1. Go to **Settings → Sender Authentication → Single Sender Verification**
2. Click **"Create New Sender"**
3. Fill in details:
   - **From Name**: VIVALY
   - **From Email**: automated@vivaly.com
   - **Reply To**: support@vivaly.com
   - **Company Address**: Your business address
4. Click **"Create"**
5. Check the email at automated@vivaly.com and verify

## Step 5: Configure Environment Variable

Add your API key to the Replit environment:

1. In Replit, go to **Secrets** tab (lock icon)
2. Add new secret:
   - **Key**: `SENDGRID_API_KEY`
   - **Value**: Your API key from Step 2
3. Save the secret

## Step 6: Test Email Delivery

Use this test endpoint once setup is complete:

```bash
curl -X POST https://your-replit-url.repl.co/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@example.com","subject":"VIVALY Test Email"}'
```

## Step 7: Email Compliance Setup

1. **Unsubscribe Handling**:
   - Go to **Settings → Mail Settings → Subscription Tracking**
   - Enable subscription tracking
   - Customize unsubscribe content

2. **Bounce Handling**:
   - Go to **Settings → Mail Settings → Event Webhook**
   - Set webhook URL: `https://your-replit-url.repl.co/api/webhooks/sendgrid`

## Important Notes

- **Free Tier**: 100 emails/day, perfect for testing
- **Scaling**: Essential plan ($19.95/month) gives 50,000 emails/month
- **Domain Authentication**: Required for production email delivery
- **Sender Reputation**: Maintain good practices to avoid spam filters

## Troubleshooting

### Domain Not Verified
- Check DNS records are correctly added
- Wait up to 48 hours for propagation
- Use DNS checker tools to verify records

### Emails Going to Spam
- Complete domain authentication
- Verify sender identity
- Maintain low bounce rates
- Include unsubscribe links

### API Key Issues
- Ensure correct permissions are set
- Check API key is active in SendGrid
- Verify environment variable is set correctly

## Ready for Production

Once domain authentication shows "Verified" status in SendGrid, your automated@vivaly.com email system is ready for production use.

All VIVALY email templates will automatically send from automated@vivaly.com with professional formatting and compliance features built-in.