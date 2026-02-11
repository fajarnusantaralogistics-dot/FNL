"use client";

import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";

export default function ContactWhatsapp() {
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nama: "",
    telp: "",
    email: "",
    jenis: "",
    asal: "",
    tujuan: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatPhone = (phone: string) => {
    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("08")) {
      cleaned = "62" + cleaned.slice(1);
    }

    if (!cleaned.startsWith("62")) {
      return null;
    }

    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formattedPhone = formatPhone(form.telp);

    if (!formattedPhone) {
      setError(t("phone_error"));
      return;
    }

    setLoading(true);

    const message = `
${t("wa_intro")}

${t("wa_nama")}: ${form.nama}
${t("wa_telp")}: ${formattedPhone}
${t("wa_email")}: ${form.email}
${t("wa_jenis")}: ${form.jenis}
${t("wa_asal")}: ${form.asal}
${t("wa_tujuan")}: ${form.tujuan}

${t("wa_closing")}
    `;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "6282156785580";

    setTimeout(() => {
      window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    }, 800);
  };

  return (
    <div className="mt-16">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/20 max-w-3xl mx-auto shadow-2xl">
        <h3 className="text-3xl font-bold text-white mb-3 text-center">
          {t("contact_title")}
        </h3>

        <p className="text-gray-300 text-center mb-8">
          {t("contact_subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="nama"
            placeholder={t("form_nama")}
            required
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
          />

          <input
            type="tel"
            name="telp"
            placeholder={t("form_telp")}
            required
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
          />

          <input
            type="email"
            name="email"
            placeholder={t("form_email")}
            required
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
          />

          <select
            name="jenis"
            required
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white text-black focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">{t("form_pilih_jenis")}</option>
            <option value={t("jenis_kendaraan")}>{t("jenis_kendaraan")}</option>
            <option value={t("jenis_alat_berat")}>
              {t("jenis_alat_berat")}
            </option>
            <option value={t("jenis_barang")}>{t("jenis_barang")}</option>
          </select>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="asal"
              placeholder={t("form_asal")}
              required
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />

            <input
              type="text"
              name="tujuan"
              placeholder={t("form_tujuan")}
              required
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-brand hover:bg-brand-dark"
            } text-white shadow-lg`}
          >
            {loading ? t("btn_loading") : t("btn_kirim")}
          </button>
        </form>
      </div>
    </div>
  );
}
