"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

type InquiryType = "Research Collaboration" | "Enterprise Solutions" | "Technical Support" | "General Inquiry";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    email: "",
    subject: "" as InquiryType | "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const inquiryTags: { type: InquiryType; label: string }[] = [
    { type: "Research Collaboration", label: "Research" },
    { type: "Enterprise Solutions", label: "Enterprise" },
    { type: "Technical Support", label: "Support" },
    { type: "General Inquiry", label: "General" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectInquiryType = (type: InquiryType) => {
    setFormData((prev) => ({
      ...prev,
      subject: prev.subject === type ? "" : type, // Toggle behavior
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setSubmitted(true);
    // Reset form data after submission
    setFormData({
      name: "",
      organization: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-ground-700/60 bg-ground-800/40 p-8 text-center backdrop-blur-md shadow-2xl min-h-[400px]">
        <div className="rounded-full bg-sensor/10 p-4 border border-sensor/20 animate-pulse">
          <CheckCircle2 className="h-10 w-10 text-sensor" />
        </div>
        <h3 className="mt-6 text-xl font-medium text-instrument">Message Sent</h3>
        <p className="mt-3 text-sm text-ground-400 max-w-sm leading-relaxed">
          Thank you for reaching out. A member of the Emissia team will review your inquiry and respond shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 rounded-lg border border-ground-700 bg-ground-900/60 px-5 py-2.5 text-xs font-medium text-instrument hover:border-ground-400 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-ground-700/60 bg-ground-800/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="readout text-[10px] uppercase tracking-wider text-ground-400">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="John Doe"
            className="w-full rounded-lg border border-ground-700 bg-ground-950/60 px-4 py-2.5 text-sm text-instrument placeholder-ground-600 outline-none transition-all focus:border-ground-400 focus:bg-ground-950 focus:ring-1 focus:ring-ground-400"
          />
        </div>

        {/* Organization */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="organization" className="readout text-[10px] uppercase tracking-wider text-ground-400">
            Organization / Company <span className="text-[9px] text-ground-500 lowercase">(optional)</span>
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleInputChange}
            placeholder="NASA, Stanford, etc."
            className="w-full rounded-lg border border-ground-700 bg-ground-950/60 px-4 py-2.5 text-sm text-instrument placeholder-ground-600 outline-none transition-all focus:border-ground-400 focus:bg-ground-950 focus:ring-1 focus:ring-ground-400"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="readout text-[10px] uppercase tracking-wider text-ground-400">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="johndoe@institution.org"
            className="w-full rounded-lg border border-ground-700 bg-ground-950/60 px-4 py-2.5 text-sm text-instrument placeholder-ground-600 outline-none transition-all focus:border-ground-400 focus:bg-ground-950 focus:ring-1 focus:ring-ground-400"
          />
        </div>

        {/* Subject / Inquiry Type */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subject" className="readout text-[10px] uppercase tracking-wider text-ground-400">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
            placeholder="Select a quick inquiry type below or type a custom subject"
            className="w-full rounded-lg border border-ground-700 bg-ground-950/60 px-4 py-2.5 text-sm text-instrument placeholder-ground-600 outline-none transition-all focus:border-ground-400 focus:bg-ground-950 focus:ring-1 focus:ring-ground-400"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="readout text-[10px] uppercase tracking-wider text-ground-400">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Describe your inquiry..."
            className="w-full resize-none rounded-lg border border-ground-700 bg-ground-950/60 px-4 py-2.5 text-sm text-instrument placeholder-ground-600 outline-none transition-all focus:border-ground-400 focus:bg-ground-950 focus:ring-1 focus:ring-ground-400"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !formData.name || !formData.email || !formData.message}
          className="group mt-2 flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-ground-950 transition-all duration-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none neon-btn-animate cursor-pointer"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-ground-950 border-t-transparent" />
          ) : (
            <>
              Send Message
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Quick Inquiry Buttons */}
      <div className="border-t border-ground-700/60 pt-5 flex flex-col gap-2.5">
        <span className="readout text-[9px] uppercase tracking-wider text-ground-500">
          Quick Inquiry Types
        </span>
        <div className="flex flex-wrap gap-2">
          {inquiryTags.map((tag) => {
            const isActive = formData.subject === tag.type;
            return (
              <button
                key={tag.type}
                type="button"
                onClick={() => selectInquiryType(tag.type)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-all duration-200 select-none cursor-pointer ${
                  isActive
                    ? "border-instrument bg-ground-700 text-instrument font-medium shadow-[0_0_10px_rgba(230,237,247,0.1)]"
                    : "border-ground-700 bg-ground-900/60 text-ground-400 hover:border-ground-500 hover:text-instrument hover:bg-ground-800"
                }`}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
