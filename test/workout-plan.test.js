const test = require("node:test");
const assert = require("node:assert/strict");
const { plan, EXERCISES, GEAR, REPLACEMENTS } = require("../src/index.js");

test("число тренировок равно запрошенному", () => {
  for (const days of [1, 2, 3, 4, 5, 6]) {
    assert.equal(plan({ days, equipment: "gym", level: "middle", minutes: 40 }).sessions.length, days);
  }
});

test("в плане только упражнения с доступным инвентарём", () => {
  const allowed = new Set(GEAR.calisthenics);
  const { sessions } = plan({ days: 4, equipment: "calisthenics", level: "advanced", minutes: 45 });
  for (const session of sessions) {
    for (const block of session.blocks) {
      const exercise = EXERCISES.find((e) => e.id === block.exercise);
      assert.ok(exercise.gear.some((g) => allowed.has(g)), `${block.name} требует инвентаря, которого нет`);
    }
  }
});

test("тренировка укладывается в отведённые минуты", () => {
  for (const minutes of [20, 30, 45, 60]) {
    const { sessions } = plan({ days: 3, equipment: "gym", level: "middle", minutes });
    for (const session of sessions) {
      assert.ok(session.minutes <= minutes, `${session.minutes} минут при бюджете ${minutes}`);
      assert.ok(session.blocks.length >= 1, "пустая тренировка");
    }
  }
});

test("колено убирает выпады, спина — становую и тягу в наклоне", () => {
  const knee = plan({ days: 4, equipment: "gym", level: "advanced", minutes: 50, limitations: ["knee"] });
  const kneeNames = knee.sessions.flatMap((s) => s.blocks.map((b) => b.name)).join(" ");
  assert.ok(!/Выпады/.test(kneeNames), "выпады не должны попасть в план с коленом");
  assert.ok(!/Стульчик/.test(kneeNames), "стульчик у стены тоже нагрузка на колено");

  const back = plan({ days: 4, equipment: "gym", level: "advanced", minutes: 50, limitations: ["back"] });
  const backNames = back.sessions.flatMap((s) => s.blocks.map((b) => b.name)).join(" ");
  assert.ok(!/Румынская тяга/.test(backNames), "становая не должна попасть в план со спиной");
  assert.ok(!/Тяга гантели/.test(backNames));
});

test("ограничение объясняется и предлагает замену", () => {
  const { notes } = plan({ days: 3, equipment: "dumbbells", level: "middle", minutes: 40, limitations: ["back"] });
  assert.ok(notes.some((n) => /Ограничение «back»/.test(n)));
  assert.ok(notes.some((n) => /замены/.test(n)));
});

test("уровень меняет нагрузку, а не только слова", () => {
  const beginner = plan({ days: 3, equipment: "gym", level: "beginner", minutes: 40 });
  const advanced = plan({ days: 3, equipment: "gym", level: "advanced", minutes: 40 });
  const volume = (p) => p.sessions.flatMap((s) => s.blocks).reduce((sum, b) => sum + b.sets, 0);
  assert.ok(volume(advanced) > volume(beginner), "у продвинутого должно быть больше подходов");
});

test("йога и пилатес не подсовывают гантели", () => {
  for (const equipment of ["yoga", "pilates"]) {
    const { sessions } = plan({ days: 3, equipment, level: "middle", minutes: 40 });
    const names = sessions.flatMap((s) => s.blocks.map((b) => b.name)).join(" ");
    assert.ok(!/гантел/i.test(names), `в ${equipment} не должно быть гантелей: ${names}`);
  }
});

test("один и тот же seed даёт один и тот же план", () => {
  const a = plan({ days: 3, equipment: "dumbbells", level: "middle", minutes: 40, seed: 7 });
  const b = plan({ days: 3, equipment: "dumbbells", level: "middle", minutes: 40, seed: 7 });
  assert.deepEqual(a.sessions, b.sessions);
  const c = plan({ days: 3, equipment: "dumbbells", level: "middle", minutes: 40, seed: 8 });
  assert.notDeepEqual(a.sessions, c.sessions);
});

test("мусор на входе отвергается", () => {
  assert.throws(() => plan({ days: 0 }), RangeError);
  assert.throws(() => plan({ days: 9 }), RangeError);
  assert.throws(() => plan({ equipment: "barbell" }), TypeError);
  assert.throws(() => plan({ level: "pro" }), TypeError);
  assert.throws(() => plan({ minutes: 5 }), RangeError);
  assert.throws(() => plan({ limitations: ["tail"] }), TypeError);
});

test("у каждой замены есть упражнение в каталоге", () => {
  for (const [limit, ids] of Object.entries(REPLACEMENTS)) {
    for (const id of ids) {
      assert.ok(EXERCISES.some((e) => e.id === id), `замена ${id} для «${limit}» не найдена в каталоге`);
    }
  }
});
