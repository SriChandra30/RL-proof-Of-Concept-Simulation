import React, { useState } from "react";
// Import Lucide icons used in the navigation bar
import { Shield, Activity, BarChart3, AlertTriangle } from "lucide-react";

// --- PLACEHOLDER COMPONENTS ---
// 1. Placeholder for react-router-dom Link (simulates link behavior with an anchor tag)
const Link = ({ to, children }) => <a href={to} className="contents">{children}</a>;

// 2. Placeholder for TrainingChart
const TrainingChart = () => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-96 flex flex-col justify-center items-center">
        <BarChart3 className="w-10 h-10 text-green-500 mb-2" />
        <h3 className="text-lg font-semibold text-white">Agent Training Rewards</h3>
        <p className="text-gray-400 text-sm">Placeholder for Recharts/D3 Training Curve.</p>
    </div>
);

// 3. Placeholder for AccuracyChart
const AccuracyChart = () => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-96 flex flex-col justify-center items-center">
        <Activity className="w-10 h-10 text-blue-500 mb-2" />
        <h3 className="text-lg font-semibold text-white">Detection Accuracy Metrics</h3>
        <p className="text-gray-400 text-sm">Placeholder for Accuracy vs. Recall/Precision.</p>
    </div>
);

// 4. Placeholder for AttackReplay
const AttackReplay = () => (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            Full Attack Replay Simulation
        </h3>
        <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400 italic">
                A detailed timeline view of the attack path, agent reactions, and successful mitigations would appear here.
            </p>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <span>Last Replay: Ep. 145 (DDoS attempt)</span>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-150">
                Run New Replay
            </button>
        </div>
    </div>
);

// --- MAIN VISUALIZATION COMPONENT ---

export default function Visualization() {
    // Note: The activeTab is set to 'visualization' by default for this page
    const [activeTab, setActiveTab] = useState("visualization");

    return (
        // Applied dark mode standard classes: bg-gray-900 for background
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            
            {/* Top Navigation Bar: Replaced semantic classes with standard dark theme classes */}
            <nav className="border-b border-gray-700 bg-gray-800 shadow-lg">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="h-8 w-8 text-green-500" />
                            <div>
                                <h1 className="text-2xl font-extrabold text-white">AutoSentinel</h1>
                                <p className="text-xs text-gray-400">
                                    Autonomous Cyber Defence Simulation
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/* Dashboard Link */}
                            <Link to="/">
                                <button
                                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                                        // Mapped bg-accent to bg-green-600, hover:bg-muted to hover:bg-gray-700
                                        activeTab === "dashboard" ? "bg-green-600 text-white" : "text-white hover:bg-gray-700"
                                    }`}
                                    onClick={() => setActiveTab("dashboard")}
                                >
                                    <Activity className="mr-2 h-4 w-4" />
                                    Dashboard
                                </button>
                            </Link>

                            {/* Alerts Link */}
                            <Link to="/alerts">
                                <button
                                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                                        activeTab === "alerts" ? "bg-green-600 text-white" : "text-white hover:bg-gray-700"
                                    }`}
                                    onClick={() => setActiveTab("alerts")}
                                >
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Alerts
                                </button>
                            </Link>

                            {/* Comparison Link */}
                            {/* <Link to="/comparison">
                                <button
                                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                                        activeTab === "comparison" ? "bg-green-600 text-white" : "text-white hover:bg-gray-700"
                                    }`}
                                    onClick={() => setActiveTab("comparison")}
                                >
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Comparison
                                </button>
                            </Link> */}

                            {/* Visualization Link (Active) */}
                            <Link to="/visualization">
                                <button
                                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                                        activeTab === "visualization" ? "bg-green-600 text-white" : "text-white hover:bg-gray-700"
                                    }`}
                                    onClick={() => setActiveTab("visualization")}
                                >
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Visualization
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Visualization Content */}
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8 p-6 bg-gray-800 rounded-xl shadow-xl border-l-4 border-green-600">
                    <h2 className="text-3xl font-extrabold text-white mb-2">
                        Training & Performance Visualization
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Analyze agent training progress and performance metrics
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Training Rewards Chart (Uses Placeholder) */}
                    <TrainingChart />

                    {/* Accuracy Comparison Chart (Uses Placeholder) */}
                    <AccuracyChart />
                </div>

                {/* Attack Replay Section (Uses Placeholder) */}
                <AttackReplay />
            </div>
        </div>
    );
}
