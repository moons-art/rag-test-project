<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

# Project-Specific Next.js Rules

1. **Environmental Standards**
   - Node Version: v20 (LTS) 
   - Config File: Must use **next.config.mjs** (avoid next.config.js/ts to prevent build errors).
   - Deployment: Create and use `apphosting.yaml` for Firebase App Hosting.
   - Region: `asia-east1` (Taiwan).

2. **Model Standards (Gemini)**
   - Standard Model: `gemini-3-flash`.
   - High Efficiency Model: `gemini-3.1-flash-lite`.
   - **Model Routing**: Implement automatic selection based on task complexity or manual toggle in UI.

3. **Security Standards**
   - Backend APIs: Must include Firebase Auth session validation.
   - Admin Check: All sensitive RAG operations must include an `admin` role check.
   - Deployment Security: Use `firebase deploy --project [PROJECT_ID]` for all deployment commands.

4. **UI/UX Standards**
   - Premium Design: Implement gradients, glassmorphism, and smooth animations.
   - Responsiveness: Modern, mobile-first, and premium aesthetic.

5. **Resource Management**
   - Documentation: Before major changes, update `implementation_plan.md`.
<!-- END:nextjs-agent-rules -->
