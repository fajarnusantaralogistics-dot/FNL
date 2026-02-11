"use client";

import { Quote, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/providers/language-provider";
import ContactWhatsapp from "@/components/ContactWhatsapp";

type Testimonial = {
  id?: string;
  name: string;
  position?: string;
  company?: string;
  testimonial: string;
  rating?: number;
  createdAt?: string;
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch("/api/testimonials", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load testimonials");
        return res.json();
      })
      .then((data: Testimonial[]) => {
        setTestimonials(data || []);
        setError(null);
      })
      .catch((err) => {
        if (err.name !== "AbortError")
          setError(err.message || "Error loading testimonials");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [testimonials.length]);

  const goPrev = () => {
    if (testimonials.length === 0) return;
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = window.setInterval(
        () => setIndex((i) => (i + 1) % testimonials.length),
        5000,
      );
    }
  };

  const goNext = () => {
    if (testimonials.length === 0) return;
    setIndex((i) => (i + 1) % testimonials.length);
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = window.setInterval(
        () => setIndex((i) => (i + 1) % testimonials.length),
        5000,
      );
    }
  };

  const { t } = useLanguage();
  const current = testimonials[index];

  return (
    <section className="py-20 bg-gradient-to-br from-[#002147] to-[#003366]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t("testimonials")}
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            {t("client_priority")}
          </p>
        </div>

        <div className="relative">
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              <div className="h-56 bg-white/5 rounded-lg animate-pulse" />
            </div>
          ) : error ? (
            <div className="p-8 bg-white/10 rounded-2xl text-white">
              {error}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="p-8 bg-white/10 rounded-2xl text-white">
              Belum ada testimoni.
            </div>
          ) : (
            <>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <Quote className="h-12 w-12 text-brand opacity-80" />
                  <div className="flex gap-1">
                    {current?.rating &&
                      [...Array(current.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                  </div>
                </div>

                <p className="text-gray-200 text-lg mb-6 leading-relaxed italic">
                  "{current?.testimonial}"
                </p>

                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">
                      {(current?.name || "??")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">
                      {current?.name}
                    </h4>
                    {current?.position && (
                      <p className="text-brand">{current.position}</p>
                    )}
                    {current?.company && (
                      <p className="text-gray-300 text-sm">{current.company}</p>
                    )}
                  </div>
                </div>
              </div>

              <button
                aria-label="Previous testimonial"
                onClick={goPrev}
                className="absolute -left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full shadow-md"
              >
                ‹
              </button>
              <button
                aria-label="Next testimonial"
                onClick={goNext}
                className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full shadow-md"
              >
                ›
              </button>

              <div className="mt-6 flex items-center justify-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-3 h-3 rounded-full ${i === index ? "bg-brand" : "bg-white/30"}`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t("feedback_title")}
            </h3>

            <p className="text-gray-300 mb-6">{t("feedback_subtitle")}</p>

            <ContactWhatsapp />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
