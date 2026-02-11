"use client";

import { Eye, Target } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/providers/language-provider";
import UniformImg from "../assets/uniform.jpeg";
import TeamImg from "../assets/kapal/5.jpeg";

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

        {/* STRUKTUR */}
        <div className="relative rounded-2xl overflow-hidden bg-[#0a192f] py-20 px-4">
          <Image
            src={TeamImg}
            alt="Team structure background"
            fill
            className="absolute inset-0 object-cover opacity-40"
            priority
          />

          <div className="relative z-10 max-w-6xl mx-auto">
            <h3 className="text-5xl font-bold text-white mb-16 italic ml-4">
              Structure
            </h3>

            {/* DIRECTOR */}
            <div className="flex flex-col items-center mb-10">
              <div className="bg-[#38b6ff] text-white rounded-lg px-8 py-3 shadow-lg text-center min-w-[220px]">
                <div className="font-bold text-lg">Firman Setiawan</div>
                <div className="text-xs">(Director)</div>
              </div>

              {/* garis turun */}
              <div className="hidden md:block w-px h-10 border-l-2 border-dashed border-white/60" />
            </div>

            {/* DESKTOP ORG CHART */}
            <div className="relative hidden md:block">
              {/* garis horizontal utama */}
              <div className="absolute top-0 left-[5%] right-[5%] h-px border-t-2 border-dashed border-white/60" />

              <div className="grid grid-cols-5 gap-6 pt-10">
                {/* FINANCE HEAD */}
                <div className="flex flex-col items-center">
                  <div className="w-px h-5 border-l-2 border-dashed border-white/60" />

                  <div className="bg-[#38b6ff] text-white rounded-lg p-3 text-center shadow-md w-full min-h-[70px]">
                    <div className="font-bold text-xs">Nur Fadhilah</div>
                    <div className="text-[9px]">
                      (Finance & Administration Dept Head)
                    </div>
                  </div>

                  <div className="w-px h-20 border-l-2 border-dashed border-white/60" />

                  <div className="grid grid-cols-2 gap-1 w-full">
                    <div className="bg-[#38b6ff] rounded-md p-2 text-center text-white text-[9px]">
                      <b>Nadiya</b>
                      <br />
                      (Finance & Adm)
                    </div>
                    <div className="bg-[#38b6ff] rounded-md p-2 text-center text-white text-[9px]">
                      <b>Mariska</b>
                      <br />
                      (Accounting & Tax)
                    </div>
                  </div>
                </div>

                {/* OPERATION HEAD */}
                <div className="flex flex-col items-center">
                  <div className="w-px h-5 border-l-2 border-dashed border-white/60" />

                  <div className="bg-[#38b6ff] text-white rounded-lg p-3 text-center shadow-md w-full min-h-[70px]">
                    <div className="font-bold text-xs">Sarif Hidayat</div>
                    <div className="text-[9px]">(Operation Dept Head)</div>
                  </div>

                  <div className="w-px h-8 border-l-2 border-dashed border-white/60" />

                  <div className="bg-[#38b6ff] text-white rounded-lg p-3 text-center shadow-md w-full min-h-[60px]">
                    <div className="font-bold text-xs">Reza Syahputra</div>
                    <div className="text-[9px]">(SPV Operation)</div>
                  </div>

                  <div className="w-px h-8 border-l-2 border-dashed border-white/60" />

                  <div className="grid grid-cols-2 gap-1 w-full">
                    <div className="bg-[#38b6ff] rounded-md p-2 text-center text-white text-[9px]">
                      <b>Rayhan</b>
                      <br />
                      (Staff)
                    </div>
                    <div className="bg-[#38b6ff] rounded-md p-2 text-center text-white text-[9px]">
                      <b>Umar</b>
                      <br />
                      (Staff)
                    </div>
                  </div>
                </div>

                {/* SALES HEAD */}
                <div className="flex flex-col items-center">
                  <div className="w-px h-5 border-l-2 border-dashed border-white/60" />

                  <div className="bg-[#38b6ff] text-white rounded-lg p-3 text-center shadow-md w-full min-h-[70px]">
                    <div className="font-bold text-xs">Herlina Bahar</div>
                    <div className="text-[9px]">
                      (Sales & Marketing Dept Head)
                    </div>
                  </div>

                  <div className="w-px h-20 border-l-2 border-dashed border-white/60" />

                  <div className="bg-[#38b6ff] rounded-md p-2 text-center text-white text-[9px] w-full">
                    <b>Anty</b>
                    <br />
                    (Marketing & Promotion)
                  </div>
                </div>

                {/* BISDEV ANALYST  */}
                <div className="flex flex-col items-center">
                  <div className="w-px h-14 border-l-2 border-dashed border-white/60" />
                  <div className="bg-[#38b6ff] text-white rounded-lg px-4 py-3 text-center shadow-md font-bold text-[10px] uppercase leading-tight">
                    Bisdev Analyst
                  </div>
                </div>
                {/* HC ANALYST */}
                <div className="flex flex-col items-center">
                  <div className="w-px h-14 border-l-2 border-dashed border-white/60" />
                  <div className="bg-[#38b6ff] text-white rounded-lg px-4 py-3 text-center shadow-md font-bold text-[10px] uppercase leading-tight">
                    HC Analyst
                  </div>
                </div>
              </div>
            </div>

            {/* ================= MOBILE STACK ================= */}
            <div className="md:hidden space-y-8">
              {[
                {
                  title: "Finance & Administration",
                  people: ["Nur Fadhilah (Head)", "Nadiya", "Mariska"],
                },
                {
                  title: "Operation",
                  people: [
                    "Sarif Hidayat (Head)",
                    "Reza (SPV)",
                    "Rayhan",
                    "Umar",
                  ],
                },
                {
                  title: "Sales & Marketing",
                  people: ["Herlina Bahar (Head)", "Anty"],
                },
                {
                  title: "Support",
                  people: ["Bisdev Analyst", "HC Analyst"],
                },
              ].map((dept, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <h4 className="text-white font-bold mb-3">{dept.title}</h4>
                  <div className="space-y-2">
                    {dept.people.map((p, j) => (
                      <div
                        key={j}
                        className="bg-[#38b6ff] text-white rounded-md p-2 text-sm text-center"
                      >
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
