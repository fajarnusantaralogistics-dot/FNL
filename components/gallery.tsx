"use client";

import { useEffect, useState } from "react";
import {} from "react";
import { useLanguage } from "@/providers/language-provider";
import { Car, Package, Construction, Building2 } from "lucide-react";
import operationalFallback1 from "../assets/operational/operational-1.jpeg";
import operationalFallback2 from "../assets/operational/operational-2.jpeg";
import operationalFallback3 from "../assets/operational/operational-3.jpeg";
import armadaLengkap1 from "../assets/armada/armada-1.jpeg";
import armadaLengkap2 from "../assets/armada/armada-2.jpeg";
import armadaLengkap3 from "../assets/armada/armada-3.jpeg";
import armadaLengkap4 from "../assets/armada/armada-4.jpeg";
import gudangModern1 from "../assets/warehouse.jpeg";

type CategoryEntry = {
  titleKey: string;
  descriptionKey?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  alt?: string;
};

const Gallery = () => {
  const [active, setActive] = useState(0);

  const categories: CategoryEntry[] = [
    {
      titleKey: "cat_pengiriman_kendaraan_title",
      icon: Car,
      alt: "Vehicle shipping",
      descriptionKey: "cat_pengiriman_kendaraan_desc",
    },
    {
      titleKey: "cat_barang_title",
      icon: Package,
      alt: "Cargo",
      descriptionKey: "cat_barang_desc",
    },
    {
      titleKey: "cat_alatberat_title",
      icon: Construction,
      alt: "Heavy equipment",
      descriptionKey: "cat_alatberat_desc",
    },
    {
      titleKey: "cat_kapal_title",
      icon: Building2,
      descriptionKey: "cat_kapal_desc",
    },
  ];

  const { t } = useLanguage();

  const cat = categories[active] as CategoryEntry;
  const Icon = cat.icon;
  const categoryFolders = [
    "kendaraan",
    "barang",
    "alat_berat",
    "material",
    "kapal",
  ];

  const [images, setImages] = useState<
    Array<{ url: string; public_id: string }>
  >([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lightboxImageLoaded, setLightboxImageLoaded] = useState(false);
  let startX = 0;

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") setCurrentIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight")
        setCurrentIndex((i) => Math.min(images.length - 1, i + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, images.length]);

  // Pointer / touch handlers for swipe
  useEffect(() => {
    function onPointerMove() {
      if (!isDragging) return;
    }
    function onPointerUp(e: any) {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const threshold = 80; // px
      if (dx > threshold) setCurrentIndex((i) => Math.max(0, i - 1));
      else if (dx < -threshold)
        setCurrentIndex((i) => Math.min(images.length - 1, i + 1));
      setIsDragging(false);

      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    }

    if (isDragging) {
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isDragging, images.length]);
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const folder = categoryFolders[active];
        const q = folder ? `?category=${encodeURIComponent(folder)}` : "";
        const res = await fetch(`/api/cloudinary${q}`);
        const data = await res.json();
        const items = (data.resources || []).map((r: any) => ({
          url: r.secure_url,
          public_id: r.public_id,
        }));
        setImages(items);
      } catch (err) {
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [active]);

  return (
    <section
      id="gallery"
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#002147] mb-3">
            {t("business_lines")}
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            {t("business_subtitle")}
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <div
              role="tablist"
              aria-label="Business categories"
              className="flex gap-3 justify-center flex-wrap"
            >
              {categories.map((cat, idx) => (
                <button
                  key={cat.titleKey}
                  id={`tab-${idx}`}
                  role="tab"
                  aria-controls={`panel-${idx}`}
                  aria-selected={active === idx}
                  onClick={() => setActive(idx)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    active === idx
                      ? "bg-sky-600 text-white shadow-md"
                      : "bg-white/60 text-slate-700 hover:bg-white/80"
                  }`}
                >
                  {t(cat.titleKey)}
                </button>
              ))}
            </div>
          </div>

          <div
            id={`panel-${active}`}
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            className="mt-6"
          >
            <article className="relative overflow-hidden rounded-2xl shadow-2xl">
              <div className="relative">
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-80 md:h-96">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-full h-40 md:h-96 rounded-md bg-white/5 animate-pulse"
                      />
                    ))}
                  </div>
                ) : images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-80 md:h-96 overflow-hidden">
                    {images.map((it, idx) => (
                      <button
                        key={it.public_id}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setLightboxImageLoaded(false);
                          setLightboxOpen(true);
                        }}
                        className="w-full h-40 md:h-96 overflow-hidden rounded-md focus:outline-none"
                        aria-label={`Open image ${idx + 1}`}
                      >
                        <img
                          src={it.url}
                          alt={t(cat.titleKey)}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="relative h-80 md:h-96 bg-gradient-to-tr from-slate-50 to-slate-100 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=400&width=800"
                      alt={t(cat.titleKey)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002147]/85 to-transparent mix-blend-multiply" />
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-center mb-2">
                  <div className="bg-white/10 p-3 rounded-lg mr-3 shadow-sm">
                    {Icon ? (
                      <Icon className="h-6 w-6 text-white" aria-hidden />
                    ) : null}
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    {t(cat.titleKey)}
                  </h3>
                </div>
                <p className="text-gray-200 text-sm md:text-base">
                  {cat.descriptionKey ? t(cat.descriptionKey) : ""}
                </p>
              </div>
            </article>
          </div>
        </div>
        {/* Promotional stat/feature cards section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <figure className="relative overflow-hidden rounded-xl shadow-lg h-64">
            <img
              src={
                [
                  operationalFallback1,
                  operationalFallback2,
                  operationalFallback3,
                ][Math.floor(Date.now() / 3000) % 3].src
              }
              alt={t("operational_24")}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <figcaption className="absolute inset-0 bg-[#002147]/40 flex items-center justify-center text-white font-bold text-xl">
              {t("operational_24")}
            </figcaption>
          </figure>

          <figure className="relative overflow-hidden rounded-xl shadow-lg h-64">
            <img
              src={
                [
                  armadaLengkap1,
                  armadaLengkap2,
                  armadaLengkap3,
                  armadaLengkap4,
                ][Math.floor(Date.now() / 3000) % 4].src
              }
              alt={t("operational_24")}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />{" "}
            <figcaption className="absolute inset-0 bg-[#002147]/40 flex items-center justify-center text-white font-bold text-xl">
              {t("armada_lengkap")}
            </figcaption>
          </figure>

          <figure className="relative overflow-hidden rounded-xl shadow-lg h-64">
            <img
              src={[gudangModern1][Math.floor(Date.now() / 3000) % 1].src}
              alt={t("operational_24")}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />{" "}
            <figcaption className="absolute inset-0 bg-[#002147]/40 flex items-center justify-center text-white font-bold text-xl">
              {t("gudang_modern")}
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Lightbox modal */}
      {lightboxOpen && images.length > 0 ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute inset-0"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
          />
          <div className="relative max-w-4xl w-full mx-4">
            <div className="relative">
              <img
                src={images[currentIndex].url}
                alt={`image ${currentIndex + 1}`}
                onLoad={() => setLightboxImageLoaded(true)}
                className="w-full max-h-[80vh] object-contain rounded"
              />

              {!lightboxImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2"
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              onClick={() =>
                setCurrentIndex((i) => Math.min(images.length - 1, i + 1))
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2"
              aria-label="Next image"
            >
              ›
            </button>

            <div className="mt-3 flex gap-2 overflow-x-auto py-2">
              {images.map((it, idx) => (
                <button
                  key={it.public_id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`flex-none w-20 h-12 overflow-hidden rounded ${idx === currentIndex ? "ring-2 ring-white" : ""}`}
                >
                  <img
                    src={it.url}
                    alt={`thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default Gallery;
