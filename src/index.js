/**
 * workout-plan — недельный план тренировок из того, что у тебя есть.
 *
 * Не «программа из интернета», а план по входным данным: сколько дней, сколько
 * минут, какой инвентарь (калистеника, гантели, зал, йога, пилатес), какой
 * уровень и какие ограничения. Ограничение — это не галочка, а фильтр:
 * с коленом в плане не появится выпад, со спиной — становая, и к каждому
 * убранному упражнению предлагается замена.
 *
 * Zero dependencies. MIT.
 */

// ── Упражнения ────────────────────────────────────────────────────────────────
// secondsPerRep — на сколько секунд считать одно повторение (подход + отдых).
// Противопоказания в avoid: "knee", "back", "shoulder", "wrist".
const EXERCISES = [
  { id: "squat-bodyweight", name: "Приседания", focus: "legs", gear: ["none", "dumbbells", "gym"], level: ["beginner", "middle", "advanced"], sets: 4, reps: 12, timed: false, avoid: [] },
  { id: "squat-goblet", name: "Гоблет-присед с гантелью", focus: "legs", gear: ["dumbbells", "gym"], level: ["middle", "advanced"], sets: 4, reps: 10, timed: false, avoid: [] },
  { id: "lunge-reverse", name: "Обратные выпады", focus: "legs", gear: ["none", "dumbbells", "gym"], level: ["middle", "advanced"], sets: 3, reps: 10, timed: false, avoid: ["knee"] },
  { id: "lunge-split", name: "Выпады на месте", focus: "legs", gear: ["none", "dumbbells"], level: ["beginner", "middle"], sets: 3, reps: 10, timed: false, avoid: ["knee"] },
  { id: "glute-bridge", name: "Ягодичный мост", focus: "legs", gear: ["none", "dumbbells", "gym"], level: ["beginner", "middle", "advanced"], sets: 3, reps: 15, timed: false, avoid: [] },
  { id: "wall-sit", name: "Стульчик у стены", focus: "legs", gear: ["none", "gym"], level: ["beginner", "middle"], sets: 3, reps: 45, timed: true, avoid: ["knee"] },
  { id: "calf-raise", name: "Подъёмы на носки", focus: "legs", gear: ["none", "dumbbells", "gym"], level: ["beginner", "middle", "advanced"], sets: 3, reps: 18, timed: false, avoid: [] },
  { id: "pushup", name: "Отжимания", focus: "push", gear: ["none", "dumbbells", "gym"], level: ["beginner", "middle", "advanced"], sets: 4, reps: 10, timed: false, avoid: ["wrist"] },
  { id: "pushup-incline", name: "Отжимания от опоры", focus: "push", gear: ["none", "gym"], level: ["beginner"], sets: 3, reps: 10, timed: false, avoid: [] },
  { id: "bench-press", name: "Жим гантелей лёжа", focus: "push", gear: ["dumbbells", "gym"], level: ["middle", "advanced"], sets: 4, reps: 10, timed: false, avoid: ["shoulder"] },
  { id: "shoulder-press", name: "Жим гантелей вверх", focus: "push", gear: ["dumbbells", "gym"], level: ["middle", "advanced"], sets: 3, reps: 10, timed: false, avoid: ["shoulder"] },
  { id: "row-dumbbell", name: "Тяга гантели в наклоне", focus: "pull", gear: ["dumbbells", "gym"], level: ["beginner", "middle", "advanced"], sets: 4, reps: 12, timed: false, avoid: ["back"] },
  { id: "row-inverted", name: "Австралийские подтягивания", focus: "pull", gear: ["none", "gym"], level: ["middle", "advanced"], sets: 3, reps: 10, timed: false, avoid: ["shoulder"] },
  { id: "pullup", name: "Подтягивания", focus: "pull", gear: ["gym"], level: ["advanced"], sets: 4, reps: 8, timed: false, avoid: ["shoulder"] },
  { id: "deadlift-rdl", name: "Румынская тяга", focus: "pull", gear: ["dumbbells", "gym"], level: ["middle", "advanced"], sets: 3, reps: 10, timed: false, avoid: ["back"] },
  { id: "plank", name: "Планка", focus: "core", gear: ["none", "dumbbells", "gym"], level: ["beginner", "middle", "advanced"], sets: 3, reps: 45, timed: true, avoid: ["shoulder"] },
  { id: "dead-bug", name: "Мёртвый жук", focus: "core", gear: ["none", "gym"], level: ["beginner", "middle", "advanced"], sets: 3, reps: 12, timed: false, avoid: [] },
  { id: "side-plank", name: "Боковая планка", focus: "core", gear: ["none", "gym"], level: ["middle", "advanced"], sets: 3, reps: 30, timed: true, avoid: ["shoulder"] },
  { id: "bird-dog", name: "Птица-собака", focus: "core", gear: ["none", "gym"], level: ["beginner", "middle"], sets: 3, reps: 12, timed: false, avoid: [] },
  { id: "cat-cow", name: "Кошка-корова", focus: "mobility", gear: ["none", "yoga", "pilates"], level: ["beginner", "middle", "advanced"], sets: 2, reps: 60, timed: true, avoid: [] },
  { id: "downward-dog", name: "Собака мордой вниз", focus: "mobility", gear: ["yoga", "pilates"], level: ["beginner", "middle", "advanced"], sets: 3, reps: 40, timed: true, avoid: ["wrist"] },
  { id: "warrior-two", name: "Воин II", focus: "mobility", gear: ["yoga"], level: ["middle", "advanced"], sets: 2, reps: 45, timed: true, avoid: ["knee"] },
  { id: "hundred", name: "Сотня (Pilates)", focus: "core", gear: ["pilates", "yoga"], level: ["middle", "advanced"], sets: 2, reps: 60, timed: true, avoid: ["back"] },
  { id: "leg-circles", name: "Круги ногой (Pilates)", focus: "core", gear: ["pilates", "yoga"], level: ["beginner", "middle"], sets: 2, reps: 45, timed: true, avoid: ["back"] },
  { id: "bridge-pilates", name: "Мост с поочерёдной ногой", focus: "legs", gear: ["pilates"], level: ["middle", "advanced"], sets: 3, reps: 10, timed: false, avoid: ["back"] },
];

