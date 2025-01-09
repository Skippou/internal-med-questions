---
id: CARD-ECG001
specialty: cardiology
topic: ecg
difficulty: hard
type: ecg-simulation
tags: [cardiology, ecg, simulation, stemi, emergencies, copilot]
created: 2025-01-09
lastUpdated: 2025-01-09
ecgData:
  rhythm: sinus
  rate: 102
  axis: 15
  intervals:
    pr: 160
    qrs: 92
    qt: 380
  waveforms:
    I: "normal"
    II: "stDepression"
    III: "stDepression"
    aVR: "stElevation"
    aVL: "normal"
    aVF: "stDepression"
    V1: "qwave"
    V2: "stElevation4mm"
    V3: "stElevation4mm"
    V4: "stElevation3mm"
    V5: "tWaveInversion"
    V6: "tWaveInversion"
  findings:
    - ST elevation V2-V4 (4mm)
    - Reciprocal ST depression II, III, aVF
    - Q waves V1-V3
    - T wave inversion V3-V6
---

# Anterior STEMI Simulation

## Clinical Scenario
A 58-year-old man presents with:
- 2 hours of crushing chest pain
- Diaphoresis
- Nausea
- No prior cardiac history

## ECG Parameters 
[Interactive ECG display would be here]
- Rate: 102/min
- Rhythm: Sinus tachycardia
- Axis: 15 degrees
- Intervals: PR 160ms, QRS 92ms, QT 380ms

## Interactive Elements
- Click leads to magnify
- Measure intervals with digital calipers
- Compare serial changes
- Highlight ST segments
- Calculate scores

## Questions
1. Most concerning ECG finding?
A) T wave inversion
B) ST elevation V2-V4
C) Sinus tachycardia
D) Normal axis

2. Appropriate management timeline?
A) Immediate cardiac catheterization
B) Stress test within 24 hours
C) Outpatient follow-up
D) Medical management only

3. Door-to-balloon time goal?
A) <90 minutes
B) <120 minutes
C) <4 hours
D) <24 hours

## Teaching Points
1. STEMI Criteria:
   - ≥2mm ST elevation in V2-V3
   - ≥1mm in other contiguous leads
   - Reciprocal changes support diagnosis

2. Time Goals:
   - EKG within 10 minutes
   - Door-to-balloon <90 minutes
   - First medical contact-to-device <120 minutes

3. Risk Stratification:
   - TIMI Score calculation
   - Shock assessment
   - Mechanical complications
   - Arrhythmia risk

## References
- ACC/AHA STEMI Guidelines 2022
- ESC STEMI Guidelines 2023
- NEJM 2021: "Early STEMI Management"
