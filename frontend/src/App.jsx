import React, { useState, useRef, useEffect } from "react";
import { Shield, AlertTriangle, Activity, Zap, Terminal } from "lucide-react";
import "./App.css"; // Assuming you have a CSS file for styling

const initialNodes = [
  { id: 1, name: "PC-001", type: "PC", status: "benign", isActive: false },
  { id: 2, name: "Server-001", type: "Server", status: "benign", isActive: false },
  { id: 3, name: "PC-002", type: "PC", status: "benign", isActive: false },
  { id: 4, name: "PC-003", type: "PC", status: "benign", isActive: false },
  { id: 5, name: "Server-002", type: "Server", status: "benign", isActive: false },
  { id: 6, name: "PC-004", type: "PC", status: "benign", isActive: false },
];

const mockSimulationSteps = [
  { action: "Malicious activity detected from attacker node", status: "info" },
  { action: "Agent analyzing network traffic patterns", status: "info" },
  { action: "Attempting to isolate suspicious node", status: "info" },
  { action: "Firewall rules updated successfully", status: "success" },
  { action: "Node quarantine initiated", status: "success" },
  { action: "Network traffic normalized", status: "success" },
];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedAttacker, setSelectedAttacker] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPackets, setShowPackets] = useState(false);

  const logsEndRef = useRef(null);

  const startSimulation = () => {
    if (!selectedAttacker) return;
    const attackerId = parseInt(selectedAttacker);
    setNodes((prev) =>
      prev.map((node) => ({
        ...node,
        status: node.id === attackerId ? "attacker" : "benign",
        isActive: node.id === attackerId,
      }))
    );
    setIsSimulating(true);
    setCurrentStep(0);
    setLogs([]);
    setShowPackets(true);

    mockSimulationSteps.forEach((step, index) => {
      setTimeout(() => {
        const newLog = {
          id: Date.now() + index,
          timestamp: new Date().toLocaleTimeString(),
          action: step.action,
          status: step.status,
        };
        setLogs((prev) => [...prev, newLog]);
        setCurrentStep(index + 1);

        if (index === mockSimulationSteps.length - 1) {
          setTimeout(() => {
            setIsSimulating(false);
            setShowPackets(false);
            setNodes((prev) => prev.map((node) => ({ ...node, isActive: false })));
          }, 1000);
        }
      }, (index + 1) * 2000);
    });
  };

  const resetSimulation = () => {
    setNodes(initialNodes);
    setSelectedAttacker("");
    setIsSimulating(false);
    setLogs([]);
    setCurrentStep(0);
    setShowPackets(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-50";
      case "info":
        return "text-blue-600 bg-blue-50";
      case "error":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the logs on new log entry
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Network Security Simulation</h1>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 text-sm border rounded-full bg-white shadow">
            <Activity className="w-4 h-4 text-gray-500" />
            <span>SOC Dashboard</span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Zap className="w-5 h-5 text-blue-600" />
              <span>Control Panel</span>
            </div>

            <div>
              <label className="block text-sm mb-1">Select Attacker Node</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedAttacker}
                onChange={(e) => setSelectedAttacker(e.target.value)}
                disabled={isSimulating}
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
              className={`w-full p-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50`}
              onClick={startSimulation}
              disabled={!selectedAttacker || isSimulating}
            >
              {isSimulating ? "Simulating..." : "Start Simulation"}
            </button>

            <button
              className="w-full p-2 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
              onClick={resetSimulation}
              disabled={isSimulating}
            >
              Reset
            </button>

            {isSimulating && (
              <div className="text-center">
                <div className="text-sm text-gray-500">
                  Step {currentStep} of {mockSimulationSteps.length}
                </div>
                <div className="mt-2 h-2 bg-gray-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${(currentStep / mockSimulationSteps.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Network Topology */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 space-y-4">
            <div className="text-lg font-semibold">Network Bus Topology</div>
            <div className="relative p-8">
              <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-300 transform -translate-y-1/2">
                {showPackets && (
                  <>
                    <div className="absolute top-1/2 w-2 h-2 bg-blue-600 rounded-full animate-ping transform -translate-y-1/2" />
                    <div
                      className="absolute top-1/2 w-2 h-2 bg-green-500 rounded-full animate-ping transform -translate-y-1/2"
                      style={{ animationDelay: "1s" }}
                    />
                  </>
                )}
              </div>
              <div className="flex justify-between items-center relative z-10">
                {nodes.map((node) => (
                  <div key={node.id} className="flex flex-col items-center space-y-2">
                    <div className="w-px h-8 bg-gray-300" />
                    <div
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        node.status === "attacker"
                          ? "bg-red-500 border-red-500 text-white"
                          : "bg-gray-200 border-gray-200 text-gray-600"
                      } ${node.isActive ? "animate-pulse" : ""}`}
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
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Logs */}
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Terminal className="w-5 h-5 text-gray-600" />
              <span>Security Logs</span>
            </div>
            <div className="h-96 overflow-y-auto space-y-2 text-sm font-mono">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No logs yet. Start the simulation.</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className={`p-2 rounded ${getStatusColor(log.status)}`}>
                    <span className="text-gray-500 pr-2">[{log.timestamp}]</span>
                    <span>{log.action}</span>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}