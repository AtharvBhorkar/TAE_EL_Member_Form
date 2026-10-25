import { useState, useRef } from "react"; // useRef add kiya
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser"; // EmailJS import kiya

const OPTIONS = [
  { id: "oop", tag: "TAE", title: "Movie Ticket Planner", sub: "TAE OOP · Topic #9", icon: "🎬" },
  { id: "agro", tag: "EL", title: "Agro Agency", sub: "EL OOP · Topic #19", icon: "🌾" },
  { id: "dcn", tag: "TAE", title: "Two College Buildings Connectivity", sub: "TAE DCN · Topic #4 · Fiber vs Wireless", icon: "📡" },
  { id: "anylab", tag: "TAE / EL", title: "Kisi bhi subject ka TAE / EL Lead", sub: "Future meJo bhi subject ka TAE ya EL ho, usme main lead karunga/karungi", icon: "🧪" },
  { id: "any", tag: "Flexible", title: "Koi bhi subject chalega", sub: "Jahan team ko zarurat ho", icon: "⚡" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } },
};

const EMPTY = { name: "", mobile: "", email: "", why: "", pick: "" };

const PARTY_COLORS = ["#7c3aed", "#ec4899", "#06b6d4", "#facc15", "#22c55e", "#f97316"];
const CONFETTI = Array.from({ length: 70 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 0.9,
  dur: 2 + Math.random() * 1.6,
  size: 6 + Math.random() * 8,
  color: PARTY_COLORS[i % PARTY_COLORS.length],
  rot: 360 + Math.random() * 720,
  drift: (Math.random() - 0.5) * 180,
}));
const BURSTS = [
  { x: "20%", y: "35%", d: 0 },
  { x: "80%", y: "30%", d: 0.35 },
  { x: "50%", y: "22%", d: 0.7 },
  { x: "30%", y: "70%", d: 1.0 },
  { x: "72%", y: "68%", d: 1.3 },
];
const SPARKS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return { x: Math.cos(a) * 90, y: Math.sin(a) * 90, c: PARTY_COLORS[i % PARTY_COLORS.length] };
});

