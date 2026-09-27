# workout-plan

A week of training built from what you actually have: days, minutes, equipment,
level — and your limits. Zero dependencies, one file, tested.

```js
const { plan } = require("workout-plan");

plan({ days: 3, equipment: "dumbbells", level: "middle", minutes: 40, limitations: ["knee"], seed: 7 });
// {
//   sessions: [
//     { day: 1, focus: "legs", minutes: 38, blocks: [
//         { exercise: "squat-bodyweight", name: "Приседания", sets: 4, reps: 12, timed: false, restSeconds: 60 }, … ] },
//     …
//   ],
//   notes: ["Ограничение «knee»: упражнения с нагрузкой на это убраны, замены — Ягодичный мост, Мёртвый жук, Кошка-корова."],
//   totalMinutes: 112
// }
```

## Что здесь настоящего

- **Ограничение — это фильтр, а не галочка.** Со `knee` в план не попадут выпады
  и стульчик у стены, со `back` — румынская тяга и тяга в наклон, с `shoulder` —
  жимы и подтягивания. Тесты проверяют именно это, а не наличие поля в объекте.
- **Каждое убранное упражнение получает замену** из своего же доступного
  инвентаря, и текст замены возвращается в `notes`.
- **Время считается, а не угадывается**: подходы × повторы × 3 секунды плюс
  отдых, и тренировка обязана уложиться в бюджет минут.
- **Уровень меняет объём**: у продвинутого на подход больше, у новичка меньше —
  тест сравнивает суммарные подходы, а не подписи.
- **Йога и пилатес не подсовывают гантели** — инвентарь фильтруется по источнику.
- **Один seed — один план.** `mulberry32`, без `Math.random()`.

## Инвентарь

`calisthenics` · `dumbbells` · `gym` · `yoga` · `pilates`

## Ограничения

`knee` · `back` · `shoulder` · `wrist`

```bash
node --test test/
```

MIT.
