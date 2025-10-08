import React, { useState } from "react";
// Import Lucide icons, including the new Brain and Cpu icons
// Removed: import { Link } from "react-router-dom"; to prevent "Link already declared" error
import { Shield, Activity, BarChart3, AlertTriangle, Brain, Cpu } from "lucide-react";

// --- PLACEHOLDER COMPONENTS ---
// Placeholder for react-router-dom Link (simulates link behavior with an anchor tag)
const Link = ({ to, children }) => <a href={to} className="contents">{children}</a>;

// Dummy comparison data
const comparisonScenarios = [
    {
        id: 1,
        scenario: "Port Scan Attack",
        timestamp: "2025-01-10 14:32:15",
        ruleBasedAction: "Block IP Address",
        ruleBasedExplanation:
            "Detected multiple connection attempts to sequential ports. Applied predefined rule to block source IP immediately.",
        ppoAction: "Block IP + Monitor",
        ppoExplanation:
            "Learned to block IP while maintaining monitoring on related subnet. Predicted potential distributed attack pattern.",
        effectiveness: { ruleBased: 85, ppo: 92 },
    },
    {
        id: 2,
        scenario: "SSH Brute Force",
        timestamp: "2025-01-10 14:35:42",
        ruleBasedAction: "Isolate Node",
        ruleBasedExplanation:
            "Failed login attempts exceeded threshold. Isolated affected node to prevent lateral movement.",
        ppoAction: "Isolate + Honeypot",
        ppoExplanation:
            "Isolated node and deployed honeypot to gather attacker intelligence. Learned to balance security with threat analysis.",
        effectiveness: { ruleBased: 78, ppo: 95 },
    },
    {
        id: 3,
        scenario: "DoS Attack",
        timestamp: "2025-01-10 14:38:09",
        ruleBasedAction: "Reset Service",
        ruleBasedExplanation: "Service became unresponsive due to traffic overload. Applied service restart protocol.",
        ppoAction: "Rate Limit + Load Balance",
        ppoExplanation:
            "Implemented dynamic rate limiting and redistributed traffic. Learned optimal threshold from historical patterns.",
        effectiveness: { ruleBased: 70, ppo: 88 },
    },
    {
        id: 4,
        scenario: "SQL Injection Attempt",
        timestamp: "2025-01-10 14:42:55",
        ruleBasedAction: "Block IP",
        ruleBasedExplanation: "Detected malicious SQL patterns in request. Blocked source IP based on signature match.",
        ppoAction: "Block + Patch Recommendation",
        ppoExplanation:
            "Blocked attack and analyzed vulnerability. Suggested specific patch based on attack vector analysis.",
        effectiveness: { ruleBased: 82, ppo: 90 },
    },
];

