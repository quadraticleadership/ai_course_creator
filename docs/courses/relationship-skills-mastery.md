# Course Spec: Relationship Skills Mastery (RSM)

**Short name:** RSM
**Status:** Spec in progress — content exists as legacy video course, being migrated
**Student Portal:** learn.relationshipdynamics.com
**Last Updated:** 2026-02-23

---

## Overview

RSM is a personal relationship transformation course. It lives on the relationshipdynamics.com
domain, which also hosts the Relationship Dynamics assessment tool (a separate product that feeds
into this course as a core onboarding step).

The Relationship Dynamics assessment is both an external product AND a required component of
RSM onboarding — students are redirected to take the assessment, and results are stored in their
enrollment and injected into all AI context.

---

## ICP / Start State / End State

> **TODO:** Fill in from existing course materials.

**ICP:**
- TBD

**Start State:**
- TBD

**End State:**
- TBD

---

## Limiting Beliefs Addressed

> **TODO:** Extract from existing course content.

---

## Skills Built

> **TODO:** Extract from existing course content.

---

## Modules

> **TODO:** Map existing video modules to the new component-based format.
> Each module needs: name, limiting beliefs, skills, component sequence, Transmission script source.

---

## Materials Produced

> **TODO:** Define material types for this course.
> Example: relationship dynamics profile, communication style assessment, conversation scripts, etc.

---

## Assessment Dimensions

> **TODO:** Define the dimensions tracked in the Assessment record for this course.
> These are the axes along which student state is measured (e.g., defensiveness, accountability,
> empathy expression, conflict avoidance).

---

## Clear Story Pool

> **TODO:** Run Clear Story Audit against the existing content once Clear Stories API credentials
> are available. Target: 100-200 stories curated from the full library.

---

## Course-Specific Configuration

**Relationship Dynamics integration:** Required at onboarding. Student redirected to
relationshipdynamics.com/assessment; result returned via webhook; stored in `enrollment.rd_profile`.

**ElevenLabs voices:**
- Jennifer (stock)
- Teacher clone: TBD (requires teacher recording session)
- Neutral: TBD

**GHL pipeline:** TBD — need pipeline ID and enrollment trigger stage name.

**Skool group:** TBD

---

## Notes on Legacy Content

This course exists as a complete video-based course. Migration approach:
1. Existing videos become Transmissions (or source material for Transmission scripts)
2. Existing exercises become solo_practice or interview component seeds
3. All existing content should be reviewed for Clear Story extraction before running the
   formal Clear Story Audit

> **TODO:** Gather full inventory of existing video modules and assets.
