// Google Script URL (Placeholder - User will update this)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyE4bpbGaOQyL4Un8nMLhnWwv4KKh9ZTkJC0NnPB41sYU4xqSzbiMD8CmwkM7Ym0z8F/exec';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const reimbursementCheck = document.getElementById('reimbursementCheck');
    const reimbursementSection = document.getElementById('reimbursementSection');

    // Toggle Reimbursement Section
    reimbursementCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            reimbursementSection.style.display = 'block';
            document.getElementById('origin').required = true;
            document.getElementById('cost').required = true;
            document.getElementById('attachment').required = true;
        } else {
            reimbursementSection.style.display = 'none';
            document.getElementById('origin').required = false;
            document.getElementById('cost').required = false;
            document.getElementById('attachment').required = false;
        }
    });

    // Handle Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validation check for user config
        if (SCRIPT_URL === 'PLACEHOLDER_URL_FROM_SETUP_GUIDE') {
            alert('SYSTEM ERROR: The backend URL has not been configured yet. Please look at GOOGLE_SHEETS_SETUP.md');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const errorMsg = document.getElementById('formError');
        const successDiv = document.getElementById('registrationSuccess');
        const btnText = submitBtn.querySelector('.btn-text');

        // Reset state
        errorMsg.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        btnText.textContent = 'Submitting...';

        try {
            // Collect Data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.needsReimbursement = reimbursementCheck.checked;

            // Handle File Upload if present
            if (data.attachment && data.attachment.size > 0 && reimbursementCheck.checked) {
                try {
                    const fileData = await readFileAsBase64(data.attachment);
                    data.fileContent = fileData.content;
                    data.fileName = fileData.name;
                    data.mimeType = fileData.type;
                } catch (fileError) {
                    console.error('File read error:', fileError);
                    throw new Error('Failed to process the uploaded file.');
                }
            } else {
                // Remove file object if not used/empty to avoid serialization issues
                delete data.attachment;
            }

            // Send to Google Script
            // We use 'no-cors' mode initially usually, but for JSON response we need cors allowed in script
            // Apps Script requires POST requests to be x-www-form-urlencoded or plain text bodies often for simpler handling,
            // but standard fetch with JSON body works if the script handles doPost(e) correctly with e.postData.contents

            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                // Important to prevent CORS preflight issues with some browsers/script setups:
                // utilizing 'text/plain' triggers simple request. The script must parse manually.
                headers: { 'Content-Type': 'text/plain' }
            });

            const result = await response.json();

            if (result.status === 'success') {
                form.style.display = 'none';
                successDiv.style.display = 'block';
                // Scroll to top
                window.scrollTo(0, 0);
            } else {
                throw new Error(result.message || 'Unknown server error');
            }

        } catch (error) {
            console.error('Submission Error:', error);
            errorMsg.textContent = 'Error: ' + error.message;
            errorMsg.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            btnText.textContent = 'Submit Registration';
        }
    });
});

// Helper: Read file as Base64
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            // result is like "data:application/pdf;base64,JVBERi0xLjQK..."
            // We need to split header if we just want raw base64, but keeping it full is fine for script parsing
            // Let's send pure base64 part
            const content = result.split(',')[1];
            resolve({
                name: file.name,
                type: file.type,
                content: content
            });
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