const GEAR = {
  calisthenics: ["none"],
  dumbbells: ["none", "dumbbells"],
  gym: ["none", "dumbbells", "gym"],
  yoga: ["none", "yoga"],
  pilates: ["none", "pilates"],
};

const FOCUS_BY_DAYS = {
  1: ["full"],
  2: ["push", "legs"],
  3: ["legs", "push", "pull"],
  4: ["legs", "push", "pull", "core"],
  5: ["legs", "push", "pull", "core", "mobility"],
  6: ["legs", "push", "pull", "core", "mobility", "full"],
};

function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function repsFor(level, exercise) {
  if (exercise.timed) return Math.round(exercise.reps * (level === "advanced" ? 1.3 : level === "beginner" ? 0.8 : 1));
  return Math.round(exercise.reps * (level === "advanced" ? 1.25 : level === "beginner" ? 0.85 : 1));
}

function setsFor(level, exercise) {
  return level === "advanced" ? exercise.sets + 1 : level === "beginner" ? Math.max(2, exercise.sets - 1) : exercise.sets;
}

function secondsFor(exercise, sets, reps) {
  const perRep = exercise.timed ? reps : reps * 3;
  const rest = 60;
  return sets * perRep + (sets - 1) * rest;
}

/** Сколько времени нужно на список упражнений, в секундах. */
function estimateSeconds(blocks) {
  return blocks.reduce((total, b) => total + secondsFor(b, b.sets, b.reps), 0);
}

const REPLACEMENTS = {
  knee: ["glute-bridge", "dead-bug", "cat-cow"],
  back: ["dead-bug", "bird-dog", "glute-bridge"],
  shoulder: ["dead-bug", "glute-bridge", "calf-raise"],
  wrist: ["dead-bug", "cat-cow", "calf-raise"],
};

/**
 * План на неделю.
 * @returns {{sessions: Array, notes: string[]}}
 */
function plan({ days = 3, equipment = "calisthenics", level = "beginner", minutes = 40, limitations = [], seed = 1 } = {}) {
  if (!Number.isInteger(days) || days < 1 || days > 6) throw new RangeError("days must be an integer from 1 to 6");
  if (!GEAR[equipment]) throw new TypeError(`unknown equipment "${equipment}", expected one of ${Object.keys(GEAR).join(", ")}`);
  if (!["beginner", "middle", "advanced"].includes(level)) throw new TypeError("level must be beginner, middle or advanced");
  if (!Number.isFinite(minutes) || minutes < 10 || minutes > 180) throw new RangeError("minutes must be between 10 and 180");
  for (const limit of limitations) {
    if (!REPLACEMENTS[limit]) throw new TypeError(`unknown limitation "${limit}"`);
  }

  const random = mulberry32(seed);
  const allowedGear = new Set(GEAR[equipment]);
  const notes = [];
  const sessions = [];
  const focusList = FOCUS_BY_DAYS[days];

  const available = (focus) =>
    EXERCISES.filter(
      (e) =>
        e.gear.some((g) => allowedGear.has(g)) &&
        e.level.includes(level) &&
        !e.avoid.some((a) => limitations.includes(a)) &&
        (focus === "full" || focus === "mobility" ? true : e.focus === focus)
    );

  for (let i = 0; i < days; i += 1) {
    const focus = focusList[i];
    const pool = available(focus);
    if (pool.length === 0) continue;

    const budget = minutes * 60;
    const blocks = [];
    let used = 0;
    const shuffled = [...pool].sort(() => random() - 0.5);

    for (const exercise of shuffled) {
      const sets = setsFor(level, exercise);
      const reps = repsFor(level, exercise);
      const need = secondsFor(exercise, sets, reps);
      if (used + need > budget && blocks.length > 0) continue;
      blocks.push({ exercise: exercise.id, name: exercise.name, focus: exercise.focus, sets, reps, timed: exercise.timed, restSeconds: 60 });
      used += need;
      if (blocks.length >= 6) break;
    }

    sessions.push({
      day: i + 1,
      focus,
      minutes: Math.round(used / 60),
      blocks,
    });
  }

  for (const limit of limitations) {
    const swapped = sessions.flatMap((s) => s.blocks).length;
    const safeIds = REPLACEMENTS[limit];
    const safeNames = safeIds
      .map((id) => EXERCISES.find((e) => e.id === id))
      .filter((e) => e && e.gear.some((g) => allowedGear.has(g)))
      .map((e) => e.name);
    if (swapped > 0 && safeNames.length > 0) {
      notes.push(`Ограничение «${limit}»: упражнения с нагрузкой на это убраны, замены — ${safeNames.join(", ")}.`);
    }
  }
  if (notes.length === 0) notes.push("Ограничений нет — план собран целиком.");

  return { sessions, notes, totalMinutes: sessions.reduce((sum, s) => sum + s.minutes, 0) };
}

module.exports = { plan, estimateSeconds, EXERCISES, GEAR, REPLACEMENTS };
