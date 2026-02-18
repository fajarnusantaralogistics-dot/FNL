"use client";

import { Eye, Target } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/providers/language-provider";
import UniformImg from "../assets/uniform.jpeg";

type HotspotProps = {
  id: string;
  nx: number;
  ny: number;
  label: string;
  onActivate: () => void;
  onDeactivate?: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  naturalRef: React.MutableRefObject<{ w: number; h: number }>;
};

function Hotspot({
  id,
  nx,
  ny,
  label,
  onActivate,
  onDeactivate,
  containerRef,
  naturalRef,
}: HotspotProps) {
  const [style, setStyle] = useState<Record<string, any>>({
    left: `${nx * 100}%`,
    top: `${ny * 100}%`,
    position: "absolute",
    transform: "translate(-50%, -50%)",
  });

  useEffect(() => {
    function compute() {
      const nat = naturalRef.current;
      const container = containerRef.current;
      if (!nat?.w || !nat?.h || !container) {
        setStyle({
          left: `${nx * 100}%`,
          top: `${ny * 100}%`,
          position: "absolute",
          transform: "translate(-50%, -50%)",
        });
        return;
      }

      const cw = container.clientWidth;
      const ch = container.clientHeight;
      const scale = Math.max(cw / nat.w, ch / nat.h);
      const scaledW = nat.w * scale;
      const scaledH = nat.h * scale;
      const offsetX = (scaledW - cw) / 2;
      const offsetY = (scaledH - ch) / 2;

      const sx = nx * nat.w * scale;
      const sy = ny * nat.h * scale;
      const leftPx = sx - offsetX;
      const topPx = sy - offsetY;

      setStyle({
        left: `${leftPx}px`,
        top: `${topPx}px`,
        position: "absolute",
        transform: "translate(-50%, -50%)",
      });
    }

    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [nx, ny, containerRef, naturalRef]);

  return (
    <button
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onClick={onActivate}
      className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md ring-2 ring-sky-500"
      style={style}
      aria-label={id}
    >
      <span className="text-sky-600 font-bold">{label}</span>
    </button>
  );
}

const CompanyOverview = () => {
  const { t } = useLanguage();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const natural = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-5xl md:text-6xl font-extrabold text-[#1aa0c8] leading-tight">
                {t("who_are_we")}
              </h2>
              <p className="mt-6 text-gray-700 text-lg max-w-3xl">
                {t("overview_paragraph")}
              </p>

              <div className="mt-6 grid sm:grid-cols-3 gap-4 max-w-xl">
                <div className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-[#002147] mt-2 mr-3" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#002147]">
                      {t("experience_title")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("experience_text")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 mr-3" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#002147]">
                      {t("armada_title")}
                    </h4>
                    <p className="text-sm text-gray-600">{t("armada_text")}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="w-2 h-2 rounded-full bg-green-400 mt-2 mr-3" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#002147]">
                      {t("solusi_title")}
                    </h4>
                    <p className="text-sm text-gray-600">{t("solusi_text")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <Image
                  src={require("../assets/About/Team.jpeg")}
                  alt="Team"
                  className="w-full h-64 object-cover md:h-80 lg:h-96"
                  width={300}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-[#002147] to-[#003366] p-8 rounded-2xl shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-sky-400 p-3 rounded-lg mr-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {t("vision_title")}
              </h3>
            </div>
            <p className="text-gray-200 leading-relaxed">{t("vision_text")}</p>
          </div>

          <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-8 rounded-2xl shadow-xl">
            <div className="flex items-center mb-4">
              <div className="bg-white p-3 rounded-lg mr-4">
                <Target className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {t("mission_title")}
              </h3>
            </div>
            <ul className="text-white space-y-2 leading-relaxed">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>{t("mission_point_1")}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>{t("mission_point_2")}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>{t("mission_point_3")}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>{t("mission_point_4")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* UNIFORM HOTSPOT */}
        <div className="mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-4xl font-extrabold text-[#1aa0c8] mb-4">
                  {t("our_uniform_title")}
                </h3>
                <p className="text-gray-700 mb-4">{t("uniform_paragraph")}</p>

                <div className="space-y-3">
                  <button
                    className="text-left w-full p-3 rounded-lg hover:bg-sky-50"
                    onClick={() => setActiveHotspot("outdoor")}
                  >
                    <span className="font-semibold">
                      {t("hotspot_outdoor_title")}
                    </span>
                    <div className="text-sm text-gray-600">
                      {t("hotspot_outdoor_text")}
                    </div>
                  </button>

                  <button
                    className="text-left w-full p-3 rounded-lg hover:bg-sky-50"
                    onClick={() => setActiveHotspot("navy")}
                  >
                    <span className="font-semibold">
                      {t("hotspot_navy_title")}
                    </span>
                    <div className="text-sm text-gray-600">
                      {t("hotspot_navy_text")}
                    </div>
                  </button>

                  <button
                    className="text-left w-full p-3 rounded-lg hover:bg-sky-50"
                    onClick={() => setActiveHotspot("white")}
                  >
                    <span className="font-semibold">
                      {t("hotspot_white_title")}
                    </span>
                    <div className="text-sm text-gray-600">
                      {t("hotspot_white_text")}
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative w-full">
                <div
                  ref={containerRef}
                  className="rounded-2xl overflow-hidden shadow-lg relative"
                >
                  <Image
                    src={UniformImg}
                    alt="Uniform examples"
                    className="w-full h-72 md:h-96 object-cover"
                    width={1200}
                    height={800}
                    onLoadingComplete={(img) => {
                      natural.current = {
                        w: img.naturalWidth,
                        h: img.naturalHeight,
                      };
                    }}
                  />
                </div>

                {/* Hotspots */}
                <Hotspot
                  id="outdoor"
                  nx={0.09}
                  ny={0.48}
                  label="1"
                  onActivate={() => setActiveHotspot("outdoor")}
                  onDeactivate={() => setActiveHotspot(null)}
                  containerRef={containerRef}
                  naturalRef={natural}
                />

                <Hotspot
                  id="navy"
                  nx={0.35}
                  ny={0.5}
                  label="2"
                  onActivate={() => setActiveHotspot("navy")}
                  onDeactivate={() => setActiveHotspot(null)}
                  containerRef={containerRef}
                  naturalRef={natural}
                />

                <Hotspot
                  id="white"
                  nx={0.78}
                  ny={0.48}
                  label="3"
                  onActivate={() => setActiveHotspot("white")}
                  onDeactivate={() => setActiveHotspot(null)}
                  containerRef={containerRef}
                  naturalRef={natural}
                />

                {/* Tooltip / info panel */}
                <div className="absolute left-0 right-0 bottom-0 flex justify-center pointer-events-none">
                  <div className="pointer-events-auto bg-white/90 text-gray-800 rounded-xl px-4 py-2 shadow-md m-4 max-w-md">
                    {activeHotspot === "outdoor" && (
                      <div>
                        <div className="font-semibold">
                          {t("hotspot_outdoor_title")}
                        </div>
                        <div className="text-sm">
                          {t("hotspot_outdoor_text")}
                        </div>
                      </div>
                    )}
                    {activeHotspot === "navy" && (
                      <div>
                        <div className="font-semibold">
                          {t("hotspot_navy_title")}
                        </div>
                        <div className="text-sm">{t("hotspot_navy_text")}</div>
                      </div>
                    )}
                    {activeHotspot === "white" && (
                      <div>
                        <div className="font-semibold">
                          {t("hotspot_white_title")}
                        </div>
                        <div className="text-sm">{t("hotspot_white_text")}</div>
                      </div>
                    )}
                    {activeHotspot === null && (
                      <div className="text-sm text-gray-600">
                        {t("hover_or_click")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyOverview;
