import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import tensorflow as tf
import tempfile
import os
import cv2
import mediapipe as mp
from scipy.interpolate import interp1d
import shutil
import json

# --- 1. Khởi tạo FastAPI App ---
app = FastAPI(title="Vietnamese Sign Language API")

# --- 2. Cấu hình CORS (Cho phép React gọi) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Cho phép tất cả (để test)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. Định nghĩa các hằng số (Lấy từ code Streamlit) ---
mp_holistic = mp.solutions.holistic
N_UPPER_BODY_POSE_LANDMARKS = 25
N_HAND_LANDMARKS = 21
N_TOTAL_LANDMARKS = N_UPPER_BODY_POSE_LANDMARKS + N_HAND_LANDMARKS + N_HAND_LANDMARKS

# --- 4. Tải Model và Label Map (Chỉ chạy 1 lần khi server khởi động) ---

def load_model():
    """Tải model Keras (file bạn đã copy vào)"""
    # Đường dẫn này là tương đối so với thư mục 'server' (nơi chạy uvicorn)
    return tf.keras.models.load_model('app/final_model.keras')

def load_label_map():
    """Tải file map (file bạn đã copy vào)"""
    # Đường dẫn này là tương đối so với thư mục 'server'
    with open('app/label_map.json', 'r', encoding='utf-8') as f:
        label_map = json.load(f)
    # Tạo map đảo ngược: {0: "Xin chao", 1: "Tam biet", ...}
    inv_label_map = {v: k for k, v in label_map.items()}
    return label_map, inv_label_map

print("Đang tải model và label map...")
model = load_model()
label_map, inv_label_map = load_label_map()
print("Tải model và label map thành công!")


# --- 5. Các hàm xử lý (Copy y hệt từ code Streamlit) ---

def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image.flags.writeable = False
    results = model.process(image)
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    return image, results

def extract_keypoints(results):
    pose_kps = np.zeros((N_UPPER_BODY_POSE_LANDMARKS, 3))
    left_hand_kps = np.zeros((N_HAND_LANDMARKS, 3))
    right_hand_kps = np.zeros((N_HAND_LANDMARKS, 3))
    if results and results.pose_landmarks:
        for i in range(N_UPPER_BODY_POSE_LANDMARKS):
            if i < len(results.pose_landmarks.landmark):
                res = results.pose_landmarks.landmark[i]
                pose_kps[i] = [res.x, res.y, res.z]
    if results and results.left_hand_landmarks:
        left_hand_kps = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark])
    if results and results.right_hand_landmarks:
        right_hand_kps = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark])
    keypoints = np.concatenate([pose_kps,left_hand_kps, right_hand_kps])
    return keypoints.flatten()

def interpolate_keypoints(keypoints_sequence, target_len=60):
    if len(keypoints_sequence) == 0:
        return None

    original_times = np.linspace(0, 1, len(keypoints_sequence))
    target_times = np.linspace(0, 1, target_len)

    num_features = keypoints_sequence[0].shape[0]
    interpolated_sequence = np.zeros((target_len, num_features))

    for feature_idx in range(num_features):
        feature_values = [frame[feature_idx] for frame in keypoints_sequence]
        interpolator = interp1d(
            original_times, feature_values,
            kind='cubic', # Loại nội suy bậc 3
            bounds_error=False,
            fill_value="extrapolate"
        )
        interpolated_sequence[:, feature_idx] = interpolator(target_times)

    return interpolated_sequence

# ===============================================
# === HÀM ĐÃ SỬA LỖI STEP (PHIÊN BẢN MỚI NHẤT) ===
# ===============================================
def sequence_frames(video_path, holistic):
    """
    Đây là hàm xử lý chính: Mở video, trích xuất keypoints
    """
    print("\n[DEBUG] Bắt đầu xử lý video (phiên bản MỚI: đọc tất cả frame)...")
    sequence_frames = []
    cap = cv2.VideoCapture(video_path)
    
    if not cap.isOpened():
        print("[DEBUG] LỖI: cap.isOpened() == False. Không thể mở video.")
        return []

    # BỎ QUA total_frames VÀ step VÌ CHÚNG KHÔNG ĐÁNG TIN CẬY
    
    processed_frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            # Hết video
            break

        # KHÔNG CÓ LOGIC 'step' NỮA, CHÚNG TA XỬ LÝ MỌI FRAME
        
        try:
            image, results = mediapipe_detection(frame, holistic)
            keypoints = extract_keypoints(results)

            if keypoints is not None:
                sequence_frames.append(keypoints)
                processed_frame_count += 1

        except Exception as e:
            # Bỏ qua frame nếu có lỗi
            print(f"[DEBUG] Lỗi xử lý 1 frame: {e}")
            continue

    cap.release()
    print(f"[DEBUG] Xử lý video xong. Tổng số frame đã xử lý = {processed_frame_count}")
    print(f"[DEBUG] Trả về sequence với độ dài = {len(sequence_frames)}\n")
    return sequence_frames


# --- 6. Endpoint API (Phần chính của FastAPI) ---

@app.get("/")
def read_root():
    return {"message": "Chào mừng đến với API Dịch Ngôn ngữ Ký hiệu (MediaPipe + TensorFlow)"}

@app.post("/translate-sign-language/")
async def translate_video(file: UploadFile = File(...)):
    """
    Endpoint nhận video từ React, xử lý và trả về JSON
    """
    video_path = None
    try:
        # 1. Lưu file video upload (thường là .webm) vào file tạm
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            video_path = temp_file.name

        print(f"Đã lưu video tạm tại: {video_path}")
        
        # 2. Khởi tạo MediaPipe
        with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
            
            # 3. Trích xuất chuỗi keypoints (gọi hàm MỚI)
            sequence = sequence_frames(video_path, holistic)

        if not sequence:
            return {"error": "Không thể trích xuất keypoints. Video có thể quá ngắn hoặc không rõ."}

        # 4. KIỂM TRA LỖI VIDEO NGẮN
        MIN_FRAMES_REQUIRED = 4 
    
        if len(sequence) < MIN_FRAMES_REQUIRED:
            print(f"Lỗi: Video quá ngắn. Chỉ có {len(sequence)} frames, cần ít nhất {MIN_FRAMES_REQUIRED}.")
            return {"error": f"Video quá ngắn. Chỉ có {len(sequence)} frames, cần ít nhất {MIN_FRAMES_REQUIRED}. Vui lòng quay video dài hơn."}

        # 5. Nội suy chuỗi về 60 frames
        kp = interpolate_keypoints(sequence)
        if kp is None:
            return {"error": "Lỗi nội suy (interpolate) keypoints."}

        # 6. Dự đoán
        result = model.predict(np.expand_dims(kp, axis=0)) 
        pred_idx = np.argmax(result, axis=1)
        
        # 7. Tra cứu kết quả
        final_label = inv_label_map[pred_idx[0]]
        print(f"Kết quả dự đoán: {final_label}")

        # 8. Trả về kết quả cho React
        return {"translation": final_label}

    except Exception as e:
        print(f"LỖI TOÀN CỤC: {e}")
        return {"error": str(e)}
    finally:
        # 9. Xóa file tạm
        if video_path and os.path.exists(video_path):
            os.remove(video_path)
            print(f"Đã xóa video tạm: {video_path}")