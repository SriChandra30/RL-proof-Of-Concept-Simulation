import React, { useState, useRef, useEffect } from "react";
import { Shield, AlertTriangle, Activity, Zap, Terminal, X, Settings } from "lucide-react";
import "./App.css";

const initialNodes = [
  { id: 1, name: "PC-001", type: "PC", status: "benign", isActive: false, incoming_loads: 0, failed_logins: 0, blocked_flags: false, isolated_flags: false, restart_cd: 0 },
  { id: 2, name: "Server-001", type: "Server", status: "benign", isActive: false, incoming_loads: 0, failed_logins: 0, blocked_flags: false, isolated_flags: false, restart_cd: 0 },
  { id: 3, name: "PC-002", type: "PC", status: "benign", isActive: false, incoming_loads: 0, failed_logins: 0, blocked_flags: false, isolated_flags: false, restart_cd: 0 },
  { id: 4, name: "PC-003", type: "PC", status: "benign", isActive: false, incoming_loads: 0, failed_logins: 0, blocked_flags: false, isolated_flags: false, restart_cd: 0 },
  { id: 5, name: "Server-002", type: "Server", status: "benign", isActive: false, incoming_loads: 0, failed_logins: 0, blocked_flags: false, isolated_flags: false, restart_cd: 0 },
  { id: 6, name: "PC-004", type: "PC", status: "benign", isActive: false, incoming_loads: 0, failed_logins: 0, blocked_flags: false, isolated_flags: false, restart_cd: 0 },
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
  const [editingNode, setEditingNode] = useState(null);
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [busLoad, setBusLoad] = useState(0);
  const [collisions, setCollisions] = useState(0);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

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
    setEditingNode(null);
    setBusLoad(0);
    setCollisions(0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-lime-400 bg-lime-950";
      case "info":
        return "text-green-400 bg-green-950";
      case "error":
        return "text-red-400 bg-red-950";
      default:
        return "text-gray-400 bg-gray-950";
    }
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
  };

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    // Changed main background to bg-black
    <div className="min-h-screen bg-black text-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-100">Network Security Simulation</h1>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 text-sm border rounded-full bg-gray-800 shadow">
            <Activity className="w-4 h-4 text-gray-400" />
            <span>SOC Dashboard</span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Control Panel */}
          <div className="bg-gray-800 rounded-lg shadow p-4 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Zap className="w-5 h-5 text-green-600" />
              <span>Control Panel</span>
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Select Attacker Node</label>
              <select
                className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-gray-100"
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
              className={`w-full p-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50`}
              onClick={startSimulation}
              disabled={!selectedAttacker || isSimulating}
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
                  Step {currentStep} of {mockSimulationSteps.length}
                </div>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 transition-all duration-500"
                    style={{ width: `${(currentStep / mockSimulationSteps.length) * 100}%` }}
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
                    onChange={(e) => setBusLoad(e.target.value)}
                    disabled={isSimulating}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">Collisions</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-600 rounded bg-gray-900 text-gray-100"
                    value={collisions}
                    onChange={(e) => setCollisions(e.target.value)}
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

          {/* Security Logs */}
          <div className="bg-gray-800 rounded-lg shadow p-4 space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Terminal className="w-5 h-5 text-gray-400" />
              <span>Security Logs</span>
            </div>
            <div className="h-96 overflow-y-auto space-y-2 text-sm font-mono bg-gray-900 rounded-md p-2">
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
      
      {/* Node Editing Panel */}
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