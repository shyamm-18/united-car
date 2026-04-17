import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, FileText, UserCheck, CreditCard } from 'lucide-react';

const RentalRequirements = () => {
    const requirements = [
        {
            title: "Age & License",
            icon: <UserCheck className="h-6 w-6 text-blue-500" />,
            points: [
                "Minimum age for self-drive is 21 years.",
                "Original Indian Driving License (DL) is mandatory.",
                "Commercial or Transport license is not required for private rentals.",
                "International Driving Permit (IDP) required for foreign nationals."
            ]
        },
        {
            title: "Identity Verification",
            icon: <FileText className="h-6 w-6 text-blue-500" />,
            points: [
                "Aadhaar Card is mandatory for Indian Residents.",
                "Passport & Visa copy for International travelers.",
                "Local Address Proof (if different from Aadhaar/Passport).",
                "Mobile number must be linked with Aadhaar."
            ]
        },
        {
            title: "Security Deposit",
            icon: <CreditCard className="h-6 w-6 text-blue-500" />,
            points: [
                "A refundable security deposit is required for all self-drive rentals.",
                "Deposit amount varies based on the vehicle category (Luxury/SUV).",
                "Deposit is processed via UPI, Credit Card, or Cash.",
                "Refund is processed within 24-48 hours of vehicle return."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-black mb-4 dark:text-white uppercase tracking-tighter italic">Rental Requirements</h1>
                    <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">To ensure a seamless premium experience, please ensure you meet the following criteria before booking.</p>
                </motion.div>

                <div className="space-y-8">
                    {requirements.map((req, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass p-8 rounded-[2rem] bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                                    {req.icon}
                                </div>
                                <h3 className="text-2xl font-bold dark:text-white">{req.title}</h3>
                            </div>
                            <ul className="space-y-4">
                                {req.points.map((point, pIdx) => (
                                    <li key={pIdx} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-600 dark:text-slate-400 font-medium">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="p-8 rounded-[2rem] bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30"
                    >
                        <div className="flex items-start gap-4">
                            <AlertCircle className="h-6 w-6 text-indigo-600 shrink-0" />
                            <div>
                                <h4 className="font-bold text-indigo-900 dark:text-indigo-400 mb-2 uppercase text-xs tracking-widest">Important Notice</h4>
                                <p className="text-sm text-indigo-800/70 dark:text-indigo-400/60 leading-relaxed">
                                    UNITED CAR reserves the right to cancel any booking if the documents provided do not match our eligibility criteria or if the driver does not appear fit for driving at the time of pickup.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RentalRequirements;
