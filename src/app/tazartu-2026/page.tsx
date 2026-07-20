import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

const PLANNED_SECTIONS = [
  "План на 2026 год и факт выполнения",
  "Сколько персонала задействовано в программе",
  "Детализация выполнения с разбивкой по ДЭСД",
  "Динамика закрытых нарядов",
  "Диаграмма план/факт",
  "Отток абонентов",
  "План с детализацией переключений абонентов (фильтры: год, месяц, день, тип переключения)",
];

export default function Tazartu2026Page() {
  return (
    <div>
      <PageHeader title="Тазарту 2026" subtitle="Программа миграции абонентов на 2026 год — план/факт, персонал, наряды, отток и переключения." />

      <Card>
        <p className="text-[13.5px] text-muted mb-4">Раздел в разработке — сюда постепенно добавятся:</p>
        <ul className="flex flex-col gap-2">
          {PLANNED_SECTIONS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[13.5px]">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
