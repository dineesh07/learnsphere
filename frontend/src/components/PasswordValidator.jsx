import { CheckCircle, XCircle } from 'lucide-react';
import { passwordRequirements } from '../utils/passwordValidation';

const PasswordValidator = ({ password }) => {
    return (
        <div className="mt-3 space-y-2">
            <p className="text-sm font-medium text-gray-700">Password requirements:</p>
            <div className="space-y-1">
                {passwordRequirements.map((requirement) => {
                    const passed = requirement.test(password);
                    return (
                        <div
                            key={requirement.id}
                            className={`flex items-center gap-2 text-sm ${passed ? 'text-green-600' : 'text-gray-500'
                                }`}
                        >
                            {passed ? (
                                <CheckCircle className="w-4 h-4" />
                            ) : (
                                <XCircle className="w-4 h-4" />
                            )}
                            <span>{requirement.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PasswordValidator;
