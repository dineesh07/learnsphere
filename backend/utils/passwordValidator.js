/**
 * Password Validation Utility
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 special character
 */

const validatePassword = (password) => {
    const errors = [];

    // Check minimum length
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

const getPasswordRequirements = () => {
    return [
        { rule: 'Minimum 8 characters', regex: /.{8,}/ },
        { rule: 'At least one uppercase letter', regex: /[A-Z]/ },
        { rule: 'At least one special character', regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ }
    ];
};

module.exports = {
    validatePassword,
    getPasswordRequirements
};
