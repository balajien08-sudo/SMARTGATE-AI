# SMARTGATE AI - Python YOLO Vehicle Detection

This module implements the AI traffic monitoring prototype for the college main gate using Ultralytics YOLOv8.

## Prerequisites

- Python 3.8 or higher

## Installation

1. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Model Download
The script will automatically download the default `yolov8n.pt` model on its first run if it does not exist locally.

## Sample Video Setup
Since this is a prototype, you must provide a sample video of gate traffic.
1. Place your video (e.g., `gate_video.mp4`) in the `ai/sample_video/` directory.

## How to Run
Run the detection script by providing the path to your sample video:
```bash
python vehicle_detection.py --source sample_video/gate_video.mp4
```

If no video is provided or found, the script will display a clear setup message explaining where to place it.

## Expected Output
- **Annotated Video**: The script draws bounding boxes and class labels (Car, Motorcycle, Bus, Truck), and displays the total vehicle count. It saves the output video in the `ai/output/` folder.
- **JSON Results**: It exports a structured JSON file containing the detected vehicle counts into the `ai/results/` folder.

Example JSON output:
```json
{
  "timestamp": "2026-09-16T10:30:00",
  "vehicle_count": 25,
  "cars": 12,
  "motorcycles": 10,
  "buses": 2,
  "trucks": 1,
  "source": "YOLO sample inference",
  "is_simulated": false
}
```

## Supported Vehicle Classes
The model detects the following classes from the COCO dataset:
- Car (ID: 2)
- Motorcycle (ID: 3)
- Bus (ID: 5)
- Truck (ID: 7)

## Limitations
- This script currently represents a prototype inference pipeline running on sample footage.
- It does not track objects continuously across frames perfectly (no DeepSORT/ByteTrack implemented in this prototype). The counts represent the maximum number of vehicles seen in a single frame to approximate volume without duplicate counting over time.

## Difference Between Sample Footage and Real Deployment
- **Sample Footage**: Processes pre-recorded `.mp4` files.
- **Real Deployment**: In a real deployment, the script would connect to an RTSP IP camera stream (e.g., `--source rtsp://admin:pass@192.168.1.100:554/stream1`) and continuously push JSON outputs to the Node.js backend.
