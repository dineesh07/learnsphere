/**
 * Password Validation Helpers for Frontend
 * Provides validation rules and checker functions
 */

export const passwordRequirements = [
    {
        id: 'length',
        label: 'Minimum 8 characters',
        test: (password) => password.length >= 8
    },
    {
        id: 'uppercase',
        label: 'At least one uppercase letter',
        test: (password) => /[A-Z]/.test(password)
    },
    {
        id: 'special',
        label: 'At least one special character (!@#$%^&*)',
        test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }
];

export const validatePassword = (password) => {
    const results = passwordRequirements.map(req => ({
        ...req,
        passed: req.test(password)
    }));

    const allPassed = results.every(r => r.passed);

    return {
        isValid: allPassed,
        results
    };
};
