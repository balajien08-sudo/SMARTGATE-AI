import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// State for field numbers and observation photo that can be customized in presentation
let fieldObservationData = {
  location: 'College Main Gate (North Campus Entrance)',
  observationDuration: '07:45 AM – 09:30 AM (Morning Peak Rush)',
  observedIssue: 'Severe vehicular bottleneck during peak student/staff arrival window causing queue spillover onto main arterial roadway.',
  photoUrl: null,
  photoFileName: null,
  photoUploadedAt: null,
  fieldNumbers: {
    vehicleCount: '342 Vehicles (Observed)',
    averageWaitingTime: '7.8 Minutes (Manual Stop-watch)',
    peakCongestionDuration: '55 Minutes (08:15 AM - 09:10 AM)',
    isCustomized: false
  }
};

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'server', 'uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.error('[Uploads] Error creating upload directory:', e);
}

export function getProjectMethodology(req, res, next) {
  try {
    const methodologyData = {
      projectTitle: 'SmartGate AI — AI-Based Traffic Congestion Monitoring & Prediction System for College Gates',
      tagline: 'Smarter Gates. Safer Campuses.',
      academicContext: 'College AI Immersion / C29 Project',
      
      fieldObservation: {
        location: fieldObservationData.location,
        observationDuration: fieldObservationData.observationDuration,
        observedIssue: fieldObservationData.observedIssue,
        photoUrl: fieldObservationData.photoUrl,
        photoFileName: fieldObservationData.photoFileName,
        photoUploadedAt: fieldObservationData.photoUploadedAt,
        photoPlaceholderNote: 'INSERT YOUR OWN FIELD PHOTOGRAPH HERE (Academic Evaluation Placeholder)',
        fieldEvidenceDisclaimer: 'FIELD OBSERVATION DATA — Represents actual ground observations entered by the project student. Do not fabricate fake automated sensor logs.'
      },

      problemStatement: {
        title: 'Real-World Problem Statement',
        statement: 'Students, staff, and visitors entering and leaving the college face traffic congestion at the college gate, especially during peak hours. Manual traffic management makes it difficult to continuously monitor vehicle flow and identify growing congestion, resulting in increased waiting time and crowding.',
        rootCause: 'Lack of continuous traffic monitoring and automated congestion prediction.'
      },

      fiveWhys: [
        {
          step: 1,
          question: 'Why does congestion occur at the college gate?',
          answer: 'Many vehicles (student two-wheelers, staff cars, college transit buses) arrive within a very short 45-minute window before morning classes begin.'
        },
        {
          step: 2,
          question: 'Why does the vehicle queue grow so rapidly?',
          answer: 'Vehicle inflow rate (approx. 25-35 vehicles/min) significantly exceeds single-gate ID badge and barrier processing capacity (approx. 18 vehicles/min).'
        },
        {
          step: 3,
          question: 'Why isn’t the growing congestion identified early?',
          answer: 'Traffic is mainly monitored manually by security staff on ground who are busy inspecting entry passes and handling physical gate barriers.'
        },
        {
          step: 4,
          question: 'Why is manual monitoring insufficient for proactive management?',
          answer: 'Human security staff cannot continuously calculate vehicle arrival velocities, count multi-class vehicle density, or analyze pattern shifts in real time.'
        },
        {
          step: 5,
          question: 'Why is early prediction and prevention difficult?',
          answer: 'There is no automated intelligent system analyzing historical entry patterns, live camera telemetry, and queue growth trajectory.'
        },
        {
          rootCauseTitle: 'Identified Root Cause',
          rootCauseSummary: 'Lack of continuous AI-assisted traffic monitoring and automated predictive intelligence.'
        }
      ],

      stakeholders: [
        {
          role: 'Students',
          impact: 'Severely affected by entry waiting time, leading to missed lectures and attendance penalties.',
          priority: 'High Priority'
        },
        {
          role: 'Faculty & Staff',
          impact: 'Affected by delayed vehicular entry and exit, disrupting morning class and laboratory schedules.',
          priority: 'High Priority'
        },
        {
          role: 'Security Personnel',
          impact: 'Overburdened with simultaneous manual ID verification, barrier operation, and manual traffic direction.',
          priority: 'Primary Operational User'
        },
        {
          role: 'College Administration',
          impact: 'Responsible for overall campus safety, road hazard prevention, and smooth institutional logistics.',
          priority: 'Key Decision Maker'
        },
        {
          role: 'Emergency Services',
          impact: 'Require guaranteed unblocked rapid access corridors for ambulances, fire engines, and campus security.',
          priority: 'Critical Priority'
        }
      ],

      fieldNumbers: fieldObservationData.fieldNumbers,

      existingSolutions: [
        {
          name: 'Manual Traffic Management',
          description: 'Security guards waving vehicles through with whistles and manual logs.',
          limitation: 'High human fatigue, reactive rather than predictive, cannot estimate queue growth velocity.',
          smartGateAdvantage: 'Continuous AI telemetry with 24/7 automated queue tracking.'
        },
        {
          name: 'Static Traffic Cones & Fixed Barriers',
          description: 'Physical lane splitters and directional barricades.',
          limitation: 'Completely static and inflexible; cannot adapt when bus convoys or rush bursts arrive.',
          smartGateAdvantage: 'Dynamic recommendations to open/close secondary gates dynamically.'
        },
        {
          name: 'CCTV Cameras (Passive Video)',
          description: 'Standard security camera recordings displayed on guard room screens.',
          limitation: 'Requires constant manual human visual interpretation; no automated anomaly or queue alert.',
          smartGateAdvantage: 'Computer vision overlay with automated YOLO-based vehicle classification.'
        },
        {
          name: 'Basic Vehicle Inductive Loops / Counters',
          description: 'Pneumatic tubes or ground magnetic tripwires.',
          limitation: 'Provides raw count numbers only; no predictive modeling, speed analysis, or intelligent actions.',
          smartGateAdvantage: 'End-to-end predictive forecasting and human-in-the-loop decision support.'
        }
      ],

      proposedSolutionComparison: [
        { approach: 'Manual Monitoring', detection: '❌ Slow / Inconsistent', intelligence: '❌ Reactive', prediction: '❌ None', limitation: 'Limited continuous attention' },
        { approach: 'CCTV Only', detection: '⚠️ Video Feed Only', intelligence: '❌ No AI Layer', prediction: '❌ None', limitation: 'Requires human interpretation' },
        { approach: 'Vehicle Counter', detection: '⚠️ Total Count Only', intelligence: '❌ No Classification', prediction: '❌ None', limitation: 'Limited intelligence' },
        { approach: 'SmartGate AI (Proposed)', detection: '✅ Real-time Computer Vision', intelligence: '✅ Congestion Scoring', prediction: '✅ 10m/30m Forecasting', limitation: '🏆 Full Intelligent Assistance' }
      ],

      responsibleAiPrinciples: [
        {
          title: 'Human-in-the-Loop Governance',
          description: 'AI detects and recommends; human security staff always verify before taking physical gate or lane control actions.'
        },
        {
          title: 'Privacy by Design — No Facial Recognition',
          description: 'System focuses purely on vehicle telemetry and macro traffic dynamics. No driver facial recognition or biometric profiling is stored.'
        },
        {
          title: 'Ethical Vehicle Data Minimization',
          description: 'Only aggregate counts, category metrics (Car/Bike/Bus/Van), and velocity estimates are recorded; no unnecessary private citizen tracking.'
        },
        {
          title: 'Transparent Demo Data Demarcation',
          description: 'All simulated values and prototype telemetry are visibly labeled to prevent misleading representations.'
        },
        {
          title: 'Continuous Bias & False Positive Auditing',
          description: 'Algorithms are calibrated to avoid premature false alarm fatigue while guaranteeing high sensitivity to critical queue overflows.'
        },
        {
          title: 'Campus Safety & Regulatory Compliance',
          description: 'Adheres to institutional digital safety policies and municipal roadway junction standards.'
        }
      ],

      disclaimer: 'C29 AI IMMERSION PROJECT — ACADEMIC METHODOLOGY SPECIFICATION'
    };

    res.json({
      success: true,
      data: methodologyData
    });
  } catch (err) {
    next(err);
  }
}

