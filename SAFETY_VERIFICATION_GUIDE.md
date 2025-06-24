# VIVALY Safety Verification System

## Overview

The VIVALY platform implements a comprehensive safety verification system to ensure all caregivers meet Australian childcare safety standards. This includes automated verification of Working with Children Checks (WWCC), police clearance certificates, and identity documents.

## Verification Components

### 1. Working with Children Check (WWCC) Verification

**Automated State Integration:**
- Direct API integration with all Australian state/territory WWCC systems
- Real-time verification against government databases
- Automatic expiry monitoring and renewal reminders
- State-specific validation rules

**Supported States:**
- NSW: Kids Guardian API
- VIC: Working with Children Victoria API
- QLD: Blue Card Queensland API
- WA: Working with Children WA API  
- SA: Department for Child Protection SA API
- TAS: Department of Justice TAS API
- ACT: Access Canberra API
- NT: Northern Territory Police API

**Verification Process:**
1. User enters WWCC number, state, name, and DOB
2. System calls appropriate state API for verification
3. Validates WWCC status (active/expired/suspended/cancelled)
4. Checks name match and expiry date
5. Stores verification result and sends notification

### 2. Police Clearance Certificate Verification

**Document Processing:**
- OCR (Optical Character Recognition) extraction of document details
- Automated validation of document authenticity
- Age verification (must be within 12 months)
- Name matching against user profile
- Criminal record flagging for manual review

**Verification Process:**
1. User uploads police clearance document (PDF/image)
2. OCR service extracts text and validates format
3. System checks issue date, name, and criminal records
4. Documents with records flagged for manual review
5. Clean records automatically approved

### 3. Identity Document Verification

**Supported Documents:**
- Australian Passport
- Australian Driver's License

**Verification Process:**
1. User uploads document photo and enters details
2. OCR extraction of document information
3. Validation of document authenticity markers
4. Cross-reference with submitted information
5. Biometric face matching (future enhancement)

## API Integration Requirements

### Required Environment Variables

```bash
# WWCC State API Keys
NSW_WWCC_API_KEY=your_nsw_api_key
NSW_WWCC_API_URL=https://api.kidsguardian.nsw.gov.au/wwcc/verify

VIC_WWCC_API_KEY=your_vic_api_key
VIC_WWCC_API_URL=https://api.workingwithchildren.vic.gov.au/verify

QLD_BLUECARD_API_KEY=your_qld_api_key
QLD_BLUECARD_API_URL=https://api.bluecard.qld.gov.au/verify

WA_WWCC_API_KEY=your_wa_api_key
WA_WWCC_API_URL=https://api.workingwithchildren.wa.gov.au/verify

SA_WWCC_API_KEY=your_sa_api_key
SA_WWCC_API_URL=https://api.screening.sa.gov.au/verify

TAS_WWCC_API_KEY=your_tas_api_key
TAS_WWCC_API_URL=https://api.justice.tas.gov.au/wwcc/verify

ACT_WWCC_API_KEY=your_act_api_key
ACT_WWCC_API_URL=https://api.accesscanberra.act.gov.au/wwcc/verify

NT_WWCC_API_KEY=your_nt_api_key
NT_WWCC_API_URL=https://api.pfes.nt.gov.au/wwcc/verify

# OCR Service (AWS Textract, Google Vision, or Azure Computer Vision)
OCR_SERVICE_URL=https://api.ocr-service.com/extract
OCR_API_KEY=your_ocr_api_key
```

### OCR Service Integration

The system integrates with professional OCR services for document processing:

**Recommended Services:**
1. **AWS Textract** - Specialized in document analysis
2. **Google Cloud Vision API** - Strong text extraction
3. **Azure Computer Vision** - Comprehensive document processing

**OCR Request Format:**
```json
{
  "documentUrl": "https://vivaly.com/uploads/document.jpg",
  "documentType": "police_check|passport|drivers_license",
  "country": "AU"
}
```

**OCR Response Format:**
```json
{
  "success": true,
  "extractedName": "John Smith",
  "extractedDocumentNumber": "P123456789",
  "extractedDOB": "1990-01-01",
  "extractedIssueDate": "2024-01-01",
  "hasRecords": false,
  "isValid": true,
  "isExpired": false,
  "confidence": 0.95
}
```

## Database Schema

### Verification Checks Table
```sql
CREATE TABLE verification_checks (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  check_type VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'pending',
  document_url VARCHAR,
  verification_data JSONB,
  submitted_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  expires_at TIMESTAMP,
  verifier_email VARCHAR,
  rejection_reason TEXT,
  auto_verified BOOLEAN DEFAULT false,
  manual_review_required BOOLEAN DEFAULT false
);
```

