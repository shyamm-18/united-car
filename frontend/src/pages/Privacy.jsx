import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, Database, Handshake } from 'lucide-react';

const Privacy = () => {
    const policies = [
        {
            title: "Data Collection",
            icon: <Database className="h-6 w-6 text-blue-500" />,
            content: "We collect information necessary to process your rental bookings, including your name, email address, phone number, and scans of your government-issued identification (Driving License/Aadhaar Card). For self-drive rentals, we also collect telemetry data (GPS location and speed) to ensure vehicle safety."
        },
        {
            title: "Information Usage",
            icon: <Eye className="h-6 w-6 text-blue-500" />,
            content: "Your data is used solely to verify your identity, manage your reservations, and communicate important trip updates. We use telemetry data to monitor vehicle health and prevent unauthorized use. We do not sell your personal information to third-party marketing firms."
        },
        {
            title: "Security Measures",
            icon: <Lock className="h-6 w-6 text-blue-500" />,
            content: "We implement industry-standard encryption (SSL/TLS) to protect your data during transmission. Payment processing is handled by secure, PCI-DSS compliant third-party gateways. We do not store your full credit card details on our servers."
        },
        {
            title: "Third-Party Sharing",
            icon: <Handshake className="h-6 w-6 text-blue-500" />,
            content: "We may share your information with government authorities if required by law or in the event of a traffic violation or accident. Telemetry data may be shared with insurance providers in the event of a claim to verify driving conditions."
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
                    <h1 className="text-4xl md:text-5xl font-black mb-4 dark:text-white uppercase tracking-tighter italic">Privacy Policy</h1>
                    <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Your privacy and data security are our top priorities at UNITED CAR.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {policies.map((policy, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass p-8 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 flex flex-col items-start"
                        >
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl mb-6">
                                {policy.icon}
                            </div>
                            <h3 className="text-xl font-bold dark:text-white mb-4">{policy.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                                {policy.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-16 p-8 rounded-3xl bg-slate-100 dark:bg-white/5 text-center"
                >
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                        By using the UNITED CAR platform, you consent to the collection and use of your information as outlined in this policy. We reserve the right to update this policy as our services evolve.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Privacy;