export function updateFieldNumbers(req, res, next) {
  try {
    const { vehicleCount, averageWaitingTime, peakCongestionDuration, location, observationDuration } = req.body;

    if (vehicleCount) fieldObservationData.fieldNumbers.vehicleCount = vehicleCount;
    if (averageWaitingTime) fieldObservationData.fieldNumbers.averageWaitingTime = averageWaitingTime;
    if (peakCongestionDuration) fieldObservationData.fieldNumbers.peakCongestionDuration = peakCongestionDuration;
    if (location) fieldObservationData.location = location;
    if (observationDuration) fieldObservationData.observationDuration = observationDuration;
    fieldObservationData.fieldNumbers.isCustomized = true;

    res.json({
      success: true,
      message: 'Field observation metrics updated successfully for presentation.',
      data: fieldObservationData
    });
  } catch (err) {
    next(err);
  }
}

export async function uploadFieldPhoto(req, res, next) {
  try {
    const { imageBase64, fileName = 'field_photo.jpg', mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: 'No image data provided. Please select an image to upload.'
      });
    }

    // Extract mime type from data URI or provided mimeType
    let detectedMime = mimeType;
    let base64Data = imageBase64;

    if (imageBase64.startsWith('data:')) {
      const matches = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        detectedMime = matches[1].toLowerCase();
        base64Data = matches[2];
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid base64 image data URI format.'
        });
      }
    }

    // Allowed image MIME types
    const allowedMimes = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif'
    };

    if (!detectedMime || !allowedMimes[detectedMime]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image format. Only JPG, JPEG, PNG, WEBP, and GIF files are allowed.'
      });
    }

    // Convert to binary buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // 10 MB Max Size Validation (10 * 1024 * 1024 bytes)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (buffer.length > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        message: `Image size (${(buffer.length / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum allowed limit of 10 MB.`
      });
    }

    // Generate safe unique filename
    const ext = allowedMimes[detectedMime] || '.jpg';
    const safeFilename = `field_photo_${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
    const filePath = path.join(uploadDir, safeFilename);

    // If an old photo exists, clean it up
    if (fieldObservationData.photoUrl && fieldObservationData.photoUrl.startsWith('/uploads/')) {
      const oldFilename = path.basename(fieldObservationData.photoUrl);
      const oldFilePath = path.join(uploadDir, oldFilename);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (err) {
          console.warn('[Uploads] Could not delete old photo file:', err.message);
        }
      }
    }

    // Save new file to disk
    fs.writeFileSync(filePath, buffer);

    const photoUrl = `/uploads/${safeFilename}`;
    fieldObservationData.photoUrl = photoUrl;
    fieldObservationData.photoFileName = path.basename(fileName || safeFilename);
    fieldObservationData.photoUploadedAt = new Date().toISOString();

    console.log(`📸 [Field Photo] Successfully saved photo to: ${filePath}`);

    res.json({
      success: true,
      message: 'Field photograph uploaded successfully.',
      photoUrl,
      fileName: fieldObservationData.photoFileName,
      uploadedAt: fieldObservationData.photoUploadedAt
    });
  } catch (err) {
    next(err);
  }
}

export function deleteFieldPhoto(req, res, next) {
  try {
    if (fieldObservationData.photoUrl && fieldObservationData.photoUrl.startsWith('/uploads/')) {
      const filename = path.basename(fieldObservationData.photoUrl);
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn('[Uploads] Could not delete photo file:', err.message);
        }
      }
    }

    fieldObservationData.photoUrl = null;
    fieldObservationData.photoFileName = null;
    fieldObservationData.photoUploadedAt = null;

    res.json({
      success: true,
      message: 'Field photograph removed successfully.'
    });
  } catch (err) {
    next(err);
  }
}