export default function Comparison() {
    // Note: Set default tab to 'comparison' for this page
    const [activeTab, setActiveTab] = useState("comparison");
    const [selectedScenario, setSelectedScenario] = useState(comparisonScenarios[0]);

    return (
        // Mapped bg-background dark to bg-gray-900 and text-gray-100
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            
            {/* Top Navigation Bar: Mapped bg-card/border-border to gray-800/gray-700 */}
            <nav className="border-b border-gray-700 bg-gray-800 shadow-lg">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Mapped text-accent to text-green-500 */}
                            <Shield className="h-8 w-8 text-green-500" />
                            <div>
                                {/* Mapped text-foreground to text-white */}
                                <h1 className="text-2xl font-extrabold text-white">AutoSentinel</h1>
                                {/* Mapped text-muted-foreground to text-gray-400 */}
                                <p className="text-xs text-gray-400">
                                    Autonomous Cyber Defence Simulation
                                </p>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex gap-2">
                            {/* Dashboard Link */}
                            <Link to="/">
                                <button
                                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                                        // Mapped bg-accent/hover:bg-muted
                                        activeTab === "dashboard"
                                            ? "bg-green-600 text-white"
                                            : "text-white hover:bg-gray-700"
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
                                        activeTab === "alerts"
                                            ? "bg-green-600 text-white"
                                            : "text-white hover:bg-gray-700"
                                    }`}
                                    onClick={() => setActiveTab("alerts")}
                                >
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Alerts
                                </button>
                            </Link>

                            {/* Comparison Link (Active) */}
                            <Link to="/comparison">
                                <button
                                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                                        activeTab === "comparison"
                                            ? "bg-green-600 text-white"
                                            : "text-white hover:bg-gray-700"
                                    }`}
                                    onClick={() => setActiveTab("comparison")}
                                >
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Comparison
                                </button>
                            </Link>

                            {/* Visualization Link */}
                            <Link to="/visualization">
                                <button
                                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200 ${
                                        activeTab === "visualization"
                                            ? "bg-green-600 text-white"
                                            : "text-white hover:bg-gray-700"
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

            {/* Comparison Content */}
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8 p-6 bg-gray-800 rounded-xl shadow-xl border-l-4 border-green-600">
                    {/* Mapped text-foreground to text-white */}
                    <h2 className="text-3xl font-extrabold text-white mb-2">Agent Comparison</h2>
                    {/* Mapped text-muted-foreground to text-gray-400 */}
                    <p className="text-gray-400 text-lg">
                        Compare Rule-Based and PPO Agent responses to security threats
                    </p>
                </div>

                {/* Scenario Selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {comparisonScenarios.map((scenario) => (
                        <div
                            key={scenario.id}
                            className={`p-4 border rounded-xl shadow-md cursor-pointer transition-all duration-200 ${
                                // Mapped selected/default colors to gray/green theme
                                selectedScenario.id === scenario.id
                                    ? "border-green-600 bg-green-900/40" // Selected: border-accent bg-accent/10
                                    : "border-gray-700 bg-gray-800 hover:border-green-500" // Default: border-border bg-card hover:border-accent/50
                            }`}
                            onClick={() => setSelectedScenario(scenario)}
                        >
                            {/* Mapped text-foreground/text-muted-foreground to white/gray-400 */}
                            <h3 className="text-sm font-semibold text-white">{scenario.scenario}</h3>
                            <p className="text-xs text-gray-400">{scenario.timestamp}</p>
                        </div>
                    ))}
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Rule-Based Agent (Blue Theme) */}
                    <div className="p-6 rounded-xl shadow-xl border border-blue-600 bg-gray-800 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-900/50">
                                <Cpu className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">Rule-Based Agent</h3>
                                <p className="text-blue-300 text-sm">
                                    Traditional signature-based detection
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-2">
                                    Action Taken
                                </h4>
                                <span className="inline-block px-3 py-1 rounded-full text-blue-300 bg-blue-900 border border-blue-700 text-xs font-mono">
                                    {selectedScenario.ruleBasedAction}
                                </span>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-white mb-2">
                                    Explanation
                                </h4>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {selectedScenario.ruleBasedExplanation}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-white mb-2">
                                    Effectiveness
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-500"
                                            style={{
                                                width: `${selectedScenario.effectiveness.ruleBased}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-white">
                                        {selectedScenario.effectiveness.ruleBased}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PPO Agent (Green Theme) */}
                    <div className="p-6 rounded-xl shadow-xl border border-green-600 bg-gray-800 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-green-900/50">
                                <Brain className="h-6 w-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">PPO Agent (Reinforcement Learning)</h3>
                                <p className="text-green-300 text-sm">
                                    Reinforcement learning-based defense
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-2">
                                    Action Taken
                                </h4>
                                <span className="inline-block px-3 py-1 rounded-full text-green-300 bg-green-900 border border-green-700 text-xs font-mono">
                                    {selectedScenario.ppoAction}
                                </span>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-white mb-2">
                                    Explanation
                                </h4>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {selectedScenario.ppoExplanation}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-white mb-2">
                                    Effectiveness
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-500"
                                            style={{
                                                width: `${selectedScenario.effectiveness.ppo}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold text-white">
                                        {selectedScenario.effectiveness.ppo}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
