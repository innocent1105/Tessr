const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const captureBtn = document.getElementById('capture-btn');
        const switchCameraBtn = document.getElementById('switch-camera-btn');
        const ocrResult = document.getElementById('ocr-result');
        const context = canvas.getContext('2d');
        const displayPanel = document.getElementById("text-display-panel");
        // const loader = document.getElementById("loader");

        let currentFacingMode = "user";  // Start with back camera
        let stream;

        async function startVideo(facingMode) {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            try {
               stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { exact: facingMode }
                    }
                });

                video.srcObject = stream;
            } catch (error) {
                console.error("Error accessing the camera: ", error);
            }
        }

        captureBtn.addEventListener('click', () => {
            // loader.style.height = "100";
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/png');

            // Use Tesseract.js for OCR processing
            Tesseract.recognize(
                imageData,
                'eng',
                {
                    logger: m => console.log(m)
                }
            ).then(result => {
                // Display the text
                ocrResult.textContent = result.data.text;
                // loader.style.height = "0";
                displayPanel.style.height = "55%";
            }).catch(error => {
                console.error("Error processing OCR: ", error);
                ocrResult.textContent = "Error processing OCR.";
            });
        });

        // switchCameraBtn.addEventListener('click', () => {
        //     // Toggle between front and back camera
        //     currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
        //     startVideo(currentFacingMode);
        // });

        // Start the video with the initial facing mode
        window.addEventListener("load", () => startVideo(currentFacingMode));