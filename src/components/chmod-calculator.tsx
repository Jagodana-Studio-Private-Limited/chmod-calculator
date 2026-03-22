"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, File, Folder, Link } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ToolEvents } from "@/lib/analytics";

// ─── Types ────────────────────────────────────────────────────────────────────

type FileType = "-" | "d" | "l";

interface PermissionSet {
  read: boolean;
  write: boolean;
  execute: boolean;
}

interface Permissions {
  owner: PermissionSet;
  group: PermissionSet;
  other: PermissionSet;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRESETS: { label: string; value: number; description: string }[] = [
  { label: "755", value: 0o755, description: "Owner full, group/other r+x" },
  { label: "644", value: 0o644, description: "Owner r+w, group/other r" },
  { label: "777", value: 0o777, description: "Full access for all (risky)" },
  { label: "700", value: 0o700, description: "Owner only, full access" },
  { label: "600", value: 0o600, description: "Owner r+w, no others (SSH keys)" },
  { label: "444", value: 0o444, description: "Read-only for everyone" },
  { label: "400", value: 0o400, description: "Owner read-only (SSH keys)" },
];

const FILE_TYPES: { value: FileType; label: string; icon: React.ReactNode }[] = [
  { value: "-", label: "File", icon: <File className="h-4 w-4" /> },
  { value: "d", label: "Directory", icon: <Folder className="h-4 w-4" /> },
  { value: "l", label: "Symlink", icon: <Link className="h-4 w-4" /> },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function permissionsToOctal(perms: Permissions): number {
  const toBits = (p: PermissionSet) =>
    (p.read ? 4 : 0) + (p.write ? 2 : 0) + (p.execute ? 1 : 0);
  return toBits(perms.owner) * 64 + toBits(perms.group) * 8 + toBits(perms.other);
}

function octalToPermissions(octal: number): Permissions {
  const fromBits = (n: number): PermissionSet => ({
    read: !!(n & 4),
    write: !!(n & 2),
    execute: !!(n & 1),
  });
  return {
    owner: fromBits((octal >> 6) & 7),
    group: fromBits((octal >> 3) & 7),
    other: fromBits(octal & 7),
  };
}

function permissionsToSymbolic(fileType: FileType, perms: Permissions): string {
  const toStr = (p: PermissionSet) =>
    `${p.read ? "r" : "-"}${p.write ? "w" : "-"}${p.execute ? "x" : "-"}`;
  return `${fileType}${toStr(perms.owner)}${toStr(perms.group)}${toStr(perms.other)}`;
}

function octalToString(n: number): string {
  return n.toString(8).padStart(3, "0");
}

function isValidOctal(s: string): boolean {
  return /^[0-7]{1,3}$/.test(s);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface PermissionGroupProps {
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  perms: PermissionSet;
  onChange: (key: keyof PermissionSet, value: boolean) => void;
}

function PermissionGroup({
  label,
  colorClass,
  bgClass,
  borderClass,
  perms,
  onChange,
}: PermissionGroupProps) {
  return (
    <div className={`rounded-xl border ${borderClass} ${bgClass} p-4 flex flex-col gap-3`}>
      <p className={`text-xs font-semibold uppercase tracking-widest ${colorClass} text-center`}>
        {label}
      </p>
      {(["read", "write", "execute"] as const).map((bit) => (
        <label
          key={bit}
          className="flex items-center justify-between gap-3 cursor-pointer group"
        >
          <span className="text-sm text-muted-foreground capitalize group-hover:text-foreground transition-colors">
            {bit}
          </span>
          <button
            role="checkbox"
            aria-checked={perms[bit]}
            onClick={() => onChange(bit, !perms[bit])}
            className={`
              relative h-6 w-6 rounded-md border-2 flex items-center justify-center
              transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
              ${
                perms[bit]
                  ? `${colorClass} border-current bg-current/15`
                  : "border-border bg-transparent hover:border-muted-foreground"
              }
            `}
          >
            {perms[bit] && (
              <motion.svg
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                viewBox="0 0 12 12"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="2,6 5,9 10,3" />
              </motion.svg>
            )}
          </button>
        </label>
      ))}

      {/* Octal digit badge */}
      <div
        className={`mt-1 text-center text-2xl font-mono font-bold ${colorClass}`}
      >
        {(perms.read ? 4 : 0) + (perms.write ? 2 : 0) + (perms.execute ? 1 : 0)}
      </div>
    </div>
  );
}

interface CopyButtonProps {
  value: string;
  label?: string;
}

function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      toast.success(label ? `${label} copied!` : "Copied!");
      ToolEvents.resultCopied();
      setTimeout(() => setCopied(false), 2000);
    });
  }, [value, label]);

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      aria-label={`Copy ${label ?? value}`}
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ChmodCalculator() {
  const [permissions, setPermissions] = useState<Permissions>(
    octalToPermissions(0o755)
  );
  const [fileType, setFileType] = useState<FileType>("-");
  const [rawInput, setRawInput] = useState("755");
  const [inputError, setInputError] = useState(false);

  const octal = permissionsToOctal(permissions);
  const octalStr = octalToString(octal);
  const symbolic = permissionsToSymbolic(fileType, permissions);
  const command = `chmod ${octalStr} filename`;

  const updatePermission = useCallback(
    (group: keyof Permissions, bit: keyof PermissionSet, value: boolean) => {
      setPermissions((prev) => {
        const next = {
          ...prev,
          [group]: { ...prev[group], [bit]: value },
        };
        const newOctal = permissionsToOctal(next);
        setRawInput(octalToString(newOctal));
        return next;
      });
      ToolEvents.toolUsed("checkbox");
    },
    []
  );

  const handleNumericInput = useCallback((val: string) => {
    setRawInput(val);
    if (isValidOctal(val) && val.length === 3) {
      setInputError(false);
      const parsed = parseInt(val, 8);
      setPermissions(octalToPermissions(parsed));
      ToolEvents.toolUsed("numeric-input");
    } else {
      setInputError(val.length > 0 && (!isValidOctal(val) || val.length > 3));
    }
  }, []);

  const applyPreset = useCallback((value: number) => {
    setPermissions(octalToPermissions(value));
    setRawInput(octalToString(value));
    setInputError(false);
    ToolEvents.toolUsed("preset");
  }, []);

  const groups: {
    key: keyof Permissions;
    label: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
  }[] = [
    {
      key: "owner",
      label: "Owner",
      colorClass: "text-emerald-500",
      bgClass: "bg-emerald-500/5 dark:bg-emerald-500/10",
      borderClass: "border-emerald-500/20",
    },
    {
      key: "group",
      label: "Group",
      colorClass: "text-blue-500",
      bgClass: "bg-blue-500/5 dark:bg-blue-500/10",
      borderClass: "border-blue-500/20",
    },
    {
      key: "other",
      label: "Other",
      colorClass: "text-amber-500",
      bgClass: "bg-amber-500/5 dark:bg-amber-500/10",
      borderClass: "border-amber-500/20",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* File type selector */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-center gap-3 flex-wrap"
      >
        <span className="text-sm font-medium text-muted-foreground">File type:</span>
        <div className="flex gap-2">
          {FILE_TYPES.map((ft) => (
            <button
              key={ft.value}
              onClick={() => setFileType(ft.value)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                ${
                  fileType === ft.value
                    ? "bg-brand/15 border-brand/40 text-brand"
                    : "bg-transparent border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                }
              `}
            >
              {ft.icon}
              {ft.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Permission grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {groups.map((g) => (
          <PermissionGroup
            key={g.key}
            label={g.label}
            colorClass={g.colorClass}
            bgClass={g.bgClass}
            borderClass={g.borderClass}
            perms={permissions[g.key]}
            onChange={(bit, val) => updatePermission(g.key, bit, val)}
          />
        ))}
      </motion.div>

      {/* Numeric input + result display */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-4"
      >
        {/* Numeric input */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-muted-foreground w-28 shrink-0">
            Numeric (octal)
          </label>
          <div className="relative flex-1 max-w-[140px]">
            <input
              type="text"
              inputMode="numeric"
              value={rawInput}
              onChange={(e) => handleNumericInput(e.target.value)}
              maxLength={3}
              placeholder="755"
              className={`
                w-full font-mono text-2xl font-bold text-center rounded-lg border bg-background px-3 py-2
                focus:outline-none focus:ring-2 transition-all
                ${
                  inputError
                    ? "border-red-500 focus:ring-red-500/40 text-red-500"
                    : "border-border focus:ring-brand/40 text-foreground"
                }
              `}
            />
            {inputError && (
              <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                Use digits 0–7 only
              </p>
            )}
          </div>
          <CopyButton value={octalStr} label="Numeric value" />
        </div>

        {/* Symbolic */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-muted-foreground w-28 shrink-0">
            Symbolic
          </label>
          <div className="flex-1 font-mono text-lg font-medium tracking-widest bg-background border border-border rounded-lg px-3 py-2 flex items-center">
            <span className="text-muted-foreground">{fileType}</span>
            <span className="text-emerald-500">
              {permissions.owner.read ? "r" : "-"}
              {permissions.owner.write ? "w" : "-"}
              {permissions.owner.execute ? "x" : "-"}
            </span>
            <span className="text-blue-500">
              {permissions.group.read ? "r" : "-"}
              {permissions.group.write ? "w" : "-"}
              {permissions.group.execute ? "x" : "-"}
            </span>
            <span className="text-amber-500">
              {permissions.other.read ? "r" : "-"}
              {permissions.other.write ? "w" : "-"}
              {permissions.other.execute ? "x" : "-"}
            </span>
          </div>
          <CopyButton value={symbolic} label="Symbolic notation" />
        </div>
      </motion.div>

      {/* chmod command */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-brand/20 bg-brand/5 p-4 flex items-center justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-1">
            Command
          </p>
          <code className="font-mono text-base break-all">
            <span className="text-muted-foreground">$ </span>
            <span className="text-foreground">chmod </span>
            <span className="text-brand font-bold">{octalStr}</span>
            <span className="text-muted-foreground"> filename</span>
          </code>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 shrink-0 border-brand/30 hover:bg-brand/10"
          onClick={() => {
            navigator.clipboard.writeText(command).then(() => {
              toast.success("Command copied!");
              ToolEvents.resultCopied();
            });
          }}
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
      </motion.div>

      {/* Presets */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-3"
      >
        <p className="text-sm font-medium text-muted-foreground">Common presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => {
            const isActive = octal === preset.value;
            return (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset.value)}
                title={preset.description}
                className={`
                  group relative px-3 py-2 rounded-lg border text-sm font-mono font-semibold transition-all
                  ${
                    isActive
                      ? "bg-brand/15 border-brand/50 text-brand"
                      : "bg-transparent border-border text-muted-foreground hover:border-brand/40 hover:text-foreground hover:bg-brand/5"
                  }
                `}
              >
                {preset.label}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-xs bg-popover text-popover-foreground border border-border rounded-md shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50"
      >
        <span>
          <strong className="text-foreground">r</strong> = Read (4)
        </span>
        <span>
          <strong className="text-foreground">w</strong> = Write (2)
        </span>
        <span>
          <strong className="text-foreground">x</strong> = Execute (1)
        </span>
        <span>
          <strong className="text-foreground">-</strong> = No permission (0)
        </span>
        <span className="ml-auto">
          Digit = r+w+x sum per group
        </span>
      </motion.div>
    </div>
  );
}
