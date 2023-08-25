import numpy as np
import torch
import scipy.io.wavfile as wavfile
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
import matplotlib.pyplot as plt
from matplotlib.colors import Normalize


def speech_fluency(audiofile_path):
    # Step 1: Load the trained model
    resnet101_model = models.resnext101_64x4d()
    new_classifier = nn.Linear(2048, 6, bias=True)
    resnet101_model.fc = new_classifier

    resnet101_model.load_state_dict(torch.load('stutter_model3.pth', map_location=torch.device('cpu')))

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    resnet101_model = resnet101_model.to(device)
    resnet101_model.eval()

    # Step 2: Load and preprocess the audio data (e.g., audio file or spectrogram)
    plt.ioff()
    sample_rate, audio_data = wavfile.read(audiofile_path)
    if sample_rate != 16000: 
        print(sample_rate)
        sample_rate = 16000

    n_fft = 256
    noverlap = 128
    powerSpectrum, frequenciesFound, time, imageAxis = plt.specgram(audio_data, Fs=sample_rate, NFFT=n_fft, noverlap=noverlap, cmap='viridis')
    img = imageAxis.get_array()

    cmap = plt.get_cmap('viridis')
    norm = Normalize(vmin=img.min(), vmax=img.max())
    rgba_img = cmap(norm(img))

    # Remove alpha channel and convert to 8-bit integer (0-255)
    rgb_img = (rgba_img[:, :, :3] * 255).astype(np.uint8)

    # Squeezes pixel values between 0 and 1 (Model was trained with this transformation, so keep this for consistency)
    transform = transforms.ToTensor()
    img_tensor = transform(rgb_img).unsqueeze(0).to(device).float()
    # Perform inference
    with torch.no_grad():
        output = resnet101_model(img_tensor)

    # Assuming your model uses sigmoid activation for multi-label classification
    predicted_probs = torch.sigmoid(output)
    predicted_labels = (predicted_probs >= 0.5).cpu().numpy().astype(int)

    # Print the predicted labels and the confidence levels
    label_names = ["Prolongation", "Block", "SoundRep", "WordRep", "Interjection", "NoStutteredWords"]
    for label, prob in zip(label_names, predicted_probs.squeeze().cpu().numpy()):
        print(f"{label}: Prediction - {predicted_labels.squeeze()[label_names.index(label)]}, Confidence - {prob:.4f}")