import React, { useState, useEffect } from "react";
import { Mail, ShieldCheck, KeyRound, CheckCircle2, ArrowRight, RefreshCw, X, Loader2, AlertCircle } from "lucide-react";
import { requestChangeEmail, confirmChangeEmail } from "../../../api/user/user.api";

const ChangeEmailModal = ({ isOpen, onClose, currentEmail, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Input Email, 2: Input OTP
  const [newEmail, setNewEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Countdown timer for resend OTP (60s)
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCountdown]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setNewEmail("");
      setOtpCode("");
      setErrorMsg("");
      setSuccessMsg("");
      setResendCountdown(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanEmail = newEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMsg("Vui lòng nhập địa chỉ email mới!");
      return;
    }

    if (!validateEmail(cleanEmail)) {
      setErrorMsg("Địa chỉ Email không đúng định dạng (VD: example@gmail.com)!");
      return;
    }

    if (cleanEmail === currentEmail?.toLowerCase()) {
      setErrorMsg("Email mới phải khác với email hiện tại của bạn!");
      return;
    }

    try {
      setLoading(true);
      const res = await requestChangeEmail(cleanEmail);
      if (res.success) {
        setStep(2);
        setResendCountdown(60);
        setSuccessMsg(res.message || `Mã OTP đã được gửi đến ${cleanEmail}`);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Không thể gửi mã OTP. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanOtp = otpCode.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      setErrorMsg("Vui lòng nhập đầy đủ 6 chữ số mã OTP!");
      return;
    }

    try {
      setLoading(true);
      const res = await confirmChangeEmail(newEmail.trim().toLowerCase(), cleanOtp);
      if (res.success) {
        if (onSuccess) {
          onSuccess(newEmail.trim().toLowerCase());
        }
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Xác thực OTP thất bại. Vui lòng kiểm tra lại mã!");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || loading) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      setLoading(true);
      const res = await requestChangeEmail(newEmail.trim().toLowerCase());
      if (res.success) {
        setResendCountdown(60);
        setSuccessMsg(`Đã gửi lại mã OTP mới đến ${newEmail.trim().toLowerCase()}`);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Không thể gửi lại mã OTP. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 transform transition-all">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#EE0033] to-[#A00022] px-6 py-5 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Thay đổi Email</h3>
              <p className="text-[11px] text-white/80 font-medium mt-0.5">Xác thực OTP chính chủ cho Email mới</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">

          {/* Stepper indicator */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                step === 1 ? "bg-[#EE0033] text-white shadow-md shadow-red-200" : "bg-emerald-500 text-white"
              }`}>
                {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : "1"}
              </span>
              <span className={`text-xs font-bold ${step === 1 ? "text-slate-900" : "text-slate-500"}`}>Email mới</span>
            </div>

            <div className="h-0.5 flex-1 mx-3 bg-slate-200">
              <div className={`h-full bg-[#EE0033] transition-all duration-300 ${step === 2 ? "w-full" : "w-0"}`}></div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition ${
                step === 2 ? "bg-[#EE0033] text-white shadow-md shadow-red-200" : "bg-slate-100 text-slate-400"
              }`}>
                2
              </span>
              <span className={`text-xs font-bold ${step === 2 ? "text-slate-900" : "text-slate-400"}`}>Xác thực OTP</span>
            </div>
          </div>

          {/* Alert Error */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {/* Alert Success */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          {/* STEP 1: Form Nhập Email Mới */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Email hiện tại</label>
                <input
                  type="text"
                  value={currentEmail || "—"}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-2xl px-4 py-2.5 text-xs font-semibold cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1">
                  Email mới cần thay đổi <span className="text-[#EE0033]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="VD: email_moi@gmail.com"
                    required
                    autoFocus
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-2xl px-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-[#EE0033] focus:bg-white transition outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Mã xác nhận OTP 6 chữ số sẽ được gửi trực tiếp tới email này.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#EE0033] hover:bg-red-700 text-white font-extrabold px-5 py-2.5 rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang gửi OTP...
                    </>
                  ) : (
                    <>
                      Gửi mã OTP <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Form Nhập OTP */}
          {step === 2 && (
            <form onSubmit={handleConfirmOtp} className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center">
                <p className="text-xs text-slate-600">
                  Nhập mã OTP 6 chữ số vừa được gửi tới:
                </p>
                <p className="text-sm font-extrabold text-[#EE0033] mt-0.5">{newEmail}</p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1 text-center">
                  Mã xác thực OTP (6 chữ số) <span className="text-[#EE0033]">*</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="• • • • • •"
                  required
                  autoFocus
                  className="w-full bg-slate-50 border-2 border-dashed border-[#EE0033]/40 text-center text-xl tracking-[8px] font-black text-[#EE0033] rounded-2xl px-4 py-3 focus:ring-2 focus:ring-[#EE0033] focus:border-[#EE0033] focus:bg-white transition outline-none"
                />
              </div>

              {/* Countdown & Resend Option */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtpCode("");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-slate-500 hover:text-slate-800 underline font-semibold cursor-pointer text-[11px]"
                >
                  Change Email khác
                </button>

                {resendCountdown > 0 ? (
                  <span className="text-[11px] font-medium text-slate-400">
                    Gửi lại mã sau <strong className="text-slate-700">{resendCountdown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-[#EE0033] hover:underline font-extrabold text-[11px] cursor-pointer flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Gửi lại mã OTP
                  </button>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="bg-[#EE0033] hover:bg-red-700 text-white font-extrabold px-6 py-2.5 rounded-2xl text-xs shadow-md transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Đang xác minh...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" /> Xác nhận đổi Email
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ChangeEmailModal;
