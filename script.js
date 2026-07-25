
      // ── TIME HELPERS ──────────────────────────────
      const toAbs = (h, m) => h * 60 + m;
      const fromAbs = (a) => {
        const n = ((a % 1440) + 1440) % 1440;
        return { h: Math.floor(n / 60), m: n % 60 };
      };
      const fmt12 = (h, m) => {
        const hh = ((h % 24) + 24) % 24,
          ap = hh >= 12 ? "PM" : "AM",
          h12 = hh % 12 || 12;
        return `${h12}:${String(m).padStart(2, "0")} ${ap}`;
      };
      const fmtA = (a) => {
        const { h, m } = fromAbs(a);
        return fmt12(h, m);
      };

      // ── STATIC DATA ───────────────────────────────
      const PRAYER_NAMES = [
        { name: "Fajr", emoji: "🌅" },
        { name: "Dhuhr", emoji: "☀️" },
        { name: "Asr", emoji: "🌤️" },
        { name: "Maghrib", emoji: "🌇" },
        { name: "Isha", emoji: "🌙" },
      ];
      const HABITS = [
        { name: "🧘 Yoga / Stretching", goal: "15 min" },
        { name: "🤸 Calisthenics Exercises", goal: "20 min" },
        { name: "🚶‍♀️ Walking", goal: "30 min" },
        { name: "💧 Drink Water", goal: "2L+" },
        { name: "📚 Deep Study Done", goal: "2 hrs" },
        { name: "💻 Work / Projects", goal: "4 hrs" },
        { name: "📖 Book Reading", goal: "1 hr" },
        { name: "💼 Job Application", goal: "1+ applied" },
      ];
      const QUOTES = [
        {
          t: "Discipline is choosing between what you want now and what you want most.",
          a: "— Anonymous",
        },
        {
          t: "Small steps every day lead to extraordinary results over time.",
          a: "— James Clear",
        },
        {
          t: "Consistency beats motivation every single day.",
          a: "— Anonymous",
        },
        {
          t: "Work hard in silence. Let success make the noise.",
          a: "— Frank Ocean",
        },
        {
          t: "The morning is the rudder of the day.",
          a: "— Henry Ward Beecher",
        },
        {
          t: "You don't rise to the level of your goals. You fall to the level of your systems.",
          a: "— James Clear",
        },
        {
          t: "An investment in knowledge pays the best interest.",
          a: "— Benjamin Franklin",
        },
        {
          t: "If a day doesn't go as planned, continue from the next block. Never quit.",
          a: "— Sumu's Rule",
        },
        { t: "Pray, code, repeat. That is the formula.", a: "— Sumu's Rule" },
        {
          t: "Progress, not perfection — every small step counts.",
          a: "— Sumu's Rule",
        },
        {
          t: "Your future self is watching you right now through your memories.",
          a: "— Anonymous",
        },
        {
          t: "Rise up, start fresh — see the bright opportunity in each new day.",
          a: "— Anonymous",
        },
      ];
      const COACH = {
        fajr: [
          "Bismillah — after Fajr, the day is yours. 🌅",
          "Fajr done! The world is asleep, you are already ahead. ✨",
          "Protect this quiet morning — it is your competitive edge. 📖",
        ],
        morning: [
          "Deep work block — phone away, full focus. 🎯",
          "You are building skills while most people sleep. 💻",
          "One focused hour beats five distracted ones. 🧠",
        ],
        mid: [
          "Dhuhr done, lunch done — project time! 💻",
          "Afternoon brain is sharp — use it! 🔥",
          "Every line of code is one step closer to your goal. 🎯",
        ],
        asr: [
          "Asr done — job prep time! 💼",
          "One application today can change everything. 🔍",
          "Evening revision — sharpen the skills that get you hired. 🧠",
        ],
        maghrib: [
          "After Maghrib is rest time — give your brain a break. 😌",
          "Family time — be present, put the phone down. 👨‍👩‍👧",
          "The day is ending — stay grateful. 🤲",
        ],
        night: [
          "Isha done — you have earned your rest. 🌙",
          "Get ready for tomorrow — sleep early. 💤",
          "Alhamdulillah — you showed up today. 🤲",
        ],
        period: [
          "Your body is working hard — you are still showing up. 🌸",
          "Self-care is productivity — be guilt free. 💕",
          "Keep your routine strong today. 🌸",
        ],
        entertain: [
          "Enjoy fully — recharging is part of the journey! 🎉",
          "Be present, make memories. 😊",
          "Prayers on time everywhere — enjoy the rest! 🕌",
        ],
      };
      const SLEEP_OPTS = [
        { id: "9pm", label: "9 PM", sub: "→ Wake 4:00 AM", wakeH: 4, key: "A" },
        {
          id: "10pm",
          label: "10 PM",
          sub: "→ Wake 4:00 AM + 10-11am nap",
          wakeH: 4,
          key: "B",
        },
        {
          id: "11pm",
          label: "11 PM",
          sub: "→ Wake 6:00 AM",
          wakeH: 6,
          key: "C",
        },
        {
          id: "12am",
          label: "12 AM",
          sub: "→ Wake 7:00 AM",
          wakeH: 7,
          key: "D",
        },
        { id: "1am", label: "1 AM", sub: "→ Wake 8:00 AM", wakeH: 8, key: "E" },
        { id: "2am", label: "2 AM", sub: "→ Wake 9:00 AM", wakeH: 9, key: "F" },
        {
          id: "3am",
          label: "3 AM",
          sub: "→ Wake 10:00 AM",
          wakeH: 10,
          key: "G",
        },
        {
          id: "period",
          label: "🌸 Period",
          sub: "Full routine, no prayers",
          wakeH: null,
          key: "PERIOD",
          type: "period",
        },
        {
          id: "entertain",
          label: "🎉 Enjoy Day",
          sub: "5 prayers + 10 commits",
          wakeH: null,
          key: "ENTERTAIN",
          type: "entertain",
        },
      ];

      // ── ROUTINE BUILDER ───────────────────────────
      // Uses sequential cursor — prayers are anchors inserted at exact times
      // No overlaps possible because each block starts where the previous ended
      // Prayer check: if cursor is past a prayer time and it hasn't been used, insert it first
      function makeItem(task, startA, dur, cat, pri, note, isPrayer) {
        const { h, m } = fromAbs(startA);
        return {
          task,
          startA,
          endA: startA + dur,
          absMin: startA,
          timeH: h,
          timeM: m,
          cat,
          priority: pri,
          note: note || "",
          isNamaj: !!isPrayer,
        };
      }

      function buildRoutine(routineKey, P, isPeriod) {
        // Prayer absolute minutes
        const FA = toAbs(P.fajr.h, P.fajr.m);
        const DA = toAbs(P.dhuhr.h, P.dhuhr.m);
        const AA = toAbs(P.asr.h, P.asr.m);
        const MA = toAbs(P.maghrib.h, P.maghrib.m);
        const IA = toAbs(P.isha.h, P.isha.m);

        const items = [];
        let used = new Set();

        // Insert a prayer if not yet used
        const insertPrayer = (name, pa, dur) => {
          if (isPeriod || used.has(pa)) return;
          items.push(makeItem(name, pa, dur, "ibadah", "high", "15 min", true));
          used.add(pa);
        };

        // Add a block starting at cursor, but first check if any prayer should go before it
        // cursor is passed by reference via object
        const C = { v: 0 };
        const block = (task, dur, cat, pri, note) => {
          // Before adding this block, flush any overdue prayers
          const prayerOrder = [
            { a: FA, n: "🕌 Fajr Prayer + Quran", d: 30 },
            { a: DA, n: "🕌 Dhuhr Prayer", d: 20 },
            { a: AA, n: "🕌 Asr Prayer", d: 15 },
            { a: MA, n: "🕌 Maghrib Prayer", d: 20 },
            { a: IA, n: "🕌 Isha Prayer", d: 20 },
          ];
          // Check prayers that fall strictly before this block ends
          const blockEnd = C.v + dur;
          let inserted = true;
          while (inserted) {
            inserted = false;
            for (const p of prayerOrder) {
              if (!isPeriod && !used.has(p.a) && p.a >= C.v && p.a < blockEnd) {
                // Prayer falls inside this block — add partial block before prayer
                const partDur = p.a - C.v;
                if (partDur > 0) {
                  items.push(
                    makeItem(task + " (cont.)", C.v, partDur, cat, pri, note),
                  );
                  C.v += partDur;
                }
                insertPrayer(p.n, p.a, p.d);
                C.v = p.a + p.d;
                inserted = true;
                break;
              }
            }
          }
          // Add remaining block
          const remaining = blockEnd - C.v;
          if (remaining > 0) {
            items.push(makeItem(task, C.v, remaining, cat, pri, note));
            C.v += remaining;
          }
        };

        const snap = (a) => {
          C.v = a;
        }; // jump cursor to fixed time

        // ── ROUTINE A: 9PM → 4:00 AM wake ──────────
        if (routineKey === "A") {
          snap(toAbs(4, 0));
          items.push(
            makeItem(
              "🌅 Wake Up + Freshen Up + Wudu",
              toAbs(4, 0),
              15,
              "self",
              "high",
              "Prepare for Fajr",
            ),
          );
          C.v = toAbs(4, 15);
          // Fajr fixed at 4:15 – 4:45 (matches your wake-up slot exactly)
          if (!isPeriod) {
            items.push(
              makeItem(
                "🕌 Fajr Prayer + Quran",
                toAbs(4, 15),
                30,
                "ibadah",
                "high",
                "4:15 – 4:45 AM",
                true,
              ),
            );
            used.add(FA);
          }
          C.v = toAbs(4, 45);
          items.push(
            makeItem(
              "🧘 Yoga / Stretching",
              C.v,
              15,
              "fitness",
              "medium",
              "15 min — wake your body up",
            ),
          );
          C.v += 15;
          snap(toAbs(5, 0));
          items.push(
            makeItem(
              "☕ Breakfast + Plan the Day",
              toAbs(5, 0),
              30,
              "meals",
              "medium",
              "30 min — set 3 priorities",
            ),
          );
          C.v = toAbs(5, 30);
          block(
            "📖 Deep Study Session",
            120,
            "study",
            "high",
            "2 hrs — Programming / DSA / full focus",
          );
          block("💻 Work / Projects (Block 1)", 45, "career", "high", "45 min");
          block(
            "😌 Free Time",
            30,
            "free",
            "low",
            "30 min — rest, scroll, recharge",
          );
          block(
            "💻 Work / Projects (Block 2)",
            135,
            "career",
            "high",
            "2 hrs 15 min — job prep + coding",
          );
          snap(toAbs(11, 0));
          block("🏠 Household Work", 120, "home", "medium", "2 hrs");
          // Dhuhr anchor
          if (!isPeriod && !used.has(DA)) {
            snap(DA);
            insertPrayer("🕌 Dhuhr Prayer", DA, 15);
            C.v = DA + 15;
          }
          items.push(
            makeItem(
              "🚿 Shower + Fresh Up",
              C.v,
              45,
              "self",
              "medium",
              "45 min",
            ),
          );
          C.v += 45;
          items.push(
            makeItem(
              "🍽️ Lunch",
              C.v,
              45,
              "meals",
              "medium",
              "45 min — eat well",
            ),
          );
          C.v += 45;

          // ── FIXED 2:30 PM – 9:00 PM SCHEDULE (no overlaps) ──
          snap(toAbs(14, 30));
          items.push(
            makeItem(
              "💻 Work / Projects",
              toAbs(14, 30),
              60,
              "career",
              "high",
              "2:30 – 3:30 PM",
            ),
          );
          items.push(
            makeItem(
              "📝 Light Study",
              toAbs(15, 30),
              60,
              "study",
              "medium",
              "3:30 – 4:30 PM — book / English / revision",
            ),
          );
          if (!isPeriod) {
            items.push(
              makeItem(
                "🕌 Asr Prayer",
                toAbs(16, 30),
                15,
                "ibadah",
                "high",
                "4:30 – 4:45 PM",
                true,
              ),
            );
          }
          items.push(
            makeItem(
              "😌 Free Time",
              toAbs(16, 45),
              45,
              "free",
              "low",
              "4:45 – 5:30 PM",
            ),
          );
          items.push(
            makeItem(
              "🍳 Snacks + Family Time",
              toAbs(17, 30),
              60,
              "family",
              "medium",
              "5:30 – 6:30 PM — be present with family",
            ),
          );
          if (!isPeriod) {
            items.push(
              makeItem(
                "🕌 Maghrib Prayer",
                toAbs(18, 45),
                20,
                "ibadah",
                "high",
                "6:45 – 7:05 PM",
                true,
              ),
            );
          }
          items.push(
            makeItem(
              "😌 Free Time",
              toAbs(19, 5),
              25,
              "free",
              "low",
              "7:05 – 7:30 PM",
            ),
          );
          items.push(
            makeItem(
              "🍽️ Dinner",
              toAbs(19, 30),
              30,
              "meals",
              "medium",
              "7:30 – 8:00 PM",
            ),
          );
          if (!isPeriod) {
            items.push(
              makeItem(
                "🕌 Isha Prayer",
                toAbs(20, 0),
                30,
                "ibadah",
                "high",
                "8:00 – 8:30 PM",
                true,
              ),
            );
          }
          items.push(
            makeItem(
              "💻 Optional Work Zone",
              toAbs(20, 30),
              15,
              "career",
              "low",
              "8:30 – 8:45 PM — only if you still have energy",
            ),
          );
          items.push(
            makeItem(
              "🌙 Freshen Up + Wind Down",
              toAbs(20, 45),
              15,
              "self",
              "medium",
              "8:45 – 9:00 PM — prepare for bed",
            ),
          );
          items.push(
            makeItem(
              "💤 Sleep",
              toAbs(21, 0),
              0,
              "free",
              "high",
              "7 hrs → wake 4:00 AM",
            ),
          );
        }

        // ── ROUTINE B: 10PM → wake 4:00 AM + 10-11am nap ─────────
        else if (routineKey === "B") {
          snap(toAbs(4, 0));
          items.push(
            makeItem(
              "🌅 Wake Up + Freshen Up + Wudu",
              toAbs(4, 0),
              15,
              "self",
              "high",
              "Prepare for Fajr",
            ),
          );
          C.v = toAbs(4, 15);
          // Fajr fixed at 4:15 – 4:45 (matches your wake-up slot exactly)
          if (!isPeriod) {
            items.push(
              makeItem(
                "🕌 Fajr Prayer + Quran",
                toAbs(4, 15),
                30,
                "ibadah",
                "high",
                "4:15 – 4:45 AM",
                true,
              ),
            );
            used.add(FA);
          }
          C.v = toAbs(4, 45);
          items.push(
            makeItem(
              "🧘 Yoga / Stretching",
              C.v,
              15,
              "fitness",
              "medium",
              "15 min — wake your body up",
            ),
          );
          C.v += 15;
          snap(toAbs(5, 0));
          items.push(
            makeItem(
              "☕ Breakfast",
              toAbs(5, 0),
              30,
              "meals",
              "medium",
              "5:00 – 5:30 AM",
            ),
          );
          items.push(
            makeItem(
              "📚 Full Focused Study",
              toAbs(5, 30),
              60,
              "study",
              "high",
              "5:30 – 6:30 AM — deepest focus block",
            ),
          );
          items.push(
            makeItem(
              "💻 Work",
              toAbs(6, 30),
              105,
              "career",
              "high",
              "6:30 – 8:15 AM",
            ),
          );
          items.push(
            makeItem(
              "😌 Free Time",
              toAbs(8, 15),
              30,
              "free",
              "low",
              "8:15 – 8:45 AM",
            ),
          );
          items.push(
            makeItem(
              "💻 Work / Projects",
              toAbs(8, 45),
              75,
              "career",
              "high",
              "8:45 – 10:00 AM",
            ),
          );
          items.push(
            makeItem(
              "😴 Nap / Rest",
              toAbs(10, 0),
              60,
              "self",
              "medium",
              "10:00 – 11:00 AM — counts toward your daily sleep total",
            ),
          );
          snap(toAbs(11, 0));
          block("🏠 Household Work", 120, "home", "medium", "2 hrs");
          if (!isPeriod && !used.has(DA)) {
            snap(DA);
            insertPrayer("🕌 Dhuhr Prayer", DA, 15);
            C.v = DA + 15;
          }
          items.push(
            makeItem(
              "🚿 Shower + Fresh Up",
              C.v,
              45,
              "self",
              "medium",
              "45 min",
            ),
          );
          C.v += 45;
          items.push(
            makeItem("🍽️ Lunch", C.v, 45, "meals", "medium", "45 min"),
          );
          C.v += 45;

          // ── FIXED 2:30 PM – 10:00 PM SCHEDULE (no overlaps) ──
          snap(toAbs(14, 30));
          items.push(
            makeItem(
              "💻 Work / Projects",
              toAbs(14, 30),
              60,
              "career",
              "high",
              "2:30 – 3:30 PM",
            ),
          );
          items.push(
            makeItem(
              "📝 Light Study",
              toAbs(15, 30),
              60,
              "study",
              "medium",
              "3:30 – 4:30 PM — book / English / revision",
            ),
          );
          if (!isPeriod) {
            items.push(
              makeItem(
                "🕌 Asr Prayer",
                toAbs(16, 30),
                15,
                "ibadah",
                "high",
                "4:30 – 4:45 PM",
                true,
              ),
            );
          }
          items.push(
            makeItem(
              "😌 Free Time",
              toAbs(16, 45),
              45,
              "free",
              "low",
              "4:45 – 5:30 PM",
            ),
          );
          items.push(
            makeItem(
              "🍳 Snacks + Family Time",
              toAbs(17, 30),
              60,
              "family",
              "medium",
              "5:30 – 6:30 PM — be present with family",
            ),
          );
          if (!isPeriod) {
            items.push(
              makeItem(
                "🕌 Maghrib Prayer",
                toAbs(18, 45),
                20,
                "ibadah",
                "high",
                "6:45 – 7:05 PM",
                true,
              ),
            );
          }
          items.push(
            makeItem(
              "😌 Free Time",
              toAbs(19, 5),
              25,
              "free",
              "low",
              "7:05 – 7:30 PM",
            ),
          );
          items.push(
            makeItem(
              "🍽️ Dinner",
              toAbs(19, 30),
              30,
              "meals",
              "medium",
              "7:30 – 8:00 PM",
            ),
          );
          if (!isPeriod) {
            items.push(
              makeItem(
                "🕌 Isha Prayer",
                toAbs(20, 0),
                30,
                "ibadah",
                "high",
                "8:00 – 8:30 PM",
                true,
              ),
            );
          }
          items.push(
            makeItem(
              "💻 Optional Work Zone",
              toAbs(20, 30),
              60,
              "career",
              "low",
              "8:30 – 9:30 PM — only if you still have energy",
            ),
          );
          items.push(
            makeItem(
              "🌙 Freshen Up + Wind Down",
              toAbs(21, 30),
              30,
              "self",
              "medium",
              "9:30 – 10:00 PM — prepare for bed",
            ),
          );
          items.push(
            makeItem(
              "💤 Sleep",
              toAbs(22, 0),
              0,
              "free",
              "high",
              "6h night + 1h nap = 7h total → wake 4:00 AM",
            ),
          );
        }

        // ── ROUTINES C–G: Fajr alarm + wake later ───
        else {
          const wakeMap = {
            C: toAbs(6, 0),
            D: toAbs(7, 0),
            E: toAbs(8, 0),
            F: toAbs(9, 0),
            G: toAbs(10, 0),
          };
          const sleepMap = {
            C: toAbs(23, 0),
            D: toAbs(24, 0),
            E: toAbs(25, 0),
            F: toAbs(26, 0),
            G: toAbs(27, 0),
          };
          const wakeA = wakeMap[routineKey] || toAbs(6, 0);
          const sleepA = sleepMap[routineKey] || toAbs(23, 0);

          // Fajr alarm block
          if (!isPeriod) {
            items.push(
              makeItem(
                "🕌 Fajr — Alarm: Pray then Back to Sleep",
                FA,
                20,
                "ibadah",
                "high",
                "Wake for Fajr, pray, then continue sleeping",
                true,
              ),
            );
            used.add(FA);
          }
          snap(wakeA);
          items.push(
            makeItem("🌅 Wake Up + Freshen Up", wakeA, 15, "self", "high", ""),
          );
          C.v = wakeA + 15;
          items.push(
            makeItem(
              "🧘 Yoga + Breakfast + Plan",
              C.v,
              45,
              "self",
              "medium",
              "45 min — stretch, eat, set goals",
            ),
          );
          C.v += 45;

          // Morning study/work based on routine
          if (routineKey === "C" || routineKey === "D") {
            block(
              "📖 Deep Study Session",
              120,
              "study",
              "high",
              "2 hrs — Programming / DSA",
            );
            if (routineKey === "D") {
              block("😌 Free Time", 30, "free", "low", "30 min");
              block(
                "💻 Work / Projects (Block 1)",
                30,
                "career",
                "high",
                "30 min morning work block",
              );
            } else {
              block("😌 Free Time", 30, "free", "low", "30 min");
              block(
                "💻 Work / Projects (Block 1)",
                90,
                "career",
                "high",
                "1 hr 30 min",
              );
            }
          } else if (routineKey === "E") {
            block(
              "📖 Deep Study Session",
              120,
              "study",
              "high",
              "2 hrs — full focus",
            );
          } else if (routineKey === "F") {
            block(
              "📖 Deep Study (Part 1 of 2)",
              60,
              "study",
              "high",
              "1 hr — before household",
            );
          }
          // G: no morning study — all afternoon

          snap(toAbs(11, 0));
          block("🏠 Household Work", 120, "home", "medium", "2 hrs");

          if (!isPeriod && !used.has(DA)) {
            snap(DA);
            insertPrayer("🕌 Dhuhr Prayer", DA, 15);
            C.v = DA + 15;
          }
          items.push(
            makeItem(
              "🚿 Shower + Fresh Up",
              C.v,
              45,
              "self",
              "medium",
              "45 min",
            ),
          );
          C.v += 45;
          items.push(
            makeItem(
              "🍽️ Lunch",
              C.v,
              45,
              "meals",
              "medium",
              "45 min — eat well",
            ),
          );
          C.v += 45;

          if (routineKey === "C" || routineKey === "D") {
            block(
              "💻 Work / Projects",
              routineKey === "C" ? 90 : 120,
              "career",
              "high",
              routineKey === "C" ? "1 hr 30 min" : "2 hrs",
            );
          } else if (routineKey === "E") {
            block("💻 Work / Projects", 120, "career", "high", "2 hrs");
          } else if (routineKey === "F") {
            block(
              "📖 Deep Study (Part 2 of 2)",
              60,
              "study",
              "high",
              "1 hr — 2nd block after lunch",
            );
            block("💻 Work / Projects", 120, "career", "high", "2 hrs");
          } else if (routineKey === "G") {
            block(
              "📖 Deep Study Session",
              120,
              "study",
              "high",
              "2 hrs — full afternoon focus",
            );
            block("💻 Work / Projects (Block 1)", 60, "career", "high", "1 hr");
          }

          if (!isPeriod && !used.has(AA)) {
            snap(AA);
            insertPrayer("🕌 Asr Prayer", AA, 15);
            C.v = AA + 15;
          }
          if (routineKey === "G")
            block(
              "💻 Work / Projects (Block 2)",
              60,
              "career",
              "high",
              "1 hr — after Asr",
            );
          block(
            "📝 Light Study",
            60,
            "study",
            "medium",
            "1 hr — book / English / revision",
          );

          snap(toAbs(17, 30));
          items.push(
            makeItem(
              "🍳 Snacks + Family Time",
              toAbs(17, 30),
              60,
              "family",
              "medium",
              "1 hr — be present with family",
            ),
          );
          C.v = toAbs(18, 30);
          const freeEndCG = MA > toAbs(18, 30) ? MA : toAbs(18, 45);
          items.push(
            makeItem(
              "😌 Free Time",
              toAbs(18, 30),
              freeEndCG - toAbs(18, 30),
              "free",
              "low",
              "Rest before Maghrib",
            ),
          );
          C.v = freeEndCG;

          if (!isPeriod && !used.has(MA)) {
            if (C.v < MA) C.v = MA;
            insertPrayer("🕌 Maghrib Prayer", MA, 15);
            C.v = Math.max(C.v, MA + 15);
          }
          items.push(
            makeItem("🍽️ Dinner", C.v, 30, "meals", "medium", "30 min"),
          );
          C.v += 30;
          if (!isPeriod && !used.has(IA)) {
            if (C.v < IA) C.v = IA;
            insertPrayer("🕌 Isha Prayer", IA, 15);
            C.v = Math.max(C.v, IA + 15);
          }
          items.push(
            makeItem(
              "💻 Work (After Isha)",
              C.v,
              routineKey === "C" ? 60 : 120,
              "career",
              "medium",
              routineKey === "C" ? "1 hr if still awake" : "2 hrs",
            ),
          );
          C.v += routineKey === "C" ? 60 : 120;

          const { h: sh, m: sm } = fromAbs(sleepA);
          const wakeDisp = fmtA(wakeA);
          // Sleep hours: from sleepA to (FA+30) next morning = real sleep after Fajr
          const fajrDoneA = FA + 30; // Fajr prayer ends
          const nightSleep = (fajrDoneA + 1440 - sleepA) % 1440; // mins from sleep to Fajr done
          const napSleep = wakeA - (FA + 30); // mins from Fajr done to actual wake
          const totalSleepH =
            Math.round(((nightSleep + napSleep) / 60) * 10) / 10;
          items.push(
            makeItem(
              "💤 Sleep",
              sleepA,
              0,
              "free",
              "high",
              `~${totalSleepH}h total sleep (incl. after Fajr) → wake ${wakeDisp}`,
            ),
          );
        }

        return items.filter((i) => i).sort((a, b) => a.startA - b.startA);
      }

      // Enjoy Day routine
      function buildEnjoyRoutine(P) {
        const FA = toAbs(P.fajr.h, P.fajr.m),
          DA = toAbs(P.dhuhr.h, P.dhuhr.m);
        const AA = toAbs(P.asr.h, P.asr.m),
          MA = toAbs(P.maghrib.h, P.maghrib.m),
          IA = toAbs(P.isha.h, P.isha.m);
        const mk = (t, a, d, c, p, n, ip) => {
          const { h, m } = fromAbs(a);
          return {
            task: t,
            startA: a,
            endA: a + d,
            absMin: a,
            timeH: h,
            timeM: m,
            cat: c,
            priority: p,
            note: n || "",
            isNamaj: !!ip,
          };
        };
        const gitStart = Math.max(DA - 120, FA + 90);
        return [
          mk(
            "🕌 Fajr Prayer",
            FA,
            30,
            "ibadah",
            "high",
            "On time — wherever you are",
            true,
          ),
          mk(
            "☕ Breakfast",
            FA + 30,
            30,
            "meals",
            "medium",
            "Relax and eat well",
          ),
          mk(
            "📖 Study (30 min minimum)",
            FA + 60,
            30,
            "study",
            "medium",
            "Commute / waiting time — 30 min minimum",
          ),
          mk(
            "💻 GitHub — 10+ Commits",
            gitStart,
            DA - gitStart,
            "career",
            "high",
            "Minimum 10 push/commit — anytime during the day",
          ),
          mk("🕌 Dhuhr Prayer", DA, 15, "ibadah", "high", "On time", true),
          mk(
            "😊 Enjoy Fully",
            DA + 15,
            AA - DA - 15,
            "free",
            "low",
            "Zero guilt — recharging is productive!",
          ),
          mk("🕌 Asr Prayer", AA, 15, "ibadah", "high", "On time", true),
          mk(
            "😊 Enjoy / Family Time",
            AA + 15,
            MA - AA - 15,
            "free",
            "low",
            "Be present, make memories",
          ),
          mk("🕌 Maghrib Prayer", MA, 15, "ibadah", "high", "On time", true),
          mk("🍽️ Dinner", MA + 15, 30, "meals", "medium", "30 min"),
          mk("🕌 Isha Prayer", IA, 15, "ibadah", "high", "On time", true),
          mk(
            "📝 Reflection (1 line)",
            IA + 15,
            15,
            "study",
            "low",
            "Write 1 line summary of the day",
          ),
          mk(
            "💤 Sleep",
            toAbs(22, 0),
            0,
            "free",
            "high",
            "Sleep as early as possible",
          ),
        ]
          .filter((i) => i.endA > i.startA || i.task.includes("Sleep"))
          .sort((a, b) => a.startA - b.startA);
      }

      // ── ACTIVE TASK DETECTION ─────────────────────
      function getActiveIdx(schedule) {
        const now = new Date();
        const nowA = toAbs(now.getHours(), now.getMinutes());
        // For tasks past midnight (startA >= 1440), current time before 6 AM should be treated as 1440+
        const adj = nowA < 360 ? nowA + 1440 : nowA;
        let idx = 0;
        for (let i = 0; i < schedule.length; i++) {
          const sa =
            schedule[i].startA < 360
              ? schedule[i].startA + 1440
              : schedule[i].startA;
          if (adj >= sa) idx = i;
        }
        return idx;
      }

      // ── PRAYER TIMES API ──────────────────────────
      async function fetchPrayerTimes(dateKey) {
        const cached = localStorage.getItem(`pt_${dateKey}`);
        if (cached) return JSON.parse(cached);
        try {
          const [y, m, d] = dateKey.split("-");
          const r = await fetch(
            `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=23.7461&longitude=90.3742&method=1`,
          );
          const j = await r.json();
          if (j.code !== 200) throw new Error();
          const t = j.data.timings;
          const p = (s) => {
            const [h, m] = s.split(":").map(Number);
            return { h, m };
          };
          const times = {
            fajr: p(t.Fajr),
            dhuhr: p(t.Dhuhr),
            asr: p(t.Asr),
            maghrib: p(t.Maghrib),
            isha: p(t.Isha),
          };
          localStorage.setItem(`pt_${dateKey}`, JSON.stringify(times));
          return times;
        } catch {
          return {
            fajr: { h: 4, m: 0 },
            dhuhr: { h: 12, m: 5 },
            asr: { h: 15, m: 25 },
            maghrib: { h: 18, m: 48 },
            isha: { h: 20, m: 10 },
          };
        }
      }

      // ── STATE ─────────────────────────────────────
      let SUPABASE_URL = localStorage.getItem("sb_url") || "";
      let SUPABASE_KEY = localStorage.getItem("sb_key") || "";
      const TABLE = "planner_days";
      let syncEnabled = !!(SUPABASE_URL && SUPABASE_KEY);
      const todayKey = getDateKey(new Date());
      let viewingKey = todayKey;

      function getDateKey(d) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }
      function formatKey(k) {
        const [y, m, d] = k.split("-");
        const M = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return `${M[+m - 1]} ${+d}, ${y}`;
      }
      function formatKeyShort(k) {
        const [, m, d] = k.split("-");
        const M = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return `${M[+m - 1]} ${+d}`;
      }
      function emptyDay() {
        return {
          prayers: Array(5).fill(false),
          habits: Array(6).fill(false),
          tasks: [],
          reflection: { win: "", improve: "", gratitude: "" },
          sleepId: null,
          mode: "normal",
        };
      }
      function localLoad(key) {
        try {
          const r = localStorage.getItem(`sumu_${key}`);
          if (r) return JSON.parse(r);
        } catch (e) {}
        return emptyDay();
      }
      function localSave(key, data) {
        try {
          localStorage.setItem(`sumu_${key}`, JSON.stringify(data));
        } catch (e) {}
      }
      function localAllKeys() {
        const k = [];
        for (let i = 0; i < localStorage.length; i++) {
          const ki = localStorage.key(i);
          if (ki && ki.startsWith("sumu_2")) k.push(ki.slice(5));
        }
        return k.sort((a, b) => b.localeCompare(a));
      }

      // ── SUPABASE ──────────────────────────────────
      function setSyncDot(s) {
        document.getElementById("sync-dot").className = "sync-dot " + s;
      }
      async function sbReq(method, path, body) {
        if (!SUPABASE_URL || !SUPABASE_KEY) return null;
        try {
          const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
            method,
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              "Content-Type": "application/json",
              Prefer:
                method === "POST"
                  ? "resolution=merge-duplicates,return=minimal"
                  : "return=minimal",
            },
            body: body ? JSON.stringify(body) : undefined,
          });
          const t = await r.text();
          return t ? JSON.parse(t) : [];
        } catch (e) {
          return null;
        }
      }
      async function sbSave(key, data) {
        setSyncDot("syncing");
        const r = await sbReq("POST", TABLE, {
          day_key: key,
          prayers: data.prayers,
          habits: data.habits,
          tasks: data.tasks,
          reflection: data.reflection,
          sleep_id: data.sleepId,
          mode: data.mode,
          updated_at: new Date().toISOString(),
        });
        setSyncDot(r !== null ? "synced" : "error");
      }
      async function sbLoad(key) {
        const r = await sbReq("GET", `${TABLE}?day_key=eq.${key}&select=*`);
        if (r && r.length > 0)
          return {
            prayers: r[0].prayers || Array(5).fill(false),
            habits: r[0].habits || Array(6).fill(false),
            tasks: r[0].tasks || [],
            reflection: r[0].reflection || {},
            sleepId: r[0].sleep_id || null,
            mode: r[0].mode || "normal",
          };
        return null;
      }
      async function sbLoadAll() {
        return (
          (await sbReq("GET", `${TABLE}?select=*&order=day_key.desc`)) || []
        );
      }
      async function loadDay(key) {
        if (syncEnabled) {
          setSyncDot("syncing");
          const remote = await sbLoad(key);
          setSyncDot("synced");
          if (remote) {
            localSave(key, remote);
            return remote;
          }
        }
        return localLoad(key);
      }
      async function saveData(key, data) {
        localSave(key, data);
        if (syncEnabled) await sbSave(key, data);
      }
      function saveSupabaseConfig() {
        const url = document.getElementById("sb-url").value.trim();
        const key = document.getElementById("sb-key").value.trim();
        if (!url || !key) {
          showToast("⚠️ Enter both URL and key");
          return;
        }
        SUPABASE_URL = url;
        SUPABASE_KEY = key;
        localStorage.setItem("sb_url", url);
        localStorage.setItem("sb_key", key);
        syncEnabled = true;
        document.getElementById("setup-banner").classList.remove("visible");
        showToast("✅ Supabase connected!");
        sbReq("GET", `${TABLE}?select=day_key&limit=1`).then((r) =>
          setSyncDot(r !== null ? "synced" : "error"),
        );
      }

      // ── RENDER HELPERS ────────────────────────────
      function renderSleepSelector(data, readonly) {
        const container = document.getElementById("sleep-buttons");
        const info = document.getElementById("sleep-info");
        container.innerHTML = "";
        SLEEP_OPTS.forEach((opt) => {
          const isActive = data.sleepId === opt.id;
          const btn = document.createElement("button");
          btn.className = `sleep-btn${opt.type === "period" ? " period" : ""}${opt.type === "entertain" ? " entertain" : ""}${isActive ? " active" : ""}`;
          btn.innerHTML = `<div style="font-weight:500">${opt.label}</div><div style="font-size:0.58rem;opacity:0.7;margin-top:1px">${opt.sub}</div>`;
          if (!readonly) btn.onclick = () => selectSleep(opt.id, data);
          container.appendChild(btn);
        });
        const sel = SLEEP_OPTS.find((o) => o.id === data.sleepId);
        info.textContent = sel
          ? sel.type === "period"
            ? "🌸 Period mode — full routine, no prayers"
            : sel.type === "entertain"
              ? "🎉 Enjoy day — 5 prayers + 10 GitHub commits + 30min study"
              : `Routine ${sel.key}: Slept ${sel.label} → Wake ${sel.wakeH != null ? fmt12(sel.wakeH, 0) : ""} → 7h sleep`
          : "Select your sleep time — full day schedule auto-generates";
      }

      async function selectSleep(sleepId, data) {
        data.sleepId = sleepId;
        const opt = SLEEP_OPTS.find((o) => o.id === sleepId);
        data.mode = opt?.type || "normal";
        data.tasks = [];
        await saveData(viewingKey, data);
        render();
        showToast(`✅ ${opt?.label || "Routine"} selected!`);
      }

      function renderNamajCard(pTimes) {
        const row = document.getElementById("namaj-row");
        const now = new Date();
        const nowA = toAbs(now.getHours(), now.getMinutes());
        const prayers = [
          { name: "Fajr", emoji: "🌅", a: toAbs(pTimes.fajr.h, pTimes.fajr.m) },
          {
            name: "Dhuhr",
            emoji: "☀️",
            a: toAbs(pTimes.dhuhr.h, pTimes.dhuhr.m),
          },
          { name: "Asr", emoji: "🌤️", a: toAbs(pTimes.asr.h, pTimes.asr.m) },
          {
            name: "Maghrib",
            emoji: "🌇",
            a: toAbs(pTimes.maghrib.h, pTimes.maghrib.m),
          },
          { name: "Isha", emoji: "🌙", a: toAbs(pTimes.isha.h, pTimes.isha.m) },
        ];
        let currentIdx = -1;
        for (let i = prayers.length - 1; i >= 0; i--) {
          if (nowA >= prayers[i].a) {
            currentIdx = i;
            break;
          }
        }
        row.innerHTML = prayers
          .map((p, i) => {
            const isCurr = viewingKey === todayKey && i === currentIdx;
            const isPast = viewingKey === todayKey && nowA > p.a + 15;
            return `<div class="namaj-item${isCurr ? " current" : ""}${isPast && !isCurr ? " passed" : ""}">
      <div class="namaj-emoji">${p.emoji}</div>
      <div class="namaj-name">${p.name}</div>
      <div class="namaj-time">${fmtA(p.a)}</div>
    </div>`;
          })
          .join("");
        document.getElementById("namaj-date-lbl").textContent =
          viewingKey === todayKey ? "Today" : formatKeyShort(viewingKey);
      }

      function renderPrayers(data, pTimes, readonly) {
        const grid = document.getElementById("prayer-grid");
        grid.innerHTML = "";
        const ptArr = [
          pTimes.fajr,
          pTimes.dhuhr,
          pTimes.asr,
          pTimes.maghrib,
          pTimes.isha,
        ];
        PRAYER_NAMES.forEach((p, i) => {
          const el = document.createElement("div");
          el.className = "prayer-card" + (data.prayers[i] ? " checked" : "");
          el.innerHTML = `<span class="prayer-emoji">${p.emoji}</span><div class="prayer-name">${p.name}</div><div class="prayer-time">${fmt12(ptArr[i].h, ptArr[i].m)}</div>`;
          if (!readonly) el.onclick = () => togglePrayer(i);
          grid.appendChild(el);
        });
        const done = data.prayers.filter(Boolean).length;
        const b = document.getElementById("prayer-badge");
        b.textContent = `${done} / 5`;
        b.className = "sec-badge" + (done === 5 ? " done" : "");
      }

      function renderHabits(data, readonly) {
        const grid = document.getElementById("habit-grid");
        grid.innerHTML = "";
        HABITS.forEach((h, i) => {
          const el = document.createElement("div");
          el.className = "habit-card" + (data.habits[i] ? " checked" : "");
          el.innerHTML = `<div class="habit-check">${data.habits[i] ? "✓" : ""}</div><div><div class="habit-name">${h.name}</div><div class="habit-goal">${h.goal}</div></div>`;
          if (!readonly) el.onclick = () => toggleHabit(i);
          grid.appendChild(el);
        });
        const done = data.habits.filter(Boolean).length;
        const b = document.getElementById("habit-badge");
        b.textContent = `${done} / 6`;
        b.className = "sec-badge" + (done === 6 ? " done" : "");
      }

      function renderTimeline(data, pTimes, readonly) {
        const tl = document.getElementById("timeline");
        const badge = document.getElementById("task-badge");
        const opt = SLEEP_OPTS.find((o) => o.id === data.sleepId);
        if (!opt) {
          tl.innerHTML =
            '<div style="text-align:center;padding:20px;color:var(--text3);font-size:0.75rem">Select your sleep time above 👆</div>';
          badge.textContent = "—";
          badge.className = "sec-badge";
          return 0;
        }
        let schedule;
        let modeBannerHTML = "";
        if (opt.type === "period") {
          const yData = localLoad(getDateKey(new Date(Date.now() - 86400000)));
          const bKey =
            yData.sleepId && !["period", "entertain"].includes(yData.sleepId)
              ? SLEEP_OPTS.find((o) => o.id === yData.sleepId)?.key || "C"
              : "C";
          schedule = buildRoutine(bKey, pTimes, true);
          modeBannerHTML = `<div class="mode-banner period"><div class="mode-banner-title">🌸 Period Mode — Full routine, no prayers</div><div class="mode-banner-sub">Your body is working hard — keep going, rest when needed.</div></div>`;
        } else if (opt.type === "entertain") {
          schedule = buildEnjoyRoutine(pTimes);
          modeBannerHTML = `<div class="mode-banner entertain"><div class="mode-banner-title">🎉 Enjoy Day — 5 Prayers + 10 GitHub Commits + 30min Study</div><div class="mode-banner-sub">Recharging is productive — enjoy fully!</div></div>`;
        } else {
          schedule = buildRoutine(opt.key, pTimes, false);
        }
        while (data.tasks.length < schedule.length) data.tasks.push(false);
        const isToday = viewingKey === todayKey;
        const activeIdx = isToday ? getActiveIdx(schedule) : -1;
        tl.innerHTML = modeBannerHTML;
        schedule.forEach((s, i) => {
          const done = data.tasks[i];
          const isActive = isToday && i === activeIdx && !done;
          const el = document.createElement("div");
          el.className = `tl-item${done ? " done" : ""}${isActive ? " active-now" : ""}${s.isNamaj ? " is-prayer" : ""}`;
          el.innerHTML = `
      <div class="tl-time">${fmt12(s.timeH, s.timeM)}</div>
      <div class="tl-dot-wrap"><div class="tl-dot"></div></div>
      <div class="tl-body">
        <div class="tl-header">
          <span class="tl-task">${s.task}</span>
          <div class="tl-right">
            <span class="tl-cat cat-${s.cat}">${s.cat}</span>
            <span class="tl-priority ${s.priority}"></span>
            <div class="tl-check">${done ? "✓" : "○"}</div>
          </div>
        </div>
        ${s.note ? `<div class="tl-note">${s.note}</div>` : ""}
      </div>`;
          if (!readonly) el.onclick = () => toggleTask(i, schedule.length);
          tl.appendChild(el);
        });
        const done = data.tasks
          .slice(0, schedule.length)
          .filter(Boolean).length;
        badge.textContent = `${done} / ${schedule.length}`;
        badge.className =
          "sec-badge" + (done === schedule.length ? " done" : "");
        return schedule.length;
      }

      function renderProgress(data, totalTasks) {
        const pDone = data.prayers.filter(Boolean).length;
        const hDone = data.habits.filter(Boolean).length;
        const tLen = Math.max(totalTasks || 1, 1);
        const tDone = data.tasks.slice(0, tLen).filter(Boolean).length;
        const pct = Math.round(
          ((pDone + hDone + tDone) / (5 + 6 + tLen)) * 100,
        );
        const circ = 207.3;
        document.getElementById("main-ring").style.strokeDashoffset =
          circ - (pct / 100) * circ;
        document.getElementById("main-ring-pct").textContent = pct + "%";
        document.getElementById("overall-badge").textContent = pct + "%";
        document.getElementById("bar-p").style.width = (pDone / 5) * 100 + "%";
        document.getElementById("bar-t").style.width =
          (tDone / tLen) * 100 + "%";
        document.getElementById("bar-h").style.width = (hDone / 6) * 100 + "%";
        document.getElementById("val-p").textContent = `${pDone}/5`;
        document.getElementById("val-t").textContent = `${tDone}/${tLen}`;
        document.getElementById("val-h").textContent = `${hDone}/6`;
      }

      // ── MAIN RENDER ───────────────────────────────
      async function render() {
        const isToday = viewingKey === todayKey,
          isPast = viewingKey < todayKey;
        const data = await loadDay(viewingKey);
        const pTimes = await fetchPrayerTimes(viewingKey);
        const d = new Date(viewingKey + "T00:00:00");
        const dayNum = Math.floor(d / 86400000);

        // Auto-carry yesterday's sleep
        if (isToday && !data.sleepId) {
          const yKey = getDateKey(new Date(Date.now() - 86400000));
          const yData = localLoad(yKey);
          if (
            yData.sleepId &&
            !["period", "entertain"].includes(yData.sleepId)
          ) {
            data.sleepId = yData.sleepId;
            data.mode = yData.mode || "normal";
            localSave(viewingKey, data);
          }
        }

        document.getElementById("hero-date").textContent = isToday
          ? d.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })
          : formatKey(viewingKey);
        const q = QUOTES[dayNum % QUOTES.length];
        document.getElementById("quote-text").textContent = q.t;
        document.getElementById("quote-author").textContent = q.a;
        document.getElementById("daily-quote").textContent = q.t;

        const h = new Date().getHours();
        const FA2 = pTimes.fajr.h,
          DA2 = pTimes.dhuhr.h,
          AA2 = pTimes.asr.h,
          MA2 = pTimes.maghrib.h,
          IA2 = pTimes.isha.h;
        let period =
          data.mode === "period"
            ? "period"
            : data.mode === "entertain"
              ? "entertain"
              : h >= FA2 && h < FA2 + 2
                ? "fajr"
                : h >= FA2 + 2 && h < DA2
                  ? "morning"
                  : h >= DA2 && h < AA2
                    ? "mid"
                    : h >= AA2 && h < MA2
                      ? "asr"
                      : h >= MA2 && h < IA2
                        ? "maghrib"
                        : "night";
        const msgs = COACH[period] || COACH.morning;
        document.getElementById("coach-msg").textContent =
          msgs[dayNum % msgs.length];

        document.getElementById("date-label").textContent = isToday
          ? "Today"
          : formatKeyShort(viewingKey);
        document.getElementById("btn-next").disabled = isToday;

        const banner = document.getElementById("past-banner");
        const saveBtn = document.getElementById("save-btn");
        if (isPast) {
          banner.classList.add("visible");
          document.getElementById("past-date-label").textContent =
            formatKey(viewingKey);
          saveBtn.disabled = true;
          document.querySelectorAll(".ref-input").forEach((el) => {
            el.readOnly = true;
          });
        } else {
          banner.classList.remove("visible");
          saveBtn.disabled = false;
          document.querySelectorAll(".ref-input").forEach((el) => {
            el.readOnly = false;
          });
        }

        renderNamajCard(pTimes);
        renderSleepSelector(data, isPast);
        renderPrayers(data, pTimes, isPast);
        renderHabits(data, isPast);
        const totalTasks = renderTimeline(data, pTimes, isPast);
        renderProgress(data, totalTasks);

        document.getElementById("ref-win").value = data.reflection.win || "";
        document.getElementById("ref-improve").value =
          data.reflection.improve || "";
        document.getElementById("ref-gratitude").value =
          data.reflection.gratitude || "";
      }

      // ── TOGGLES ───────────────────────────────────
      async function togglePrayer(i) {
        const data = localLoad(viewingKey);
        data.prayers[i] = !data.prayers[i];
        await saveData(viewingKey, data);
        const pt = await fetchPrayerTimes(viewingKey);
        renderPrayers(data, pt, false);
        renderProgress(data, data.tasks.length || 1);
        showToast(
          data.prayers[i]
            ? `🕌 ${PRAYER_NAMES[i].name} — Alhamdulillah ✨`
            : `${PRAYER_NAMES[i].name} unchecked`,
        );
      }
      async function toggleHabit(i) {
        const data = localLoad(viewingKey);
        data.habits[i] = !data.habits[i];
        await saveData(viewingKey, data);
        renderHabits(data, false);
        renderProgress(data, data.tasks.length || 1);
        showToast(
          data.habits[i]
            ? `${HABITS[i].name} — Done! 💚`
            : `${HABITS[i].name} unchecked`,
        );
      }
      async function toggleTask(i, totalTasks) {
        const data = localLoad(viewingKey);
        while (data.tasks.length <= i) data.tasks.push(false);
        data.tasks[i] = !data.tasks[i];
        await saveData(viewingKey, data);
        const pt = await fetchPrayerTimes(viewingKey);
        renderTimeline(data, pt, false);
        renderProgress(data, totalTasks);
      }
      async function saveDay() {
        const data = localLoad(viewingKey);
        data.reflection.win = document.getElementById("ref-win").value;
        data.reflection.improve = document.getElementById("ref-improve").value;
        data.reflection.gratitude =
          document.getElementById("ref-gratitude").value;
        await saveData(viewingKey, data);
        showToast("✦ Day saved — keep going, Sumu!");
      }

      // ── NAV ───────────────────────────────────────
      function changeDay(dir) {
        const d = new Date(viewingKey + "T00:00:00");
        d.setDate(d.getDate() + dir);
        const nk = getDateKey(d);
        if (nk > todayKey) return;
        viewingKey = nk;
        render();
      }
      function switchView(view, btn) {
        document
          .querySelectorAll(".view")
          .forEach((v) => v.classList.remove("active"));
        document
          .querySelectorAll(".nav-tab")
          .forEach((t) => t.classList.remove("active"));
        document.getElementById(`view-${view}`).classList.add("active");
        if (btn) btn.classList.add("active");
        if (view === "history") renderHistory();
        if (view === "stats") renderStats();
      }

      // ── HISTORY ───────────────────────────────────
      async function renderHistory() {
        const list = document.getElementById("history-list");
        list.innerHTML = '<div class="empty-state">Loading...</div>';
        if (syncEnabled) {
          const remote = await sbLoadAll();
          remote.forEach((r) =>
            localSave(r.day_key, {
              prayers: r.prayers || Array(5).fill(false),
              habits: r.habits || Array(6).fill(false),
              tasks: r.tasks || [],
              reflection: r.reflection || {},
              sleepId: r.sleep_id || null,
              mode: r.mode || "normal",
            }),
          );
        }
        const keys = localAllKeys();
        if (!keys.length) {
          list.innerHTML =
            '<div class="empty-state">No days logged yet.<br>Start today ✨</div>';
          return;
        }
        list.innerHTML = "";
        keys.forEach((key) => {
          const data = localLoad(key);
          const p = data.prayers.filter(Boolean).length,
            h = data.habits.filter(Boolean).length,
            t = data.tasks.filter(Boolean).length;
          const tLen = Math.max(data.tasks.length, 1);
          const pct = Math.round(((p + h + t) / (5 + 6 + tLen)) * 100);
          const opt = SLEEP_OPTS.find((o) => o.id === data.sleepId);
          const modeLabel =
            data.mode === "period"
              ? "Period"
              : data.mode === "entertain"
                ? "Enjoy"
                : opt
                  ? `Routine ${opt.key}`
                  : "";
          const card = document.createElement("div");
          card.className = "hcard";
          card.innerHTML = `<div class="hcard-header"><div class="hcard-date">${formatKey(key)}</div><div style="display:flex;align-items:center;gap:8px">${modeLabel ? `<span style="font-size:0.6rem;padding:2px 8px;border-radius:10px;background:var(--gold-dim);color:var(--gold)">${modeLabel}</span>` : ""}<div class="hcard-score">${pct}%</div></div></div>
      <div class="hbar-row"><span class="hbar-lbl">🕌 Prayers</span><div class="hbar-track"><div class="hbar-fill" style="width:${(p / 5) * 100}%;background:var(--gold)"></div></div><span class="hbar-val">${p}/5</span></div>
      <div class="hbar-row"><span class="hbar-lbl">✅ Habits</span><div class="hbar-track"><div class="hbar-fill" style="width:${(h / 6) * 100}%;background:var(--green)"></div></div><span class="hbar-val">${h}/6</span></div>
      <div class="hbar-row"><span class="hbar-lbl">🗓️ Tasks</span><div class="hbar-track"><div class="hbar-fill" style="width:${(t / tLen) * 100}%;background:var(--purple)"></div></div><span class="hbar-val">${t}/${tLen}</span></div>
      ${data.reflection?.win ? `<div class="hcard-win">🏆 "${data.reflection.win}"</div>` : ""}`;
          card.onclick = () => {
            viewingKey = key;
            switchView("today", document.getElementById("tab-today"));
            render();
          };
          list.appendChild(card);
        });
      }

      // ── STATS ─────────────────────────────────────
      function renderStats() {
        const keys = localAllKeys();
        let totalP = 0,
          totalH = 0,
          totalT = 0,
          totalPct = 0,
          bestPct = 0;
        keys.forEach((k) => {
          const d = localLoad(k);
          const p = d.prayers.filter(Boolean).length,
            h = d.habits.filter(Boolean).length,
            t = d.tasks.filter(Boolean).length;
          const tLen = Math.max(d.tasks.length, 1);
          const pct = Math.round(((p + h + t) / (5 + 6 + tLen)) * 100);
          totalP += p;
          totalH += h;
          totalT += t;
          totalPct += pct;
          if (pct > bestPct) bestPct = pct;
        });
        let streak = 0;
        const dd = new Date();
        while (true) {
          const k = getDateKey(dd);
          if (!localStorage.getItem(`sumu_${k}`)) break;
          streak++;
          dd.setDate(dd.getDate() - 1);
        }
        const n = keys.length || 1;
        document.getElementById("stat-streak").textContent = streak;
        document.getElementById("s-days").textContent = keys.length;
        document.getElementById("s-avg").textContent =
          Math.round(totalPct / n) + "%";
        document.getElementById("s-prayers").textContent = totalP;
        document.getElementById("s-habits").textContent = totalH;
        document.getElementById("s-best").textContent = bestPct + "%";
        document.getElementById("s-tasks").textContent = totalT;
        renderChart();
      }
      function renderChart() {
        const bEl = document.getElementById("chart-bars"),
          lEl = document.getElementById("chart-labels");
        bEl.innerHTML = "";
        lEl.innerHTML = "";
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const k = getDateKey(d);
          const data = localLoad(k);
          const p = data.prayers.filter(Boolean).length,
            h = data.habits.filter(Boolean).length,
            t = data.tasks.filter(Boolean).length;
          const tLen = Math.max(data.tasks.length, 1);
          const pct = Math.round(((p + h + t) / (5 + 6 + tLen)) * 100);
          const dayName = d
            .toLocaleDateString("en-US", { weekday: "short" })
            .slice(0, 3);
          const isToday = i === 0;
          const wrap = document.createElement("div");
          wrap.className = "chart-bwrap";
          wrap.innerHTML = `${pct > 0 ? `<div class="chart-pct">${pct}%</div>` : `<div class="chart-pct" style="opacity:0">0</div>`}<div class="chart-b${isToday ? " today" : ""}" style="height:${Math.max(pct, 2)}%"></div>`;
          bEl.appendChild(wrap);
          const lbl = document.createElement("div");
          lbl.className = "chart-day" + (isToday ? " today" : "");
          lbl.textContent = dayName;
          lEl.appendChild(lbl);
        }
      }

      // ── THEME + TOAST + INIT ─────────────────────
      function toggleTheme() {
        const html = document.documentElement,
          isDark = html.getAttribute("data-theme") === "dark";
        html.setAttribute("data-theme", isDark ? "light" : "dark");
        document.getElementById("theme-btn").textContent = isDark ? "☀️" : "🌙";
        localStorage.setItem("theme", isDark ? "light" : "dark");
      }
      let toastTimer;
      function showToast(msg) {
        const t = document.getElementById("toast");
        t.textContent = msg;
        t.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
      }
      async function init() {
        const savedTheme = localStorage.getItem("theme") || "dark";
        document.documentElement.setAttribute("data-theme", savedTheme);
        document.getElementById("theme-btn").textContent =
          savedTheme === "dark" ? "🌙" : "☀️";
        document.getElementById("loading-sub").textContent =
          "Loading prayer times...";
        await fetchPrayerTimes(todayKey);
        if (syncEnabled) {
          setSyncDot("syncing");
          document.getElementById("loading-sub").textContent = "Syncing...";
          const r = await sbReq("GET", `${TABLE}?select=day_key&limit=1`);
          setSyncDot(r !== null ? "synced" : "error");
          if (r === null) syncEnabled = false;
        } else {
          document.getElementById("setup-banner").classList.add("visible");
          setSyncDot("error");
        }
        document.getElementById("loading-sub").textContent = "Almost ready...";
        await render();
        document.getElementById("loading").classList.add("hidden");
        setTimeout(
          () => (document.getElementById("loading").style.display = "none"),
          500,
        );
      }
      init();