function Celebration() {
  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0" style={{ background: "rgba(8,6,20,.55)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }} />

      {/* Crackers blasts */}
      {BURSTS.map((b, bi) => (
        <div key={bi} className="absolute" style={{ left: b.x, top: b.y }}>
          {SPARKS.map((s, i) => (
            <motion.span
              key={i}
              style={{ position: "absolute", width: 8, height: 8, marginLeft: -4, marginTop: -4, borderRadius: "50%", background: s.c }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{ x: s.x, y: s.y, scale: [0, 1.4, 0], opacity: [1, 1, 0] }}
              transition={{ delay: b.d, duration: 0.9, ease: "easeOut" }}
            />
          ))}
        </div>
      ))}

      {/* Confetti */}
      {CONFETTI.map((c) => (
        <motion.span
          key={c.id}
          style={{ position: "absolute", top: -20, left: `${c.left}%`, width: c.size, height: c.size * 0.5, background: c.color, borderRadius: 2 }}
          initial={{ y: -20, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", x: c.drift, rotate: c.rot, opacity: [1, 1, 0.8] }}
          transition={{ delay: c.delay, duration: c.dur, ease: "easeIn" }}
        />
      ))}

      {/* Party poppers - Adjusted for small screens to avoid overlapping text */}
      <motion.div className="absolute text-4xl sm:text-5xl md:text-6xl" style={{ left: "4%", bottom: "10%" }}
        initial={{ scale: 0, rotate: -40 }} animate={{ scale: [0, 1.3, 1], rotate: [-40, 10, 0] }} transition={{ duration: 0.6, type: "spring" }}>
        🎉
      </motion.div>
      <motion.div className="absolute text-4xl sm:text-5xl md:text-6xl" style={{ right: "4%", bottom: "10%", transform: "scaleX(-1)" }}
        initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.6, type: "spring", delay: 0.15 }}>
        🎉
      </motion.div>

      {/* Center text - Made fully responsive for iPhone SE to large screens */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <motion.div
          className="glass text-center rounded-3xl px-5 py-6 sm:px-10 sm:py-8 w-full max-w-[90%] sm:max-w-sm md:max-w-md"
          initial={{ scale: 0.4, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.3 }}
        >
          <div className="text-3xl sm:text-4xl md:text-5xl mb-2">🎊</div>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold grad-text">Congratulations!</h2>
          <p className="text-[11px] sm:text-xs md:text-sm mt-2 leading-tight" style={{ color: "var(--muted)" }}>
            Aapki application successfully submit ho gayi hai. Ab aap team lead ke liye ready hain! 🚀
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Field({ id, label, icon, type = "text", value, onChange, error, area, max }) {
  const common = {
    id, value, maxLength: max, placeholder: " ",
    onChange: (e) => onChange(e.target.value),
    className: "w-full text-sm sm:text-base"
  };
  return (
    <motion.div variants={item} className={`field ${area ? "ta" : ""} ${error ? "bad" : ""} relative`}>
      {area ? <textarea {...common} rows={4} /> : <input {...common} type={type} />}
      <label htmlFor={id}>{label}</label>
      {!area && <span className="ico">{icon}</span>}
      <AnimatePresence>
        {error && (
          <motion.p className="err text-xs sm:text-sm" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function App() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [isSending, setIsSending] = useState(false); // Loading state add ki

  const formRef = useRef(); // Form Ref banaya

  const set = (key) => (value) => {
    if (key === "mobile") value = value.replace(/\D/g, "").slice(0, 10);
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 3) er.name = "Poora naam likhiye";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) er.mobile = "Valid 10 digit mobile number daaliye";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Valid email ID daaliye";
    if (form.why.trim().length < 15) er.why = "Thoda detail me likhiye (kam se kam 15 characters)";
    if (!form.pick) er.pick = "Ek option select kijiye";
    setErrors(er);

    if (Object.keys(er).length === 0) {
      setIsSending(true);

      // Chuna hua option dhoondhne ke liye
      const chosen = OPTIONS.find((o) => o.id === form.pick);
      
      const templateParams = {
        from_name: form.name,
        mobile: form.mobile,
        email: form.email,
        why: form.why,
        pick: chosen ? `${chosen.title} (${chosen.tag})` : form.pick, 
      };

      // EMAIL JS CODE
      emailjs
        .send(
          "service_yzwxzwi",     // Service ID
          "template_lrylacm",    // Template ID
          templateParams,
          "RKjYcDsWHpsLMXTZ0"    // Public Key
        )
        .then((response) => {
          console.log("SUCCESS!", response.status, response.text);
          setCelebrate(true);
          setTimeout(() => setCelebrate(false), 4200);
          setDone(true);
          setIsSending(false);
        })
        .catch((err) => {
          console.log("FAILED...", err);
          alert("Email bhejne mein error aayi. Kripya internet check karein ya baad mein try karein.");
          setIsSending(false);
        });
    }
  };

  const chosenOption = OPTIONS.find((o) => o.id === form.pick);
  const isValid =
    form.name.trim().length >= 3 &&
    /^[6-9]\d{9}$/.test(form.mobile) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.why.trim().length >= 15 &&
    !!form.pick;

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center px-3 py-6 sm:px-6 sm:py-10 overflow-hidden">
      <div className="blob b1" /><div className="blob b2" /><div className="blob b3" />
      <AnimatePresence>{celebrate && <Celebration key="celebration" />}</AnimatePresence>

      <div className="relative z-10 w-full flex justify-center">
        <motion.div
          className="glass w-full max-w-md md:max-w-xl rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 md:p-8 max-h-[90dvh] overflow-y-auto no-scrollbar"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.form
                ref={formRef} // Ref add kiya
                key="form" noValidate onSubmit={handleSubmit}
                variants={container} initial="hidden" animate="show" exit={{ opacity: 0, x: -30 }}
                className="space-y-3 sm:space-y-4"
              >
                <motion.div variants={item} className="text-center mb-2">
                  <motion.div
                    animate={{ rotate: [0, -8, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="text-4xl sm:text-5xl mb-1 sm:mb-2"
                  >
                    👑
                  </motion.div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold grad-text leading-tight">Team Lead banne ka Golden Chance</h1>
                  <p className="text-xs sm:text-sm mt-2 sm:mt-3" style={{ color: "var(--muted)" }}>
                    Hum 3 members hain: Chaitanya Tijare, Sujal Khadekar aur Atharv Bhorkar. Har subject ke liye
                    ek-ek lead hoga. Chauthe member ko lead karne ka experience milega, toh apni details fill kijiye!
                  </p>
                </motion.div>

                <Field id="name" label="Poora Naam" icon="🧑" value={form.name} onChange={set("name")} error={errors.name} />
                <Field id="mobile" label="Mobile Number" icon="📱" type="tel" value={form.mobile} onChange={set("mobile")} error={errors.mobile} />
                <Field id="email" label="Email ID" icon="✉️" type="email" value={form.email} onChange={set("email")} error={errors.email} />
                <Field id="why" area max={300} label="Aap hamari team kyun join kar rahe ho?" value={form.why} onChange={set("why")} error={errors.why} />

                <motion.div variants={item}>
                  <p className="sec text-xs sm:text-sm font-semibold mb-2 sm:mb-3">KIS SUBJECT KO LEAD KARNA CHAHENGE?</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                    {OPTIONS.map((o) => (
                      <motion.button
                        type="button" key={o.id}
                        whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
                        className={`opt flex items-start gap-2 sm:gap-3 p-3 sm:p-4 text-left ${form.pick === o.id ? "on" : ""}`}
                        onClick={() => set("pick")(o.id)}
                      >
                        <span className="dot mt-1 flex-shrink-0" />
                        <span className="text-xl sm:text-2xl leading-none flex-shrink-0">{o.icon}</span>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-1 sm:gap-2 flex-wrap font-semibold text-xs sm:text-[15px] leading-tight">
                            <span className="break-words">{o.title}</span> <span className="tag text-[10px] sm:text-xs px-1.5 py-0.5">{o.tag}</span>
                          </span>
                          <span className="block text-[10px] sm:text-xs mt-1 leading-snug break-words" style={{ color: "var(--muted)" }}>{o.sub}</span>
                        </span>
                      </motion.button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {errors.pick && (
                      <motion.p className="err text-xs sm:text-sm mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {errors.pick}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={item} className="pt-2">
                  <motion.button 
                    type="submit" 
                    disabled={isSending}
                    className={`btn w-full py-3 sm:py-4 text-sm sm:text-base font-semibold ${isValid && !isSending ? "" : "opacity-60"}`} 
                    whileHover={isValid && !isSending ? { scale: 1.02, y: -2 } : {}} 
                    whileTap={isValid && !isSending ? { scale: 0.97 } : {}}
                  >
                    {isSending ? "Sending... ⏳" : "Submit Application 🚀"}
                  </motion.button>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 sm:py-6">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 160 }} className="text-4xl sm:text-5xl md:text-6xl mb-3"
                >
                  🎉
                </motion.div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold grad-text">Shukriya, {form.name.split(" ")[0]}!</h2>
                <p className="text-[11px] sm:text-xs md:text-sm mt-2 px-2" style={{ color: "var(--muted)" }}>
                  Aapki application submit ho gayi hai. Team jaldi aapse contact karegi.
                </p>
                <div className="text-left text-xs sm:text-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mt-5 sm:mt-6 space-y-1.5 break-words" style={{ background: "var(--input)", border: "1px solid var(--border)" }}>
                  <p>🧑 <span className="font-medium">{form.name}</span></p>
                  <p>📱 {form.mobile}</p>
                  <p>✉️ {form.email}</p>
                  {chosenOption && (
                    <p className="flex flex-wrap items-center gap-1">
                      <span>{chosenOption.icon}</span>
                      <span className="font-medium">{chosenOption.title}</span>
                      <span className="text-[10px] sm:text-xs" style={{ color: "var(--muted)" }}>({chosenOption.sub})</span>
                    </p>
                  )}
                </div>
                <button className="btn mt-5 sm:mt-6 w-full py-3 text-sm sm:text-base" onClick={() => { setDone(false); setForm(EMPTY); setErrors({}); }}>
                  Nayi application bharein
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}