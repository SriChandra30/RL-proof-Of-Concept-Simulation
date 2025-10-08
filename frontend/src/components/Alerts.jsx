import React, { useRef, useEffect } from "react";
import {  Zap, Terminal, X, Settings } from "lucide-react";

import { useState } from "react"
import { Shield, Activity, BarChart3, AlertTriangle, Search, HelpCircle } from "lucide-react"

const CustomLink = ({ href, children }) => <a href={href}>{children}</a>;

const UI_Button = ({ children, onClick, variant, size, className, disabled }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className={`px-4 py-2 rounded-md transition-colors 
            ${variant === 'default' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-300 hover:bg-gray-700'} 
            ${size === 'sm' ? 'text-sm' : ''} ${className}`}
    >
        {children}
    </button>
);
const UI_Input = ({ value, onChange, placeholder, className }) => (
    <input 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className={`p-2 border rounded-md bg-gray-900 text-white focus:ring-blue-500 focus:border-blue-500 ${className}`}
    />
);
const UI_Badge = ({ children, className, variant }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className} 
        ${variant === 'default' ? 'bg-blue-800 text-blue-300 border-blue-600' : 'bg-gray-700 text-gray-300 border-gray-600'}`}
    >
        {children}
    </span>
);
const UI_Card = ({ children, className }) => <div className={`rounded-lg shadow-xl ${className}`}>{children}</div>;
const UI_CardHeader = ({ children }) => <div className="p-6 border-b border-gray-700">{children}</div>;
const UI_CardTitle = ({ children, className }) => <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
const UI_CardDescription = ({ children, className }) => <p className={`text-sm ${className}`}>{children}</p>;
const UI_CardContent = ({ children }) => <div className="p-6">{children}</div>;

const UI_DialogHeader = ({ children }) => <div className="mb-4">{children}</div>;
const UI_DialogTitle = ({ children, className }) => <h3 className={`text-lg font-bold ${className}`}>{children}</h3>;
const UI_DialogDescription = ({ children, className }) => <p className={`text-sm ${className}`}>{children}</p>;
const UI_DialogContent = ({ children, className }) => <div className={className}>{children}</div>;

const UI_Dialog = ({ open, onOpenChange, children }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => onOpenChange(false)}>
            <div className="bg-card rounded-lg shadow-2xl p-6 max-w-2xl mx-auto" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};


const alertsData = [
  {
    id: 1,
    timestamp: "2025-01-10 14:32:15",
    attackType: "Port Scan",
    severity: "Low",
    agentAction: "Block IP",
    agentType: "Rule-Based",
    sourceIP: "192.168.1.45",
    targetNode: "Node-1",
    explanation:
      "Detected sequential port scanning behavior from source IP. Rule-based agent matched signature pattern #PS-001 indicating reconnaissance activity. Blocked IP to prevent further enumeration of network services.",
    reasoning: [
      "Sequential connection attempts to ports 20-80 detected",
      "Pattern matches known port scanning signatures",
      "Source IP has no prior legitimate traffic history",
      "Applied immediate block to prevent service enumeration",
    ],
  },
  {
    id: 2,
    timestamp: "2025-01-10 14:35:42",
    attackType: "SSH Brute Force",
    severity: "High",
    agentAction: "Isolate Node",
    agentType: "PPO",
    sourceIP: "10.0.0.23",
    targetNode: "Node-3",
    explanation:
      "PPO agent detected 47 failed SSH login attempts within 2 minutes. Based on learned patterns from 10,000+ training episodes, agent predicted high probability of credential compromise. Isolated node to prevent lateral movement while maintaining monitoring.",
    reasoning: [
      "47 failed authentication attempts in 120 seconds",
      "Attack pattern similarity score: 0.94 with known brute force campaigns",
      "PPO policy network confidence: 0.89 for isolation action",
      "Historical data shows 78% success rate for this response",
      "Maintained network monitoring to track attacker behavior",
    ],
  },
  {
    id: 3,
    timestamp: "2025-01-10 14:38:09",
    attackType: "DoS Attack",
    severity: "High",
    agentAction: "Reset Service",
    agentType: "PPO",
    sourceIP: "172.16.0.88",
    targetNode: "Node-2",
    explanation:
      "Service became unresponsive due to connection flood. PPO agent learned from previous DoS scenarios that service reset combined with rate limiting provides fastest recovery. Action taken based on Q-value of 0.87 for this state-action pair.",
    reasoning: [
      "Service response time exceeded 5000ms threshold",
      "Connection queue saturated at 10,000+ pending requests",
      "PPO agent evaluated 3 possible actions: reset, rate-limit, or isolate",
      "Reset action had highest expected reward (0.87) based on training",
      "Applied dynamic rate limiting post-reset to prevent recurrence",
    ],
  },
  {
    id: 4,
    timestamp: "2025-01-10 14:40:21",
    attackType: "Port Scan",
    severity: "Low",
    agentAction: "Block IP",
    agentType: "Rule-Based",
    sourceIP: "192.168.1.67",
    targetNode: "Node-4",
    explanation:
      "Standard port scan detection triggered by predefined rule. Source IP attempted connections to 15 different ports within 30 seconds. Rule-based agent applied immediate IP block per security policy.",
    reasoning: [
      "15 connection attempts to different ports in 30 seconds",
      "Matches rule threshold for port scanning (>10 ports/minute)",
      "No whitelist entry for source IP",
      "Applied standard blocking procedure per policy",
    ],
  },
  {
    id: 5,
    timestamp: "2025-01-10 14:42:55",
    attackType: "SQL Injection",
    severity: "Medium",
    agentAction: "Block IP",
    agentType: "PPO",
    sourceIP: "10.0.0.99",
    targetNode: "Node-1",
    explanation:
      "PPO agent detected malicious SQL patterns in HTTP request payload. Agent not only blocked the attack but also analyzed the vulnerability and recommended specific patch. This multi-action response was learned through reward shaping during training.",
    reasoning: [
      "Detected SQL injection patterns: UNION SELECT, DROP TABLE",
      "Request payload contained 3 known SQL injection signatures",
      "PPO agent confidence: 0.92 for malicious intent classification",
      "Blocked IP and flagged vulnerable endpoint for patching",
      "Recommended input validation update for affected API route",
    ],
  },
  {
    id: 6,
    timestamp: "2025-01-10 14:45:18",
    attackType: "SSH Brute Force",
    severity: "High",
    agentAction: "Isolate Node",
    agentType: "Rule-Based",
    sourceIP: "172.16.0.45",
    targetNode: "Node-5",
    explanation:
      "Failed login threshold exceeded (50 attempts). Rule-based agent followed predefined escalation procedure: first warning at 10 attempts, temporary block at 25 attempts, full isolation at 50 attempts.",
    reasoning: [
      "50 failed SSH authentication attempts detected",
      "Exceeded critical threshold defined in security policy",
      "Applied escalation procedure: warn → block → isolate",
      "Node isolation prevents potential lateral movement",
    ],
  },
  {
    id: 7,
    timestamp: "2025-01-10 14:47:33",
    attackType: "DDoS Attack",
    severity: "Medium",
    agentAction: "Rate Limit",
    agentType: "PPO",
    sourceIP: "192.168.1.101",
    targetNode: "Node-2",
    explanation:
      "PPO agent detected distributed attack pattern from multiple sources. Instead of blocking all IPs, agent learned to apply dynamic rate limiting that maintains service availability while mitigating attack. This nuanced response came from training on 5,000+ DDoS scenarios.",
    reasoning: [
      "Traffic spike: 15,000 requests/second (normal: 500 req/s)",
      "Attack distributed across 23 source IPs",
      "PPO agent evaluated trade-off between availability and security",
      "Rate limiting chosen over full block to maintain legitimate traffic",
      "Dynamic threshold adjusted based on real-time traffic analysis",
    ],
  },
  {
    id: 8,
    timestamp: "2025-01-10 14:50:02",
    attackType: "Port Scan",
    severity: "Low",
    agentAction: "Log Event",
    agentType: "Rule-Based",
    sourceIP: "10.0.0.12",
    targetNode: "Node-3",
    explanation:
      "Low-intensity port scan detected. Source IP is on internal network whitelist. Rule-based agent logged event for audit purposes but did not block, following policy for trusted internal networks.",
    reasoning: [
      "Port scan detected but from whitelisted internal IP",
      "Scan intensity below blocking threshold (5 ports/minute)",
      "Source IP has legitimate business purpose on network",
      "Event logged for security audit and compliance",
    ],
  },
]

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("alerts")
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Low":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "Medium":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "High":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const filteredAlerts = alertsData.filter(
    (alert) =>
      alert.attackType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.sourceIP.includes(searchTerm) ||
      alert.targetNode.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExplainAction = (alert) => {
    setSelectedAlert(alert)
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Top Navigation Bar */}
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
{/*               <CustomLink href="/comparison">
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

      {/* Alerts Content */}
      <div className="container mx-auto px-6 py-8">
        <UI_Card className="bg-gray-800 border-gray-700">
          <UI_CardHeader>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <UI_CardTitle className="text-white">Security Alerts & Logs</UI_CardTitle>
                <UI_CardDescription className="text-gray-400">
                  Real-time attack detection and agent responses
                </UI_CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <UI_Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-600 text-white"
                />
              </div>
            </div>
          </UI_CardHeader>
          <UI_CardContent>
            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Timestamp</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Attack Type</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Severity</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Source IP</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Target</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Agent Action</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Agent Type</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-300 uppercase tracking-wider">Why?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-700 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-300 font-mono">{alert.timestamp}</td>
                      <td className="py-3 px-4 text-sm text-white">{alert.attackType}</td>
                      <td className="py-3 px-4">
                        <UI_Badge className={getSeverityColor(alert.severity)}>{alert.severity}</UI_Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300 font-mono">{alert.sourceIP}</td>
                      <td className="py-3 px-4 text-sm text-white">{alert.targetNode}</td>
                      <td className="py-3 px-4 text-sm text-yellow-400 font-semibold">{alert.agentAction}</td>
                      <td className="py-3 px-4">
                        <UI_Badge variant={alert.agentType === "PPO" ? "default" : "secondary"}>{alert.agentType}</UI_Badge>
                      </td>
                      <td className="py-3 px-4">
                        <UI_Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExplainAction(alert)}
                          className="h-8 w-8 p-0 text-blue-400 hover:bg-gray-700/50"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </UI_Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </UI_CardContent>
        </UI_Card>
      </div>

      {/* Explanation Dialog for agent decision explainability */}
      <UI_Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <UI_DialogContent className="max-w-2xl bg-gray-800 border-gray-700 p-6">
          <UI_DialogHeader>
            <UI_DialogTitle className="text-white flex items-center gap-2 border-b border-gray-700 pb-2">
              <HelpCircle className="h-5 w-5 text-blue-400" />
              Why did the {selectedAlert?.agentType} agent take this action?
            </UI_DialogTitle>
            <UI_DialogDescription className="text-gray-400 pt-2">
              Detailed explanation of the agent's decision-making process
            </UI_DialogDescription>
          </UI_DialogHeader>

          {selectedAlert && (
            <div className="space-y-4">
              {/* Attack Context */}
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-700 shadow-inner">
                <h4 className="text-sm font-semibold text-white mb-3 border-b border-gray-800 pb-2">Attack Context</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Attack Type:</span>
                    <span className="ml-2 text-white font-medium">{selectedAlert.attackType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Severity:</span>
                    <UI_Badge className={`ml-2 ${getSeverityColor(selectedAlert.severity)}`}>
                      {selectedAlert.severity}
                    </UI_Badge>
                  </div>
                  <div>
                    <span className="text-gray-400">Source IP:</span>
                    <span className="ml-2 text-white font-mono">{selectedAlert.sourceIP}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Target Node:</span>
                    <span className="ml-2 text-white">{selectedAlert.targetNode}</span>
                  </div>
                </div>
              </div>

              {/* Agent Decision */}
              <div className="p-4 rounded-lg bg-blue-950/40 border border-blue-800/60">
                <h4 className="text-sm font-semibold text-white mb-2">Agent Action: <span className="text-blue-300">{selectedAlert.agentAction}</span></h4>
                <div className="flex items-center gap-2 mb-3">
                  <UI_Badge variant={selectedAlert.agentType === "PPO" ? "default" : "secondary"}>
                    {selectedAlert.agentType}
                  </UI_Badge>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic">{selectedAlert.explanation}</p>
              </div>

              {/* Detailed Reasoning */}
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-700 shadow-inner">
                <h4 className="text-sm font-semibold text-white mb-3 border-b border-gray-800 pb-2">Decision Reasoning</h4>
                <ul className="space-y-2">
                  {selectedAlert.reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-blue-500 mt-1">→</span>
                      <span className="text-gray-300 leading-relaxed">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Agent Type Info */}
              <div className="p-3 rounded-lg bg-gray-700/50 border border-gray-600">
                <p className="text-xs text-gray-300 leading-relaxed">
                  {selectedAlert.agentType === "PPO" ? (
                    <>
                      <strong className="text-white">PPO (Proximal Policy Optimization)</strong> agents use
                      reinforcement learning to make decisions based on learned patterns from thousands of training
                      episodes. They can adapt to new attack patterns and optimize for multiple objectives
                      simultaneously.
                    </>
                  ) : (
                    <>
                      <strong className="text-white">Rule-Based</strong> agents follow predefined security policies
                      and signature-based detection. They provide consistent, predictable responses based on established
                      rules and thresholds.
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </UI_DialogContent>
      </UI_Dialog>
    </div>
  )
}
