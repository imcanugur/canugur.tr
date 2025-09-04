"use client";
import Turnstile from "react-turnstile";
import { isValidEmail } from "@/utils/check-email";
import axios from "axios";
import { useRef, useState } from "react";
import { TbMailForward } from "react-icons/tb";
import { toast } from "react-toastify";

function ContactForm() {
  const turnstileRef = useRef(null);

  const [error, setError] = useState({
    email: false,
    required: false,
    captcha: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  const checkRequired = () => {
    if (userInput.email && userInput.message && userInput.name) {
      setError((prev) => ({ ...prev, required: false }));
    }
  };

  const [captchaKey, setCaptchaKey] = useState(0);

  const resetForm = () => {
    setUserInput({ name: "", email: "", message: "" });
    setCaptchaToken("");
    setCaptchaKey((prev) => prev + 1);
  };

  const handleSendMail = async (e) => {
    e.preventDefault();

    if (!userInput.email || !userInput.message || !userInput.name) {
      setError((prev) => ({ ...prev, required: true }));
      return;
    }

    if (!isValidEmail(userInput.email)) {
      setError((prev) => ({ ...prev, email: true }));
      return;
    }

    if (!captchaToken) {
      setError((prev) => ({ ...prev, captcha: true }));
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/contact`, {
        ...userInput,
        token: captchaToken,
      });

      toast.success("✅ Message sent successfully!");
      resetForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || "❌ Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
        Contact with me
      </p>
      <div className="max-w-3xl text-white rounded-lg border border-[#464c6a] p-3 lg:p-5">
        <p className="text-sm text-[#d3d8e8]">
          {
            "If you have any questions or concerns, please don't hesitate to contact me. I am open to any work opportunities that align with my skills and interests."
          }
        </p>

        <form onSubmit={handleSendMail} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-base">Your Name: </label>
            <input
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] px-3 py-2"
              type="text"
              maxLength="100"
              required
              onChange={(e) =>
                setUserInput({ ...userInput, name: e.target.value })
              }
              onBlur={checkRequired}
              value={userInput.name}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Your Email: </label>
            <input
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] px-3 py-2"
              type="email"
              maxLength="100"
              required
              value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
              onBlur={() =>
                setError((prev) => ({
                  ...prev,
                  email: !isValidEmail(userInput.email),
                }))
              }
            />
            {error.email && (
              <p className="text-sm text-red-400">
                Please provide a valid email!
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-base">Your Message: </label>
            <textarea
              className="bg-[#10172d] w-full border rounded-md border-[#353a52] focus:border-[#16f2b3] px-3 py-2"
              maxLength="500"
              rows="4"
              required
              value={userInput.message}
              onChange={(e) =>
                setUserInput({ ...userInput, message: e.target.value })
              }
              onBlur={checkRequired}
            />
          </div>

          <div className="flex justify-center mt-4">
            <Turnstile
              key={captchaKey}
              ref={turnstileRef}
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onVerify={(token) => {
                setCaptchaToken(token);
                setError((prev) => ({ ...prev, captcha: false }));
              }}
              onExpire={() => setCaptchaToken("")}
              onError={() => setCaptchaToken("")}
              theme="dark"
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            {error.required && (
              <p className="text-sm text-red-400">
                ⚠️ All fields are required!
              </p>
            )}
            {error.captcha && (
              <p className="text-sm text-red-400">
                ⚠️ Please complete the captcha!
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`flex items-center gap-1 hover:gap-3 rounded-full 
              bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-3 text-sm md:text-base font-semibold 
              uppercase tracking-wider text-white transition-all duration-200 ease-out
              ${!captchaToken || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!captchaToken || isLoading}
          >
            {isLoading ? (
              "Sending..."
            ) : (
              <span className="flex items-center gap-1">
                Send Message <TbMailForward size={20} />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
