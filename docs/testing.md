# Testing Documentation

## Test Environment
- **Node.js**: v20.18.0
- **Python**: 3.14.6
- **Frontend Framework**: React / Vite
- **Testing Frameworks**: Vitest (Backend), Pytest (AI)
- **Frontend Test Command**: (Currently omitted for simplicity, basic ErrorBoundary implemented)
- **Backend Test Command**: `cd server && npx vitest`
- **Python Test Command**: `cd ai && pytest`

## Unit Tests

| Module | Test | Expected Result |
|---|---|---|
| Traffic API | Missing vehicle_count | HTTP 400 |
| Traffic API | Invalid vehicle_count | HTTP 400 |
| Traffic API | Valid inference payload | Accepted |
| YOLO Result | Missing video | Error |
| YOLO Result | Missing model | Error |
| YOLO Result | Backend submission failure | Warning |

> Note: Field observation endpoints are partially implemented via Supabase direct calls, tests focused on inference payload validation as per requirements.
