// Google Script URL (Placeholder - User will update this)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyE4bpbGaOQyL4Un8nMLhnWwv4KKh9ZTkJC0NnPB41sYU4xqSzbiMD8CmwkM7Ym0z8F/exec';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');

    // Field validation function
    function validateField(input) {
        const errorSpan = document.getElementById(input.id + '-error');
        if (!errorSpan) return true;

        let isValid = true;
        let errorMessage = '';

        if (input.type === 'checkbox') {
            // Checkbox validation (e.g., privacy consent)
            if (input.required && !input.checked) {
                isValid = false;
                errorMessage = 'You must accept the privacy policy to register';
            }
        } else if (input.required && !input.value.trim()) {
            isValid = false;
            errorMessage = 'This field must be completed';
        } else if (input.type === 'email' && input.value.trim()) {
            // Check email format - must have @ and at least one dot after @
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value) || !input.value.includes('.')) {
                isValid = false;
                errorMessage = 'The email is incorrect (must contain @ and .)';
            }
        } else if (input.id === 'affiliation' && input.value.trim()) {
            // Strict validation: affiliation must match exactly one from the list
            if (typeof INSTITUTIONS !== 'undefined') {
                const valueToCheck = input.value.trim();
                const isInList = INSTITUTIONS.some(inst => inst.name === valueToCheck);
                
                if (!isInList) {
                    isValid = false;
                    errorMessage = 'This field must be completed with the selection of an institution from the dropdown. If yours is not listed, please select "Other"';
                }
            }
        }

        if (isValid) {
            errorSpan.style.display = 'none';
            input.classList.remove('invalid');
        } else {
            errorSpan.textContent = errorMessage;
            errorSpan.style.display = 'block';
            input.classList.add('invalid');
        }

        return isValid;
    }

    // Add input validation to clear errors (but don't validate on blur)
    const requiredFields = ['firstName', 'lastName', 'email', 'affiliation', 'privacyConsent'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // For checkbox, listen to 'change' event
            const eventType = field.type === 'checkbox' ? 'change' : 'input';
            
            field.addEventListener(eventType, () => {
                // Clear error on typing/checking
                const errorSpan = document.getElementById(fieldId + '-error');
                if (errorSpan) {
                    if (field.type === 'checkbox') {
                        if (field.checked) {
                            errorSpan.style.display = 'none';
                            field.classList.remove('invalid');
                        }
                    } else if (field.value.trim()) {
                        errorSpan.style.display = 'none';
                        field.classList.remove('invalid');
                    }
                }
            });
        }
    });

    // --- INTELLIGENT AUTOCOMPLETE LOGIC ---
    const affiliationInput = document.getElementById('affiliation');
    const dropdown = document.getElementById('affiliation-dropdown');

    if (affiliationInput && dropdown && typeof INSTITUTIONS !== 'undefined') {

        // Levenshtein distance for fuzzy matching
        function levenshtein(a, b) {
            const matrix = [];
            for (let i = 0; i <= b.length; i++) matrix[i] = [i];
            for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    if (b.charAt(i - 1) === a.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1, // substitution
                            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1) // insertion/deletion
                        );
                    }
                }
            }
            return matrix[b.length][a.length];
        }

        // Filter institutions based on query
        function findMatches(query) {
            query = query.toLowerCase().trim();
            // If empty query, return ALL institutions
            if (!query) return INSTITUTIONS;

            const queryTokens = query.split(/\s+/).filter(t => t.length > 2); // Ignore short words like "of", "di"

            return INSTITUTIONS.filter(inst => {
                const nameLower = inst.name.toLowerCase();

                // 1. Exact/Start substring match of full query (High Priority)
                if (nameLower.includes(query)) return true;
                if (inst.keywords.some(k => k.toLowerCase().includes(query))) return true;

                // 2. Token-based Fuzzy Match
                // For "Univdeersry of Padova", tokens are "Univdeersry", "Padova"
                // We want at least one significant token to match strongly, OR all tokens to match somewhat

                // Collect all target tokens (name words + keywords)
                const targetTokens = [...inst.name.toLowerCase().split(/\s+/), ...inst.keywords.map(k => k.toLowerCase())];

                // Count how many query tokens find a match
                let matchedTokensCount = 0;

                for (const qToken of queryTokens) {
                    // Exact match on token
                    if (targetTokens.some(t => t.includes(qToken))) {
                        matchedTokensCount++;
                        continue;
                    }

                    // Fuzzy match on token
                    // Allow edits: 1 for short words (4-6), 2 for medium (7-9), 3 for long (>9)
                    const allowedEdits = qToken.length > 9 ? 3 : (qToken.length > 6 ? 2 : 1);

                    try {
                        if (targetTokens.some(t => Math.abs(t.length - qToken.length) <= allowedEdits && levenshtein(qToken, t) <= allowedEdits)) {
                            matchedTokensCount++;
                        }
                    } catch (e) {
                        // Fallback for very short tokens or edge cases
                    }
                }

                // If we have query tokens, we need at least one strong match or majority matches
                if (queryTokens.length > 0) {
                    // If just 1 token, it must match
                    if (queryTokens.length === 1) return matchedTokensCount === 1;
                    // If multiple, require at least 50% matching (e.g. "Univ of Padova" -> "Univ" (maybe), "Padova" (yes) -> 2/3 or 1/2)
                    return matchedTokensCount >= Math.ceil(queryTokens.length / 2);
                }

                return false;
            }).slice(0, 15); // Increased limit for search results
        }

        function renderDropdown(matches) {
            dropdown.innerHTML = '';
            // Always show if we have matches (default or searched)
            if (matches.length === 0) {
                dropdown.style.display = 'none';
                return;
            }

            matches.forEach(inst => {
                const div = document.createElement('div');
                div.className = 'autocomplete-item';
                div.textContent = inst.name;

                div.addEventListener('mousedown', (e) => { // mousedown fires before blur
                    e.preventDefault(); // Prevent input blur
                    affiliationInput.value = inst.name;
                    dropdown.style.display = 'none';
                    // Re-validate field immediately
                    validateField(affiliationInput);
                });

                dropdown.appendChild(div);
            });
            dropdown.style.display = 'block';
        }

        affiliationInput.addEventListener('input', () => {
            const matches = findMatches(affiliationInput.value);
            renderDropdown(matches);
        });

        // Show default list on focus
        affiliationInput.addEventListener('focus', () => {
            const matches = findMatches(affiliationInput.value);
            renderDropdown(matches);
        });

        // Show default list on click (if already focused but closed)
        affiliationInput.addEventListener('click', () => {
            const matches = findMatches(affiliationInput.value);
            renderDropdown(matches);
        });

        // Handle clicks on the chevron (container ::after)
        const container = document.querySelector('.autocomplete-container');
        if (container) {
            container.addEventListener('click', (e) => {
                // If click is on the container (and not bubbled from input), focus input
                // This covers clicking the chevron since it's part of the container visually/structurally
                if (e.target !== affiliationInput) {
                    affiliationInput.focus();
                    const matches = findMatches(affiliationInput.value);
                    renderDropdown(matches);
                }
            });
        }

        affiliationInput.addEventListener('blur', () => {
            // Delay hiding to allow click event to register
            setTimeout(() => {
                dropdown.style.display = 'none';
            }, 200);
        });

        // Close on escape
        affiliationInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') dropdown.style.display = 'none';
        });
    }

    // Handle Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all required fields first
        let allValid = true;
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !validateField(field)) {
                allValid = false;
            }
        });

        if (!allValid) {
            // Find first invalid field and scroll to it
            const firstInvalid = document.querySelector('.form-input.invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }

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
