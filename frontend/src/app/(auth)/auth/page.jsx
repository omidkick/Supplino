"use client";

import { useEffect, useState } from "react";
import SendOTPFrom from "./_components/SendOTPFrom";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkOtp, getOtp } from "@/services/authServices";
import CheckOTPForm from "./_components/CheckOTPForm";
import { useRouter } from "next/navigation";
import AuthLayout from "../_components/AuthLayout";
import { useStep } from "@/context/StepContext";

const RESEND_TIME = 90;

function AuthPage() {
  const queryClient = useQueryClient();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [time, setTime] = useState(RESEND_TIME);
  const router = useRouter();
  const { setCurrentStep } = useStep();

  // Set the current step for the step indicator
  useEffect(() => {
    setCurrentStep(2); // Authentication step
  }, [setCurrentStep]);

  const {
    data: otpResponse,
    error,
    isPending: isSendingOtp,
    mutateAsync: mutateGetOtp,
  } = useMutation({
    mutationFn: getOtp,
  });

  const { mutateAsync: mutateCheckOtp, isPending: isCheckingOtp } = useMutation(
    {
      mutationFn: checkOtp,
    }
  );

  const phoneNumberHandler = (e) => {
    setPhoneNumber(e.target.value);
  };

  const sendOtpHandler = async (e) => {
    e.preventDefault();
    try {
      const data = await mutateGetOtp({ phoneNumber });
      toast.success(data.message);
      setStep(2);
      setTime(RESEND_TIME);
      setOtp("");
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const checkOtpHandler = async (e) => {
    e.preventDefault();
    try {
      const { message, user } = await mutateCheckOtp({ phoneNumber, otp });
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["get-user"] });

      if (user.isActive) {
        router.push("/home");
      } else {
        // Update step before navigating
        setCurrentStep(2);
        router.push("/complete-profile");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const timer = time > 0 && setInterval(() => setTime((t) => t - 1), 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [time]);

  const renderSteps = () => {
    switch (step) {
      case 1:
        return (
          <SendOTPFrom
            phoneNumber={phoneNumber}
            onChange={phoneNumberHandler}
            onSubmit={sendOtpHandler}
            isLoading={isSendingOtp}
          />
        );
      case 2:
        return (
          <CheckOTPForm
            onBack={() => setStep((s) => s - 1)}
            otp={otp}
            setOtp={setOtp}
            phoneNumber={phoneNumber}
            onSubmit={checkOtpHandler}
            time={time}
            onResendOtp={sendOtpHandler}
            otpResponse={otpResponse}
            isCheckingOtp={isCheckingOtp}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout showDecorative={true} showSteps={true}>
      {renderSteps()}
    </AuthLayout>
  );
}

export default AuthPage;
