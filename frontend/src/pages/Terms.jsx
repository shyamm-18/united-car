import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Gavel, Car, AlertTriangle } from 'lucide-react';

const Terms = () => {
    const sections = [
        {
            title: "Usage Policy",
            icon: <Car className="h-6 w-6 text-blue-500" />,
            content: "Rental vehicles are provided for legal passenger transportation only. Use of vehicles for commercial haulage, towing, racing, or illegal activities is strictly prohibited. Smoking and alcohol consumption inside the vehicle are prohibited and will result in heavy cleanup fines."
        },
        {
            title: "Speed Limits & Telemetry",
            icon: <Shield className="h-6 w-6 text-blue-500" />,
            content: "For your safety, all luxury vehicles are equipped with GPS telemetry. A maximum speed limit of 100 KM/H is enforced. Continuous over-speeding or reckless driving may lead to remote immobilization of the vehicle and forfeiture of the security deposit."
        },
        {
            title: "Liability & Damages",
            icon: <AlertTriangle className="h-6 w-6 text-blue-500" />,
            content: "The driver is fully responsible for any traffic violations or toll charges during the rental period. In the event of minor damage, costs will be deducted from the security deposit. Major accidents are subject to insurance claims, where the user may be liable for the 'Total Insurance Gap' amount."
        },
        {
            title: "Cancellation & Refund",
            icon: <Gavel className="h-6 w-6 text-blue-500" />,
            content: "Cancellations made 24 hours prior to the booking start time are eligible for a full refund. Cancellations made within 24 hours will incur a 1-day rental charge. No-shows are non-refundable. Security deposits are processed for refund immediately upon vehicle check-in."
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
                    <h1 className="text-4xl md:text-5xl font-black mb-4 dark:text-white uppercase tracking-tighter italic">Terms of Service</h1>
                    <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Please read these terms carefully before utilizing UNITED CAR rental services.</p>
                </motion.div>

                <div className="space-y-6">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass p-8 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl">
                                    {section.icon}
                                </div>
                                <h3 className="text-xl font-extrabold dark:text-white uppercase tracking-tight">{section.title}</h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 pt-8 border-t border-slate-200 dark:border-white/5 text-center"
                >
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-black">
                        Last Updated: April 2024 | UNITED CAR PVT LTD | JAIPUR
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Terms;
