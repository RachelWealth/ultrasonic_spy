import pyaudio
import numpy as np
import matplotlib.pyplot as plt

# Constants
CHUNK = 1024  # Number of frames per buffer
FORMAT = pyaudio.paInt16  # Audio format (16-bit PCM)
CHANNELS = 1  # Number of audio channels (1 for mono, 2 for stereo)
RATE = 44100  # Sampling rate (samples per second)
FREQ_MAX = 20000  # Maximum display frequency in Hz

# Initialize PyAudio
p = pyaudio.PyAudio()

# Open a stream
stream = p.open(format=FORMAT,
                channels=CHANNELS,
                rate=RATE,
                input=True,
                frames_per_buffer=CHUNK)

# Create a figure and axis for the plot
fig, ax = plt.subplots()
x_values = np.logspace(2, np.log10(RATE/2), CHUNK)  # Logarithmic scale for x-axis
line, = ax.semilogx(x_values, np.random.rand(CHUNK))

# Customize the plot
ax.set_ylim(0, 255)
ax.set_xlim(20, FREQ_MAX)
plt.xlabel('Frequency (Hz)')
plt.ylabel('Amplitude')

# Update function for real-time plotting
def update_plot(frame):
    data = np.frombuffer(frame, dtype=np.int16)
    fft_data = np.fft.fft(data)
    freq = np.fft.fftfreq(len(fft_data), 1/RATE)

    # Filter frequencies above FREQ_MAX Hz
    mask = freq > FREQ_MAX
    fft_data[mask] = 0

    # Inverse FFT to get filtered signal
    filtered_data = np.fft.ifft(fft_data)

    line.set_ydata(filtered_data.real)
    return line,

# Animation loop for real-time plotting
try:
    while True:
        frame = stream.read(CHUNK)
        update_plot(frame)
        plt.pause(0.01)  # Small delay to allow the plot to update
except KeyboardInterrupt:
    # Handle KeyboardInterrupt to close the stream and terminate PyAudio
    stream.stop_stream()
    stream.close()
    p.terminate()
    plt.close()
