
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const ocrResult = document.getElementById('ocr-result');
const context = canvas.getContext('2d');
const displayPanel = document.getElementById("text-display-panel");

// Access the user's webcam
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(error => {
    console.error("Error accessing the webcam: ", error);
  });

// capture the image and perform OCR
captureBtn.addEventListener('click', () => {
  // Draw the current video frame to the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the canvas image to a data URL
  const imageData = canvas.toDataURL('image/png');
  Tesseract.recognize(
    imageData,
    'eng',
    {
      logger: m => console.log(m)
    }
  ).then(result => {
    // Display the text 
    ocrResult.textContent = result.data.text;
    displayPanel.style.height = "55%";
  }).catch(error => {
    console.error("Error processing OCR: ", error);
    ocrResult.textContent = "Error processing OCR.";
  });
});
