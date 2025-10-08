import React, { useState, useRef, useEffect } from "react";
// ADDED BarChart3 for the new nav links
import { Shield, AlertTriangle, Activity, Zap, Terminal, X, Settings, BarChart3 } from "lucide-react";
// 💥 NEW IMPORT: AgentCommandPanel component
import AgentCommandPanel from "./AgentCommandPanel"; 

// --- PLACEHOLDER COMPONENTS (Needed for Navbar) ---

const UI_Button = ({ children, variant, size, onClick, className, ...props }) => {
    const baseClasses = "flex items-center justify-center font-medium rounded-md transition-colors duration-200";
    const sizeClasses = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2";
    const variantClasses = variant === "default" 
        ? "bg-green-600 hover:bg-green-700 text-white" 
        : "text-white hover:bg-gray-700";

    return (
        <button
            className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

const CustomLink = ({ href, children }) => {
    // In a real application, this would use a router Link component (e.g., from Next.js or React Router)
    return <a href={href}>{children}</a>;
};

// --- Utility Functions ---
// (Your existing utility functions: getSeverityColor, getSeverityText)
const getSeverityColor = (severity) => {
    switch (severity) {
        case "error": return "bg-red-600";
        case "warning": return "bg-yellow-600";
        case "info": return "bg-blue-600";
        case "success": return "bg-lime-600";
        default: return "bg-gray-600";
    }
};

const getSeverityText = (severity) => {
    switch (severity) {
        case "error": return "ERROR";
        case "warning": return "WARNING";
        case "info": return "INFO";
        case "success": return "SUCCESS";
        default: return "LOG";
    }
};


// --- Logs Component (Your existing component) ---

const LogEntry = ({ log }) => {
    const colorClass = getSeverityColor(log.severity);
    const severityText = getSeverityText(log.severity);

    return (
        <div className="py-4 border-b border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-800 -mx-6 px-6 transition duration-150">
            <div className="flex justify-between items-center mb-1">
                <span className="text-base font-mono text-gray-400">{log.timestamp}</span>
                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${colorClass}`}>
                    {severityText}
                </div>
            </div>
            <p className="text-white font-bold mb-1">{log.message}</p>
            <p className="text-sm text-gray-500">
                {log.details}
                <span className="ml-2 italic text-gray-600">
                    Agent: {log.agent}
                </span>
            </p>
        </div>
    );
};

const SystemLogs = ({ logs, logsEndRef }) => {
    const [activeAgent, setActiveAgent] = useState('All');

    const filteredLogs = logs.filter(log => activeAgent === 'All' || log.agent === activeAgent);

    const filterButtonClass = (agentName) => 
        `px-3 py-1 text-sm rounded-full transition duration-150 ${
            activeAgent === agentName
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
        }`;

    return (
        <div className="bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold border-b border-gray-700 pb-3">
                <Terminal className="w-6 h-6 text-green-600" />
                <span>System Logs</span>
            </div>
            
            {/* Log Filter */}
            <div className="flex gap-2">
                <button className={filterButtonClass('All')} onClick={() => setActiveAgent('All')}>
                    All Agents
                </button>
                <button className={filterButtonClass('Rule-Based')} onClick={() => setActiveAgent('Rule-Based')}>
                    Rule-Based
                </button>
                <button className={filterButtonClass('PPO Agent')} onClick={() => setActiveAgent('PPO Agent')}>
                    PPO Agent
                </button>
            </div>

            {/* Log Display Area */}
            <div className="h-96 overflow-y-auto space-y-0 text-sm font-mono bg-gray-900 rounded-md p-6">
                {filteredLogs.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                        {activeAgent === 'All' ? 'No logs yet. Start the simulation.' : `No logs for ${activeAgent}.`}
                    </div>
                ) : (
                    filteredLogs.map((log) => (
                        <LogEntry key={log.id} log={log} />
                    ))
                )}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};


// --- Dashboard Component ---

const initialNodes = [
    { id: 0, name: "PC-001", type: "PC", status: "benign", isActive: false, incoming_loads: 0, failed_logins: 0, blocked_flags: false, isolated_flags: false, restart_cd: 0 },
    { id: 1, name: "Server-001", type: "Server", status: "benign", isActive: false, incoming_loads: 0, failed_logins: 0, blocked_flags: false, isolated_flags: false, restart_cd: 0 },
    { id: 2, name: "PC-002", type: "PC", status: "benign", isActive: false, incoming_loads: 0, failed_logins: 0, blocked_flags: false, isolated_flags: false, restart_cd: 0 },
    { id: 3, name: "PC-003", type: "PC", status: "benign", isActive: false, incoming_loads: 0, failed_logins: 0, blocked_flags: false, isolated_flags: false, restart_cd: 0 },
    { id: 4, name: "Server-002", type: "Server", status: "benign", isActive: false, incoming_loads: 0, failed_logins: 0, blocked_flags: false, isolated_flags: false, restart_cd: 0 },
    { id: 5, name: "PC-004", type: "PC", status: "benign", isActive: false, incoming_loads: 0, failed_logins: 0, blocked_flags: false, isolated_flags: false, restart_cd: 0 },
];

const API_URL = "http://127.0.0.1:8000";

export default function Dashboard() {
    const [nodes, setNodes] = useState(initialNodes);
    const [selectedAttacker, setSelectedAttacker] = useState("");
    const [isSimulating, setIsSimulating] = useState(false);
    const [logs, setLogs] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [showPackets, setShowPackets] = useState(false);
    const [editingNode, setEditingNode] = useState(null);
    const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
    const [busLoad, setBusLoad] = useState(0);
    const [collisions, setCollisions] = useState(0);
    const [hoveredNodeId, setHoveredNodeId] = useState(null);
    const [maliciousIps, setMaliciousIps] = useState([]);
    const [backendConnected, setBackendConnected] = useState(false);
    
    // 💥 NEW STATE FOR NAVBAR 💥
    const [activeTab, setActiveTab] = useState("dashboard");


    const logsEndRef = useRef(null);
    const simulationIntervalRef = useRef(null);
    
    const createLog = (severity, message, details, agent = 'System') => ({
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        severity,
        message,
        details,
        agent,
    });

    // (Your existing useEffect for checkBackendConnection and other functions...)
    
    // Fetch environment info on component mount
    useEffect(() => {
        checkBackendConnection();
    }, []);

    const checkBackendConnection = async () => {
        try {
            const response = await fetch(`${API_URL}/env-info`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });
            if (response.ok) {
                const data = await response.json();
                setMaliciousIps(data.malicious_ips);
                setBackendConnected(true);
                setLogs(prev => [...prev, createLog("success", "Backend Connection Status", "Successfully connected to FastAPI server on port 8000.")]);
            } else {
                throw new Error(`Connection attempt failed with status: ${response.status}`);
            }
        } catch (error) {
            console.error("Backend connection failed:", error);
            setBackendConnected(false);
            setLogs(prev => [...prev, 
                createLog("error", "Backend Connection Failure", "Make sure FastAPI is running on port 8000.")
            ]);
        }
    };

    const startSimulation = async () => {
        if (!selectedAttacker) return;
        
        if (!backendConnected) {
            setLogs(prev => [...prev, createLog("error", "Simulation Startup Failure", "Cannot start simulation: Backend not connected.")]);
            return;
        }

        const attackerId = parseInt(selectedAttacker);

        setNodes((prev) =>
            prev.map((node) => ({
                ...node,
                status: node.id === attackerId ? "attacker" : "benign",
                isActive: node.id === attackerId,
            }))
        );

        setIsSimulating(true);
        setLogs(prev => [...prev, createLog("info", "Simulation Started", `Attacker deployed at node ${attackerId} (${nodes.find(n => n.id === attackerId)?.name}).`)]);
        setCurrentStep(0);
        setShowPackets(true);

        simulationIntervalRef.current = setInterval(async () => {
            await sendDataToAgent(attackerId);
            setCurrentStep((prev) => prev + 1);
        }, 2000);

        setTimeout(() => {
            stopSimulation();
        }, 20000);
    };

    const stopSimulation = () => {
        if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current);
        }
        setIsSimulating(false);
        setShowPackets(false);
        setNodes((prev) => prev.map((node) => ({ ...node, isActive: false })));
        setLogs(prev => [...prev, createLog("info", "Simulation Stopped", "Simulation interval cleared by timeout or user.")]);
    };

    const sendDataToAgent = async (attackerId) => {
        try {
            const networkState = {
                attacker: attackerId,
                busLoad: busLoad,
                collisions: collisions,
                nodes: nodes.map(node => ({
                    incoming_loads: node.incoming_loads,
                    failed_logins: node.failed_logins,
                    blocked_flags: node.blocked_flags,
                    isolated_flags: node.isolated_flags
                }))
            };

            const response = await fetch(`${API_URL}/rule-agent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(networkState),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            const actionName = data.rule_agent_action.action_name;
            const targetNode = nodes.find(n => n.id === data.rule_agent_action.ip)?.name || `IP ${data.rule_agent_action.ip}`;
            
            setLogs((prev) => [
                ...prev,
                createLog(
                    "info", 
                    `Rule-Based Agent Action: ${actionName}`,
                    `Action applied to node ${targetNode}.`,
                    'Rule-Based'
                ),
            ]);

            applyAgentAction(data.rule_agent_action);

        } catch (error) {
            console.error("Error sending to agent:", error);
            setLogs((prev) => [
                ...prev,
                createLog("error", "API Communication Error", `Failed to get response from rule-agent: ${error.message}`)
            ]);
        }
    };

    const applyAgentAction = (action) => {
        const { type, ip } = action;
        const actionMap = {
            1: { flag: "blocked_flags", value: true, severity: "warning", message: "Node Blocked" },
            2: { flag: "blocked_flags", value: false, severity: "info", message: "Node Unblocked" },
            3: { flag: "isolated_flags", value: true, severity: "warning", message: "Node Isolated" },
        };
        
        if (type === 0) return; // Do nothing

        const actionDetails = actionMap[type];
        const targetNode = nodes.find(n => n.id === ip);

        setNodes((prevNodes) =>
            prevNodes.map((node) => {
                if (node.id === ip) {
                    let updatedNode = { ...node };
                    
                    if (type === 1) { // Block
                        updatedNode.blocked_flags = true;
                        updatedNode.isolated_flags = false;
                    } else if (type === 2) { // Unblock
                        updatedNode.blocked_flags = false;
                        updatedNode.isolated_flags = false;
                    } else if (type === 3) { // Isolate
                        updatedNode.blocked_flags = false;
                        updatedNode.isolated_flags = true;
                    }
                    
                    setLogs((prev) => [
                        ...prev,
                        createLog(
                            actionDetails.severity,
                            actionDetails.message,
                            `Agent action applied successfully to ${targetNode.name}.`,
                            'System'
                        ),
                    ]);

                    return updatedNode;
                }
                return node;
            })
        );
    };

    const resetSimulation = () => {
        if (simulationIntervalRef.current) {
            clearInterval(simulationIntervalRef.current);
        }
        setNodes(initialNodes);
        setSelectedAttacker("");
        setIsSimulating(false);
        setLogs([createLog("info", "Simulation Reset", "All network states and logs have been cleared.")]);
        setCurrentStep(0);
        setShowPackets(false);
        setEditingNode(null);
        setBusLoad(0);
        setCollisions(0);
    };

    const handleNodeClick = (node, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setEditingNode(node);
        setPanelPosition({ 
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY + 10
        });
    };

    const handleParamChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditingNode((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSaveNode = () => {
        setNodes((prev) =>
            prev.map((node) => (node.id === editingNode.id ? editingNode : node))
        );
        setEditingNode(null);
        setLogs(prev => [...prev, createLog("info", "Node Parameters Updated", `Manually updated parameters for ${editingNode.name}.`)]);
    };

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [logs]);

    return (
        // Changed main div to match navbar's theme and structure
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans"> 

            {/* 💥 START OF NAVBAR INTEGRATION 💥 */}
            <nav className="border-b border-gray-700 bg-gray-800 shadow-lg">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Shield className="h-8 w-8 text-green-500" />
                            <div>
                                <h1 className="text-2xl font-extrabold text-white">AutoSentinel</h1>
                                <p className="text-xs text-gray-400">Autonomous Cyber Defence Simulation</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <CustomLink href="/">
                                <UI_Button
                                    variant={activeTab === "dashboard" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveTab("dashboard")}
                                    className="text-white hover:text-green-400 hover:bg-gray-700"
                                >
                                    <Activity className="mr-2 h-4 w-4" />
                                    Dashboard
                                </UI_Button>
                            </CustomLink>
                            <CustomLink href="/alerts">
                                <UI_Button
                                    variant={activeTab === "alerts" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveTab("alerts")}
                                    className="text-white hover:text-green-400 hover:bg-gray-700"
                                >
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Alerts
                                </UI_Button>
                            </CustomLink>
                            {/* Comparison Link (currently commented out but kept for completeness) */}
                            {/* <CustomLink href="/comparison">
                                <UI_Button
                                    variant={activeTab === "comparison" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveTab("comparison")}
                                    className="text-white hover:text-green-400 hover:bg-gray-700"
                                >
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Comparison
                                </UI_Button>
                            </CustomLink> */}
                            <CustomLink href="/visualization">
                                <UI_Button
                                    variant={activeTab === "visualization" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveTab("visualization")}
                                    className="text-white hover:text-green-400 hover:bg-gray-700"
                                >
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Visualization
                                </UI_Button>
                            </CustomLink>
                        </div>
                    </div>
                </div>
            </nav>
            {/* 💥 END OF NAVBAR INTEGRATION 💥 */}


            <div className="max-w-7xl mx-auto space-y-6 p-4">
                {/* Grid Layout (Rest of your content) */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Control Panel */}
                    <div className="bg-gray-800 rounded-lg shadow p-4 space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <Zap className="w-5 h-5 text-green-600" />
                            <span>Control Panel</span>
                        </div>

                        {!backendConnected && (
                            <div className="bg-red-900 text-red-200 p-2 rounded text-sm">
                                ⚠️ Backend not connected. Start FastAPI server first.
                            </div>
                        )}

                        <div>
                            <label className="block text-sm mb-1 text-gray-300">Select Attacker Node</label>
                            <select
                                className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-gray-100"
                                value={selectedAttacker}
                                onChange={(e) => setSelectedAttacker(e.target.value)}
                                disabled={isSimulating || !backendConnected}
                            >
                                <option value="">Choose node...</option>
                                {nodes.map((node) => (
                                    <option key={node.id} value={node.id}>
                                        {node.name} ({node.type})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className={`w-full p-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50`}
                            onClick={startSimulation}
                            disabled={!selectedAttacker || isSimulating || !backendConnected}
                        >
                            {isSimulating ? "Simulating..." : "Start Simulation"}
                        </button>

                        <button
                            className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700 disabled:opacity-50"
                            onClick={resetSimulation}
                            disabled={isSimulating}
                        >
                            Reset
                        </button>

                        {isSimulating && (
                            <div className="text-center">
                                <div className="text-sm text-gray-400">
                                    Step {currentStep}
                                </div>
                                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-600 transition-all duration-500"
                                        style={{ width: `${(currentStep / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}
                        
                        <hr className="border-gray-700" />
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <Settings className="w-5 h-5 text-gray-400" />
                                <span>Bus Parameters</span>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm text-gray-300">Bus Load</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-gray-100"
                                        value={busLoad}
                                        onChange={(e) => setBusLoad(Number(e.target.value))}
                                        disabled={isSimulating}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300">Collisions</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-gray-100"
                                        value={collisions}
                                        onChange={(e) => setCollisions(Number(e.target.value))}
                                        disabled={isSimulating}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Network Topology */}
                    <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow p-4 space-y-4 relative">
                            <span>Network Bus Topology</span>
                        <div className="relative p-8">
                            <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-700 transform -translate-y-1/2">
                                {showPackets && (
                                    <>
                                        <div className="absolute top-1/2 w-2 h-2 bg-green-400 rounded-full animate-ping transform -translate-y-1/2" />
                                        <div
                                            className="absolute top-1/2 w-2 h-2 bg-lime-400 rounded-full animate-ping transform -translate-y-1/2"
                                            style={{ animationDelay: "1s" }}
                                        />
                                    </>
                                )}
                            </div>
                            <div className="flex justify-between items-center relative z-10">
                                {nodes.map((node) => (
                                    <div
                                        key={node.id}
                                        className="flex flex-col items-center space-y-2 cursor-pointer relative"
                                        onClick={(e) => !isSimulating && handleNodeClick(node, e)}
                                        onMouseEnter={() => !isSimulating && !editingNode && setHoveredNodeId(node.id)}
                                        onMouseLeave={() => !isSimulating && setHoveredNodeId(null)}
                                    >
                                        <div className="w-px h-8 bg-gray-700" />
                                        <div
                                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                                                node.status === "attacker"
                                                    ? "bg-red-600 border-red-600 text-white"
                                                    : "bg-gray-700 border-gray-700 text-gray-300"
                                            } ${node.isActive ? "animate-pulse" : ""} ${
                                                node.blocked_flags ? "border-yellow-500 bg-yellow-800" : ""
                                            } ${node.isolated_flags ? "border-purple-500 bg-purple-800" : ""}`}
                                        >
                                            {node.type === "Server" ? (
                                                <div className="w-6 h-6 bg-current rounded-sm" />
                                            ) : (
                                                <div className="w-5 h-4 bg-current rounded-sm" />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs font-medium">{node.name}</div>
                                            <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                                                node.status === "attacker"
                                                    ? "bg-red-950 text-red-400"
                                                    : "bg-gray-700 text-gray-400"
                                            }`}>
                                                {node.status === "attacker" ? (
                                                    <>
                                                        <AlertTriangle className="w-3 h-3" />
                                                        Attacker
                                                    </>
                                                ) : (
                                                    "Benign"
                                                )}
                                            </div>
                                        </div>
                                        {hoveredNodeId === node.id && (
                                            <div 
                                                className="absolute bottom-full mb-2 bg-gray-700 text-gray-100 text-xs p-2 rounded-lg shadow-lg z-20 whitespace-nowrap opacity-90"
                                                style={{ minWidth: '150px' }}
                                            >
                                                <h4 className="font-bold text-base mb-1">{node.name}</h4>
                                                <p>Type: {node.type}</p>
                                                <p>Status: {node.status}</p>
                                                <p>Incoming Loads: {node.incoming_loads}</p>
                                                <p>Failed Logins: {node.failed_logins}</p>
                                                <p>Blocked: {node.blocked_flags ? 'True' : 'False'}</p>
                                                <p>Isolated: {node.isolated_flags ? 'True' : 'False'}</p>
                                                <p>Restart Cooldown: {node.restart_cd}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* System Logs */}
                    <div className="lg:col-span-1">
                        <SystemLogs logs={logs} logsEndRef={logsEndRef} />
                    </div>
                </div>

                
                

            </div>
            
            
            {/* Node Editing Panel (omitted for brevity, no changes) */}
            <div 
                style={{ top: panelPosition.y, left: panelPosition.x }}
                className={`absolute w-64 bg-gray-800 rounded-lg shadow-xl p-4 space-y-2 transition-all duration-300 ease-in-out transform -translate-x-1/2 -translate-y-2 z-50 ${
                    editingNode ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-base font-bold">Edit Node: {editingNode?.name}</h2>
                    <button onClick={() => setEditingNode(null)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                {editingNode && (
                    <div className="space-y-2 text-sm">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Incoming Loads</label>
                            <input
                                type="number"
                                name="incoming_loads"
                                value={editingNode.incoming_loads}
                                onChange={handleParamChange}
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Failed Logins</label>
                            <input
                                type="number"
                                name="failed_logins"
                                value={editingNode.failed_logins}
                                onChange={handleParamChange}
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100"
                            />
                        </div>
                        <div className="flex gap-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="blocked_flags"
                                    checked={editingNode.blocked_flags}
                                    onChange={handleParamChange}
                                    className="rounded text-green-600 bg-gray-900 border-gray-600"
                                />
                                <span className="ml-2 text-gray-300">Blocked</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    name="isolated_flags"
                                    checked={editingNode.isolated_flags}
                                    onChange={handleParamChange}
                                    className="rounded text-green-600 bg-gray-900 border-gray-600"
                                />
                                <span className="ml-2 text-gray-300">Isolated</span>
                            </label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Restart Cooldown</label>
                            <input
                                type="number"
                                name="restart_cd"
                                value={editingNode.restart_cd}
                                onChange={handleParamChange}
                                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm bg-gray-900 text-gray-100"
                            />
                        </div>
                    </div>
                    
                )}
                <div className="mt-2 flex justify-end gap-2">
                    <button
                        onClick={() => setEditingNode(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 rounded-md hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveNode}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                        Save Changes
                    </button>
                    
                </div>
            </div>
        </div>
        
    );
}
