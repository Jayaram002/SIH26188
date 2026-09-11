export const DEMO_SCENARIOS = [
  {
    id: 1,
    name: "Genuine Passenger — VERIFIED",
    description: "Standard screening of an authentic passenger",
    passenger: {
      passenger_id: "AV-IND-000123",
      full_name: "RAJESH KUMAR SHARMA",
      nationality: "IND",
      nationality_full: "India",
      date_of_birth: "1990-03-15",
      gender: "M",
      passport_number_masked: "****K5821",
      passport_expiry: "2031-03-14",
      flight: "AX 204",
      terminal: "T2",
      gate: "G18",
    },
    ocr: { confidence: 97.4, mrz_detected: true },
    forensics: { overall_risk: "LOW", tampering: false },
    face: { similarity: 96.7, liveness: "PASS", pad: "PASS", match: "MATCH" },
    fingerprint: { similarity: 98.8, quality: "GOOD", pad: "PASS", match: "MATCH" },
    iris: { similarity: 99.1, quality: "GOOD", pad: "PASS", match: "MATCH" },
    risk: { score: 8, status: "VERIFIED", identity_confidence: 97.6, doc_integrity: 96.0, bio_confidence: 98.2 },
    red_flags: [],
    explanation: [
      "All biometric signals confirm identity match",
      "Document structure valid and consistent",
      "No tampering indicators detected",
      "Database record matches all fields",
      "Travel document valid and within expiry"
    ]
  },
  {
    id: 2,
    name: "Document Tampering — REVIEW REQUIRED",
    description: "Document with potential alteration indicators",
    passenger: {
      passenger_id: "AV-GBR-000458",
      full_name: "JAMES ALEXANDER MORRISON",
      nationality: "GBR",
      nationality_full: "United Kingdom",
      date_of_birth: "1985-07-22",
      gender: "M",
      passport_number_masked: "****M2341",
      passport_expiry: "2029-07-21",
      flight: "BA 112",
      terminal: "T2",
      gate: "G04",
    },
    ocr: { confidence: 89.2, mrz_detected: true },
    forensics: { overall_risk: "MEDIUM", tampering: true,
      suspicious_regions: [
        { region: "Passport Number", risk: "MEDIUM", confidence: 0.82, description: "Potential text alteration in document number region" },
        { region: "Photo Border", risk: "LOW", confidence: 0.61, description: "Minor compression inconsistency near photo boundary" }
      ]
    },
    face: { similarity: 94.1, liveness: "PASS", pad: "PASS", match: "MATCH" },
    fingerprint: { similarity: 97.7, quality: "GOOD", pad: "PASS", match: "MATCH" },
    iris: { similarity: 98.3, quality: "GOOD", pad: "PASS", match: "MATCH" },
    risk: { score: 52, status: "REVIEW_REQUIRED", identity_confidence: 78.0, doc_integrity: 54.0, bio_confidence: 96.7 },
    red_flags: [
      { type: "POSSIBLE_TAMPERING", severity: "MEDIUM", confidence: 0.82, description: "Potential alteration detected in passport number region" },
      { type: "OCR_LOW_CONFIDENCE", severity: "LOW", confidence: 0.71, description: "OCR confidence below optimal threshold" }
    ],
    explanation: [
      "Potential document manipulation detected in passport number region",
      "OCR confidence lower than expected for this document type",
      "All biometric signals confirm identity match",
      "Document structure otherwise consistent"
    ]
  },
  {
    id: 3,
    name: "Possible Impersonation — BIOMETRIC CONFLICT",
    description: "Face mismatch with valid document",
    passenger: {
      passenger_id: "AV-USA-000891",
      full_name: "MICHAEL DAVID CHEN",
      nationality: "USA",
      nationality_full: "United States of America",
      date_of_birth: "1992-11-08",
      gender: "M",
      passport_number_masked: "****C7012",
      passport_expiry: "2030-11-07",
      flight: "UA 505",
      terminal: "T2",
      gate: "G22",
    },
    ocr: { confidence: 96.1, mrz_detected: true },
    forensics: { overall_risk: "LOW", tampering: false },
    face: { similarity: 51.2, liveness: "PASS", pad: "PASS", match: "MISMATCH" },
    fingerprint: { similarity: 98.1, quality: "GOOD", pad: "PASS", match: "MATCH" },
    iris: { similarity: 97.9, quality: "GOOD", pad: "PASS", match: "MATCH" },
    risk: { score: 68, status: "REVIEW_REQUIRED", identity_confidence: 71.0, doc_integrity: 96.0, bio_confidence: 82.4 },
    red_flags: [
      { type: "FACE_MISMATCH", severity: "HIGH", confidence: 0.91, description: "Face similarity score significantly below configured threshold" },
      { type: "BIOMETRIC_CONFLICT", severity: "HIGH", confidence: 0.89, description: "Face mismatch conflicts with fingerprint and iris match" }
    ],
    explanation: [
      "Face similarity score (51.2%) is below the configured threshold of 80%",
      "Fingerprint and iris both confirm identity match",
      "Biometric conflict: independent signals disagree — requires review",
      "Document is valid and shows no tampering indicators",
      "Possible causes: capture quality issue, or identity concern"
    ]
  },
  {
    id: 4,
    name: "Expired Visa — REVIEW REQUIRED",
    description: "Valid passport but expired travel visa",
    passenger: {
      passenger_id: "AV-CHN-001204",
      full_name: "LI XIAO MING",
      nationality: "CHN",
      nationality_full: "China",
      date_of_birth: "1988-05-30",
      gender: "M",
      passport_number_masked: "****X3311",
      passport_expiry: "2028-05-29",
      flight: "CA 836",
      terminal: "T2",
      gate: "G31",
      visa_expired: true,
      visa_expiry: "2026-08-15",
      visa_type: "Tourist Visa"
    },
    ocr: { confidence: 96.8, mrz_detected: true },
    forensics: { overall_risk: "LOW", tampering: false },
    face: { similarity: 95.1, liveness: "PASS", pad: "PASS", match: "MATCH" },
    fingerprint: { similarity: 97.4, quality: "GOOD", pad: "PASS", match: "MATCH" },
    iris: { similarity: 98.8, quality: "GOOD", pad: "PASS", match: "MATCH" },
    risk: { score: 45, status: "REVIEW_REQUIRED", identity_confidence: 96.2, doc_integrity: 91.0, bio_confidence: 97.1 },
    red_flags: [
      { type: "VISA_EXPIRED", severity: "HIGH", confidence: 1.0, description: "Travel visa expired on 2026-08-15, 26 days ago" }
    ],
    explanation: [
      "Passport is valid and shows no tampering indicators",
      "All biometric signals confirm identity",
      "Travel visa expired 26 days ago (2026-08-15)",
      "Passenger requires visa review before clearance"
    ]
  },
  {
    id: 5,
    name: "Multiple Conflicts — HIGH RISK",
    description: "Multiple document and biometric anomalies",
    passenger: {
      passenger_id: "AV-UNKNOWN-999",
      full_name: "UNKNOWN SUBJECT",
      nationality: "???",
      nationality_full: "Unknown",
      date_of_birth: "????-??-??",
      gender: "M",
      passport_number_masked: "****?????",
      passport_expiry: "2024-01-01",
      flight: "UNKNOWN",
      terminal: "T2",
      gate: "???",
    },
    ocr: { confidence: 71.0, mrz_detected: false },
    forensics: { overall_risk: "HIGH", tampering: true,
      suspicious_regions: [
        { region: "Photo Region", risk: "HIGH", confidence: 0.94, description: "Photo replacement indicators detected" },
        { region: "DOB Region", risk: "HIGH", confidence: 0.88, description: "Potential date alteration detected" },
        { region: "Passport Number", risk: "MEDIUM", confidence: 0.76, description: "Document number inconsistency" }
      ]
    },
    face: { similarity: 41.2, liveness: "PASS", pad: "PASS", match: "MISMATCH" },
    fingerprint: { similarity: 62.1, quality: "POOR", pad: "UNCERTAIN", match: "UNCERTAIN" },
    iris: { similarity: 38.1, quality: "POOR", pad: "PASS", match: "MISMATCH" },
    risk: { score: 91, status: "HIGH_RISK", identity_confidence: 28.0, doc_integrity: 22.0, bio_confidence: 47.1 },
    red_flags: [
      { type: "POSSIBLE_TAMPERING", severity: "CRITICAL", confidence: 0.94, description: "High-confidence photo replacement indicators" },
      { type: "FACE_MISMATCH", severity: "HIGH", confidence: 0.91, description: "Face does not match document photo" },
      { type: "IRIS_MISMATCH", severity: "HIGH", confidence: 0.88, description: "Iris pattern does not match enrolled template" },
      { type: "FINGERPRINT_MISMATCH", severity: "HIGH", confidence: 0.79, description: "Fingerprint match uncertain" },
      { type: "BIOMETRIC_CONFLICT", severity: "CRITICAL", confidence: 0.95, description: "All biometric modalities show anomalies" },
      { type: "DOCUMENT_EXPIRED", severity: "HIGH", confidence: 1.0, description: "Document expired 2024-01-01" },
      { type: "OCR_LOW_CONFIDENCE", severity: "HIGH", confidence: 0.89, description: "Very low OCR confidence — possible forgery" }
    ],
    explanation: [
      "Multiple high-severity anomalies detected across all verification channels",
      "Potential document forgery: photo replacement and field alteration indicators",
      "Face similarity (41.2%) significantly below threshold",
      "Iris match failed — pattern does not match enrolled template",
      "Fingerprint quality insufficient for reliable verification",
      "Document expired in 2024",
      "MRZ not detected or invalid"
    ]
  }
];