### Updated Users Table Fields
```sql
-- WWCC Fields
wwcc_verification_status VARCHAR DEFAULT 'pending',
wwcc_last_checked TIMESTAMP,
wwcc_state VARCHAR,

-- Police Check Fields  
police_check_status VARCHAR DEFAULT 'pending',
police_check_expiry_date TIMESTAMP,
police_check_document_url VARCHAR,

-- Identity Verification Fields
identity_verification_status VARCHAR DEFAULT 'pending',
passport_number VARCHAR,
driver_license_number VARCHAR,
identity_document_url VARCHAR,
identity_document_type VARCHAR
```

## API Endpoints

### Verification Endpoints
- `POST /api/verify/wwcc` - Submit WWCC for verification
- `POST /api/verify/police-check` - Upload police clearance
- `POST /api/verify/identity` - Upload identity document
- `GET /api/verification/status` - Get user verification status

### Admin Endpoints
- `GET /api/admin/verification/pending` - Get pending manual reviews
- `POST /api/admin/verification/:id/approve` - Approve verification
- `POST /api/admin/verification/:id/reject` - Reject verification

## Manual Review Process

### When Manual Review is Required:
1. WWCC API unavailable or returns ambiguous results
2. Police clearance shows criminal records
3. OCR cannot extract document details with high confidence
4. Identity document validation fails automated checks
5. Name mismatches or suspicious document characteristics

### Admin Review Dashboard:
- List of pending verifications
- Document preview and extracted data
- Verification history and notes
- Approve/reject with reason codes
- Notification system for applicants

## Security & Privacy

### Data Protection:
- Document images encrypted at rest
- WWCC numbers encrypted in database
- API keys stored in secure environment variables
- Audit logs for all verification activities
- Automatic document deletion after verification

### Compliance:
- Australian Privacy Act compliance
- GDPR compliance for international users
- SOC 2 Type II security controls
- Regular security audits and penetration testing

## Notification System

### Email Notifications:
- Verification submitted confirmation
- Automated approval notifications
- Manual review required alerts
- Rejection notifications with next steps
- Expiry reminders (30 days before)

### SMS Notifications (Optional):
- Critical verification updates
- Urgent renewal reminders
- Security alerts

## Integration with Booking System

### Safety Requirements:
- All caregivers must pass full verification before accepting bookings
- Real-time verification status checks during booking process
- Automatic suspension if verification expires
- Parent notification of caregiver verification status

### Booking Flow Integration:
1. Parent requests booking with caregiver
2. System checks caregiver verification status
3. Booking only proceeds if fully verified
4. Verification status displayed to parents
5. Automatic rejection if verification expired

## Monitoring & Analytics

### Key Metrics:
- Verification completion rates by check type
- Average processing time (automated vs manual)
- Rejection reasons and patterns
- State-by-state WWCC API performance
- OCR accuracy and confidence scores

### Alerting:
- API failures or timeouts
- High rejection rates
- Manual review queue backlog
- Document processing errors
- Expiry reminder failures

## Future Enhancements

### Planned Features:
1. **Biometric Face Matching** - Compare selfie with ID photo
2. **Reference Check Integration** - Automated reference verification
3. **International Verification** - Support for overseas caregivers
4. **Blockchain Verification** - Immutable verification records
5. **AI Risk Assessment** - Machine learning risk scoring
6. **Real-time WWCC Monitoring** - Continuous status checking

### Technical Improvements:
- Enhanced OCR accuracy with AI
- Mobile document scanning with live guidance
- Advanced fraud detection algorithms
- Integration with additional government databases
- Automated quality assessment of document photos

## Support & Troubleshooting

### Common Issues:
1. **WWCC Not Found** - Check number format and state
2. **Document Upload Fails** - Reduce file size, check format
3. **Name Mismatch** - Use exact legal name on documents
4. **Expired Documents** - Must be current and within validity period
5. **Manual Review Delays** - Allow 2-3 business days

### Contact Information:
- Technical Support: tech@vivaly.com.au
- Verification Queries: verify@vivaly.com.au  
- Emergency Contact: +61 1800 VIVALY

## Compliance Documentation

### Regulatory Compliance:
- Working with Children Check (WWCC) requirements by state
- Australian Federal Police (AFP) clearance standards
- Privacy Act 1988 compliance documentation
- Children and Community Services Act compliance
- Mandatory reporting obligations

This safety verification system ensures VIVALY maintains the highest standards of child safety while providing a streamlined user experience for legitimate caregivers.