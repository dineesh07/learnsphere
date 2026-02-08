import { CheckCircle, XCircle } from 'lucide-react';
import { passwordRequirements } from '../utils/passwordValidation';

const PasswordValidator = ({ password }) => {
    return (
        <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Security Requirements</p>
            <div className="grid grid-cols-1 gap-2">
                {passwordRequirements.map((requirement) => {
                    const passed = requirement.test(password);
                    return (
                        <div
                            key={requirement.id}
                            className={`flex items-center gap-2.5 text-sm transition-all duration-300 ${passed ? 'text-green-600 font-semibold' : 'text-gray-400'
                                }`}
                        >
                            <div className={`p-0.5 rounded-full transition-colors ${passed ? 'bg-green-100' : 'bg-gray-100'}`}>
                                {passed ? (
                                    <CheckCircle className="w-3.5 h-3.5" strokeWidth={3} />
                                ) : (
                                    <XCircle className="w-3.5 h-3.5" />
                                )}
                            </div>
                            <span className="text-[13px]">{requirement.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default PasswordValidator;
