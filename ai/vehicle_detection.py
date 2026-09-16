import argparse
import cv2
import json
import os
from datetime import datetime
from ultralytics import YOLO

def parse_args():
    parser = argparse.ArgumentParser(description="YOLO Vehicle Detection for SMARTGATE AI")
    parser.add_argument('--source', type=str, help='Path to the sample video file', default=None)
    parser.add_argument('--model', type=str, default='yolov8n.pt', help='YOLO model to use (default: yolov8n.pt)')
    return parser.parse_args()

def process_video(source, model_path):
    if not source or not os.path.exists(source):
        print(f"Error: Could not find video source at '{source}'.")
        print("Please place a sample traffic video in 'ai/sample_video/' and run the script again.")
        print("Example: python vehicle_detection.py --source sample_video/gate_video.mp4")
        return

    print(f"Loading YOLO model: {model_path}")
    model = YOLO(model_path)
    
    # Class IDs for YOLOv8 (COCO dataset): 2: car, 3: motorcycle, 5: bus, 7: truck
    target_classes = [2, 3, 5, 7]
    class_names = {2: 'Car', 3: 'Motorcycle', 5: 'Bus', 7: 'Truck'}
    
    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        print(f"Error: Failed to open video {source}")
        return

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    
    output_filename = os.path.basename(source)
    output_path = os.path.join('output', f"annotated_{output_filename}")
    os.makedirs('output', exist_ok=True)
    os.makedirs('results', exist_ok=True)
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    frame_count = 0
    total_counts = {'cars': 0, 'motorcycles': 0, 'buses': 0, 'trucks': 0}
    
    print(f"Processing video: {source}...")
    
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
            
        frame_count += 1
        results = model(frame, classes=target_classes, verbose=False)
        
        # Count vehicles in the current frame
        current_counts = {'cars': 0, 'motorcycles': 0, 'buses': 0, 'trucks': 0}
        
        for r in results:
            boxes = r.boxes
            for box in boxes:
                cls_id = int(box.cls[0])
                if cls_id == 2: current_counts['cars'] += 1
                elif cls_id == 3: current_counts['motorcycles'] += 1
                elif cls_id == 5: current_counts['buses'] += 1
                elif cls_id == 7: current_counts['trucks'] += 1
        
        # Keep track of max vehicles detected in a single frame to represent 'total volume' in this naive implementation
        total_counts['cars'] = max(total_counts['cars'], current_counts['cars'])
        total_counts['motorcycles'] = max(total_counts['motorcycles'], current_counts['motorcycles'])
        total_counts['buses'] = max(total_counts['buses'], current_counts['buses'])
        total_counts['trucks'] = max(total_counts['trucks'], current_counts['trucks'])
        
        # Annotate frame
        annotated_frame = results[0].plot()
        
        # Display counts on frame
        total_vehicles = sum(current_counts.values())
        cv2.putText(annotated_frame, f"Total Vehicles: {total_vehicles}", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        out.write(annotated_frame)
        
    cap.release()
    out.release()
    
    print(f"Processing complete. Annotated video saved to {output_path}")
    
    # Generate structured JSON
    timestamp = datetime.now().isoformat()
    total = sum(total_counts.values())
    
    results_json = {
        "timestamp": timestamp,
        "vehicle_count": total,
        "cars": total_counts['cars'],
        "motorcycles": total_counts['motorcycles'],
        "buses": total_counts['buses'],
        "trucks": total_counts['trucks'],
        "source": "YOLO sample inference",
        "is_simulated": False
    }
    
    json_path = os.path.join('results', f"inference_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
    with open(json_path, 'w') as f:
        json.dump(results_json, f, indent=2)
        
    print(f"Inference results saved to {json_path}")
    print(json.dumps(results_json, indent=2))

if __name__ == "__main__":
    args = parse_args()
    process_video(args.source, args.model)
