import React, { useState } from "react";
import { Send, Terminal, CheckCircle2, XCircle, Clock } from "lucide-react";

// --- UI COMPONENTS (Tailwind-styled) ---
const Card = ({ children, className }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-xl shadow-xl ${className || ''}`}>{children}</div>
);

const CardHeader = ({ children, className }) => (
  <div className={`p-6 border-b border-gray-700 ${className || ''}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={`text-xl font-bold text-white ${className || ''}`}>{children}</h3>
);

const CardDescription = ({ children, className }) => (
  <p className={`text-sm text-gray-400 ${className || ''}`}>{children}</p>
);

const CardContent = ({ children, className }) => (
  <div className={`p-6 pt-4 ${className || ''}`}>{children}</div>
);

const Button = ({ children, onClick, className, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-center px-4 py-2 font-semibold rounded-lg transition-colors duration-200 
               bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed ${className || ''}`}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, onKeyDown, placeholder, className }) => (
  <input
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    className={`w-full p-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white 
               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${className || ''}`}
  />
);

const Badge = ({ children, className }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className || ''}`}>
    {children}
  </span>
);

const ScrollArea = ({ children, className }) => (
  <div className={`h-64 overflow-y-auto pr-2 ${className || ''}`}>{children}</div>
);

// --- Custom Select ---
const SelectItem = ({ value, children, onClick }) => (
  <div
    onClick={onClick}
    className="px-3 py-2 cursor-pointer hover:bg-gray-700 transition-colors rounded-lg text-sm text-white"
  >
    {children}
  </div>
);

const SelectContent = ({ children, onBlur }) => (
  <div
    tabIndex={0}
    onBlur={onBlur}
    className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-1 max-h-48 overflow-y-auto"
  >
    {children}
  </div>
);

const SelectTrigger = ({ children, onClick, className }) => (
  <div
    onClick={onClick}
    className={`flex justify-between items-center w-full p-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white cursor-pointer transition-colors hover:border-green-500 ${className || ''}`}
  >
    {children}
  </div>
);

const SelectValue = ({ value, placeholder }) => <span>{value || placeholder}</span>;

const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (itemValue) => {
    onValueChange(itemValue);
    setIsOpen(false);
  };

  // Get the selected label
  let selectedLabel = "";
  React.Children.forEach(children, (child) => {
    if (child.type === SelectContent) {
      React.Children.forEach(child.props.children, (item) => {
        if (item.props.value === value) selectedLabel = item.props.children;
      });
    }
  });

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            children: React.Children.map(child.props.children, (c) => {
              if (c.type === SelectValue) return React.cloneElement(c, { value: selectedLabel });
              return c;
            }),
          });
        }
        return null;
      })}

      {isOpen && (
        <SelectContent onBlur={() => setTimeout(() => setIsOpen(false), 100)}>
          {React.Children.map(children, (child) => {
            if (child.type === SelectContent) {
              return React.Children.map(child.props.children, (item) =>
                React.cloneElement(item, { onClick: () => handleSelect(item.props.value) })
              );
            }
            return null;
          })}
        </SelectContent>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function AgentCommandPanel() {
  const [commands, setCommands] = useState([
    {
      id: 1,
      timestamp: "14:52:10",
      command: "block",
      target: "192.168.1.45",
      agent: "Rule-Based",
      status: "success",
      response: "IP 192.168.1.45 successfully blocked. Firewall rule #1247 applied.",
    },
    {
      id: 2,
      timestamp: "14:50:33",
      command: "isolate",
      target: "Node-5",
      agent: "PPO",
      status: "success",
      response: "Node-5 isolated from network. Honeypot deployed for monitoring.",
    },
  ]);

  const [commandType, setCommandType] = useState("block");
  const [target, setTarget] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("both");

  const handleSendCommand = () => {
    if (!target.trim()) return;

    const newCommand = {
      id: commands.length + 1,
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      command: commandType,
      target: target,
      agent: selectedAgent === "both" ? "Both Agents" : selectedAgent,
      status: "pending",
      response: "Processing command...",
    };

    setCommands([newCommand, ...commands]);

    setTimeout(() => {
      const responses = {
        block: `IP ${target} successfully blocked. Firewall rules updated.`,
        unblock: `IP ${target} unblocked. Access restored.`,
        isolate: `${target} isolated from network. Monitoring active.`,
      };

      setCommands((prev) =>
        prev.map((cmd) =>
          cmd.id === newCommand.id
            ? { ...cmd, status: "success", response: responses[commandType] || "Command executed successfully." }
            : cmd
        )
      );
    }, 1500);

    setTarget("");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "pending":
        return <Clock className="h-4 w-4 text-orange-400 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-900/40 text-green-400 border-green-700";
      case "failed":
        return "bg-red-900/40 text-red-400 border-red-700";
      case "pending":
        return "bg-yellow-900/40 text-yellow-400 border-yellow-700";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-green-500" />
          Agent Command Interface
        </CardTitle>
        <CardDescription>
          Send commands to agents to block, unblock, or isolate IPs/nodes
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Command Input */}
        <div className="p-4 rounded-xl bg-gray-900 border border-gray-700 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select value={commandType} onValueChange={setCommandType}>
              <SelectTrigger>
                <SelectValue placeholder="Command" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="unblock">Unblock</SelectItem>
                <SelectItem value="isolate">Isolate</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Target (IP or Node)"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendCommand()}
            />

            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Both Agents</SelectItem>
                <SelectItem value="Rule-Based">Rule-Based</SelectItem>
                <SelectItem value="PPO">PPO Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSendCommand} className="w-full" disabled={!target.trim()}>
            <Send className="mr-2 h-4 w-4" />
            Send Command
          </Button>
        </div>

        {/* Command History */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Command History</h4>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {commands.map((cmd) => (
                <div
                  key={cmd.id}
                  className="p-3 rounded-xl bg-gray-900 border border-gray-700 hover:border-green-500 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(cmd.status)}
                      <span className="text-xs font-mono text-gray-400">{cmd.timestamp}</span>
                    </div>
                    <Badge className={getStatusColor(cmd.status)}>{cmd.status.toUpperCase()}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      {cmd.command.toUpperCase()} {cmd.target}
                    </p>
                    <p className="text-xs text-gray-400">Agent: {cmd.agent}</p>
                    <p className="text-xs text-green-400 mt-2">{cmd.response}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
