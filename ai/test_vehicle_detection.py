import os
import pytest
import json
from unittest.mock import patch, MagicMock

# Assuming process_video can be slightly refactored or we can just test parts
import vehicle_detection

def test_missing_video(capsys):
    vehicle_detection.process_video("missing_video.mp4", "yolov8n.pt", None)
    captured = capsys.readouterr()
    assert "Error: Input video not found: missing_video.mp4" in captured.out

def test_missing_model(capsys):
    with patch('vehicle_detection.YOLO') as mock_yolo, patch('os.path.exists') as mock_exists:
        mock_exists.return_value = True
        mock_yolo.side_effect = Exception("Model not found")
        vehicle_detection.process_video("sample_video/gate_video.mp4", "invalid_model.pt", None)
        captured = capsys.readouterr()
        assert "Error: Failed to load YOLO model" in captured.out or "Error: Input video not found" in captured.out

def test_backend_submission_failure(capsys):
    with patch('requests.post') as mock_post, patch('os.path.exists') as mock_exists, patch('vehicle_detection.YOLO') as mock_yolo:
        mock_post.side_effect = Exception("Connection refused")
        mock_exists.return_value = True
        mock_yolo.return_value = MagicMock()
        # Need a mock for cap to prevent actual processing if we just want to test API
        with patch('cv2.VideoCapture') as mock_cap, patch('cv2.VideoWriter'):
            mock_cap.return_value.isOpened.return_value = True
            mock_cap.return_value.read.return_value = (False, None)
            mock_cap.return_value.get.return_value = 100
            
            # Run
            vehicle_detection.process_video("sample_video/gate_video.mp4", "yolov8n.pt", "http://localhost:5050/api")
            
            captured = capsys.readouterr()
            assert "Warning: Inference generated locally, but backend submission failed" in captured.out
