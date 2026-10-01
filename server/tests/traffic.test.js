import { describe, it, expect, vi } from 'vitest';
import { postInferenceData } from '../controllers/trafficController.js';

describe('Traffic Controller', () => {
  describe('postInferenceData', () => {
    it('returns 400 if vehicle_count is missing', async () => {
      const req = { body: { source: 'test' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };
      const next = vi.fn();

      await postInferenceData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid payload: vehicle_count required.'
      });
    });

    it('returns 400 if vehicle_count is invalid', async () => {
      const req = { body: { vehicle_count: -5, source: 'test' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };
      const next = vi.fn();

      await postInferenceData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid payload: vehicle_count must be a non-negative number.'
      });
    });

    it('returns success for valid payload', async () => {
      const req = { body: { vehicle_count: 10, source: 'test' } };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      };
      const next = vi.fn();

      await postInferenceData(req, res, next);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Inference data received.'
      }));
    });
  });
});
