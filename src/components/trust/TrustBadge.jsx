import { Shield, FileCheck, UserCheck, Eye, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeConfig = {
  document: {
    icon: FileCheck,
    label: "Document Verified",
    shortLabel: "Docs",
    description: "Property documents have been verified",
  },
  owner: {
    icon: UserCheck,
    label: "Owner Verified",
    shortLabel: "Owner",
    description: "Property owner identity has been verified",
  },
  inspected: {
    icon: Eye,
    label: "Property Inspected",
    shortLabel: "Inspected",
    description: "Property has been physically inspected by our team",
  },
  safety: {
    icon: Shield,
    label: "Safety Certified",
    shortLabel: "Safe",
    description: "Property meets safety standards",
  },
};

const TrustBadge = ({ type, verified, size = "md", showLabel = true }) => {
  const config = badgeConfig[type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <div
      className={cn(
        "trust-badge",
        sizeClasses[size],
        verified ? "trust-badge-verified" : "trust-badge-pending bg-muted text-muted-foreground"
      )}
      title={config.description}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{size === "sm" ? config.shortLabel : config.label}</span>}
    </div>
  );
};

export default TrustBadge;

// Trust Score Component
export const TrustScore = ({ score, size = "md" }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-emerald-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-gray-400";
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Highly Trusted";
    if (score >= 60) return "Trusted";
    if (score >= 40) return "Verified";
    return "New";
  };

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "rounded-md font-bold text-white flex items-center justify-center",
          getScoreColor(score),
          sizeClasses[size]
        )}
      >
        {score}
      </div>
      {size !== "sm" && (
        <span className="text-sm font-medium text-foreground">{getScoreLabel(score)}</span>
      )}
    </div>
  );
};

// Trust Badges Row Component
export const TrustBadgesRow = ({ verification, size = "sm" }) => {
  if (!verification) {
    return (
      <div className="trust-badge bg-muted text-muted-foreground text-xs px-2 py-0.5">
        <Shield className="h-3 w-3" />
        <span>Pending Verification</span>
      </div>
    );
  }

  const badges = [
    { type: "document", verified: verification.document_verified },
    { type: "owner", verified: verification.owner_verified },
    { type: "inspected", verified: verification.property_inspected },
    { type: "safety", verified: verification.safety_certified },
  ];

  const verifiedCount = badges.filter((b) => b.verified).length;

  return (
    <div className="flex flex-wrap gap-1.5">
      {badges
        .filter((b) => b.verified)
        .map((badge) => (
          <TrustBadge
            key={badge.type}
            type={badge.type}
            verified={badge.verified}
            size={size}
            showLabel={size !== "sm"}
          />
        ))}
      {verifiedCount === 0 && (
        <div className="trust-badge bg-muted text-muted-foreground text-xs px-2 py-0.5">
          <Shield className="h-3 w-3" />
          <span>Pending</span>
        </div>
      )}
    </div>
  );
};
