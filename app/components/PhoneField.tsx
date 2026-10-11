"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  FlagImage,
  defaultCountries,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";
import type { CountryIso2, ParsedCountry } from "react-international-phone";

interface PhoneFieldProps {
  value: string;
  onChange: (phone: string) => void;
  onBlur?: () => void;
  hasError?: boolean;
  placeholder?: string;
  name?: string;
  defaultCountry?: CountryIso2;
}

const PREFERRED: CountryIso2[] = ["tz", "ke", "ug", "rw", "us", "gb"];

const ALL_COUNTRIES: ParsedCountry[] = defaultCountries
  .map(parseCountry)
  .sort((a, b) => a.name.localeCompare(b.name));

export default function PhoneField({
  value,
  onChange,
  onBlur,
  hasError = false,
  placeholder = "712 345 678",
  name = "phone",
  defaultCountry = "tz",
}: PhoneFieldProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const { inputValue, country, setCountry, handlePhoneValueChange, inputRef } =
    usePhoneInput({
      defaultCountry,
      value,
      countries: defaultCountries,
      disableDialCodeAndPrefix: true,
      onChange: (data) => onChange(data.phone),
    });

  useEffect(() => setMounted(true), []);

  const updateCoords = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCoords({ top: r.bottom + 8, left: r.left, width: r.width });
  }, []);

  useEffect(() => {
    if (!open) return;
    updateCoords();
    const onScrollOrResize = () => updateCoords();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, updateCoords]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !rootRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    setQuery("");
  }, [open]);

  const countries = useMemo(() => {
    const preferred = PREFERRED.map((iso) => ALL_COUNTRIES.find((c) => c.iso2 === iso)).filter(
      (c): c is ParsedCountry => Boolean(c)
    );
    const rest = ALL_COUNTRIES.filter((c) => !PREFERRED.includes(c.iso2));
    return [...preferred, ...rest];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso2.includes(q) ||
        c.dialCode.includes(q.replace(/\D/g, ""))
    );
  }, [query, countries]);

  const dropdown = (
    <AnimatePresence>
      {open && coords && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            width: coords.width,
            transformOrigin: "top center",
          }}
          className="z-[100] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
          role="listbox"
        >
          <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
              }}
              placeholder="Search country or code"
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.008 } } }}
            className="max-h-72 overflow-y-auto overscroll-contain py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-gray-400">
                No countries found
              </li>
            ) : (
              filtered.map((c) => {
                const selected = c.iso2 === country.iso2;
                return (
                  <motion.li
                    key={c.iso2}
                    variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0 } }}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        setCountry(c.iso2, { focusOnInput: true });
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-blue-50 ${
                        selected ? "bg-blue-50/70" : ""
                      }`}
                    >
                      <FlagImage iso2={c.iso2} size={22} className="rounded-sm" />
                      <span className="flex-1 truncate text-gray-800">{c.name}</span>
                      <span className="text-gray-400">+{c.dialCode}</span>
                      {selected && <Check className="h-4 w-4 shrink-0 text-blue-600" />}
                    </button>
                  </motion.li>
                );
              })
            )}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div ref={rootRef} className="relative">
      <div
        className={`flex items-stretch overflow-hidden rounded-2xl border-2 bg-white transition-colors ${
          hasError
            ? "border-red-400 bg-red-50"
            : "border-gray-200 focus-within:border-blue-500"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex shrink-0 items-center gap-2 px-3 hover:bg-gray-50 focus:outline-none"
          aria-label="Select country code"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <FlagImage iso2={country.iso2} size={22} className="rounded-sm" />
          <span className="text-sm font-semibold text-gray-700">+{country.dialCode}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </motion.span>
        </button>
        <input
          ref={inputRef}
          type="tel"
          name={name}
          value={inputValue}
          onChange={handlePhoneValueChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-4 py-4 text-base text-gray-900 outline-none placeholder:text-gray-400"
          autoComplete="tel"
        />
      </div>

      {mounted && createPortal(dropdown, document.body)}
    </div>
  );
}
