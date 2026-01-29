import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { apiCall } from "@/lib/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Security Question, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/users/by-email?email=${email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("User not found");
      }

      const data = await response.json();
      setSecurityQuestion(data.user?.securityQuestion || "");
      setStep(2);
      toast.success("User found! Please answer your security question.");
    } catch (error) {
      toast.error(error.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    if (!securityAnswer) {
      toast.error("Please enter your security answer");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/verify-security-answer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, securityAnswer }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Incorrect security answer");
      }

      const data = await response.json();
      localStorage.setItem("resetToken", data.resetToken);
      setStep(3);
      toast.success("Security answer verified! Set your new password.");
    } catch (error) {
      toast.error(error.message || "Failed to verify security answer");
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter both passwords");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            securityAnswer,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reset password");
      }

      localStorage.removeItem("resetToken");
      setStep(4);
      toast.success("Password reset successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <button
        onClick={() => navigate("/auth")}
        className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-lg transition"
        title="Go back"
      >
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </button>

      <Card className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Home className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl font-bold text-primary">
              WebGI
            </span>
          </div>
          <h1 className="font-heading text-2xl font-bold">Reset Password</h1>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Checking..." : "Continue"}
            </Button>
          </form>
        )}

        {/* Step 2: Security Question */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm font-medium text-blue-900">
                Security Question:
              </p>
              <p className="text-sm text-blue-800 mt-1">{securityQuestion}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Your Answer</Label>
              <Input
                id="answer"
                type="text"
                placeholder="Enter your answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Answer"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleStep3} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setStep(2)}
            >
              Back
            </Button>
          </form>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-green-600">
              Password Reset Successfully!
            </h2>
            <p className="text-muted-foreground">
              Your password has been reset. You can now sign in with your new password.
            </p>
            <Button
              onClick={() => navigate("/auth")}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Go to Sign In
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
