import { REGIONS, LAGGING_REGIONS, OVERALL_PCT, TOTAL_REMAINING, TOTAL_CLIENTS } from "@/lib/data/regions";
import { MATERIALS_WITH_STATUS } from "@/lib/data/materials";
import { RISKS } from "@/lib/data/project";
import { STOP_REASONS } from "@/lib/data/orders";
import { formatNumber, formatPercent } from "@/lib/utils";

function findRegion(text: string) {
  const t = text.toLowerCase();
  return REGIONS.find((r) => t.includes(r.name.toLowerCase()) || t.includes(r.id) || (r.id === "mangistau" && t.includes("актау")));
}

export const SUGGESTED_PROMPTS = [
  "Сколько осталось клиентов в Алматы?",
  "Почему отстаёт Актау?",
  "Покажи все проблемные филиалы",
  "Какие материалы заканчиваются?",
  "Когда закончится проект?",
  "Почему выросли отказы?",
  "Покажи прогноз",
];

export function answerQuestion(question: string): string {
  const q = question.toLowerCase();

  const region = findRegion(q);

  if (q.includes("осталось") && (q.includes("клиент") || q.includes("абонент"))) {
    if (region) {
      const remaining = region.clientsTotal - region.migrated;
      return `В филиале «${region.name}» осталось перевести ${formatNumber(remaining)} абонентов из ${formatNumber(region.clientsTotal)} (переведено ${formatPercent(region.factPctToday)}). При текущем темпе ${formatNumber(region.tempoPerMonth)} в месяц это ≈ ${Math.ceil(remaining / region.tempoPerMonth)} мес.`;
    }
    return `По всей программе осталось перевести ${formatNumber(TOTAL_REMAINING)} абонентов из ${formatNumber(TOTAL_CLIENTS)} (выполнено ${formatPercent(OVERALL_PCT)}).`;
  }

  if (q.includes("отстаёт") || q.includes("отстает") || (q.includes("почему") && region)) {
    if (region) {
      const gap = region.factPctToday - region.planPctToday;
      const relatedRisks = RISKS.filter((r) => r.regionId === region.id);
      const riskText = relatedRisks.length
        ? ` Основные риски: ${relatedRisks.map((r) => r.title.toLowerCase()).join("; ")}.`
        : "";
      if (gap < 0) {
        return `Филиал «${region.name}» отстаёт от плана на ${Math.abs(gap).toFixed(1)} п.п. (факт ${formatPercent(region.factPctToday)} vs план ${formatPercent(region.planPctToday)}). Темп монтажа — ${formatNumber(region.tempoPerMonth)} переключений/мес.${riskText}`;
      }
      return `Филиал «${region.name}» опережает план на ${gap.toFixed(1)} п.п. (факт ${formatPercent(region.factPctToday)} vs план ${formatPercent(region.planPctToday)}).`;
    }
  }

  if (q.includes("проблемн") && q.includes("филиал")) {
    return `Наиболее проблемные филиалы по отставанию от плана: ${LAGGING_REGIONS.map(
      (r) => `${r.name} (факт ${formatPercent(r.factPctToday)} vs план ${formatPercent(r.planPctToday)})`,
    ).join("; ")}.`;
  }

  if (q.includes("материал") && (q.includes("заканч") || q.includes("критич") || q.includes("дефицит"))) {
    const critical = MATERIALS_WITH_STATUS.filter((m) => m.status !== "ok").sort((a, b) => a.daysOfSupply - b.daysOfSupply);
    if (!critical.length) return "Критических позиций по запасам материалов сейчас нет.";
    return `Заканчиваются: ${critical
      .slice(0, 5)
      .map((m) => `${m.name} — ${m.daysOfSupply} дн. запаса`)
      .join("; ")}.`;
  }

  if (q.includes("когда закончится") || q.includes("срок заверш") || q.includes("завершение проект")) {
    return `Плановое завершение программы «Тазарту» — Q4 2028 (100% перевода абонентов и демонтажа медной сети). Текущий прогресс — ${formatPercent(OVERALL_PCT)}, контрольная точка 50% — Q2 2026.`;
  }

  if (q.includes("отказ")) {
    const refuse = STOP_REASONS.find((s) => s.reason.toLowerCase().includes("отказ"));
    return `Причина «Отказ абонента» — ${refuse?.count ?? 0} остановленных заказов. Основной фактор — недовольство необходимостью установки оборудования/бокса и сроками ожидания монтажа. Рекомендация: усилить работу клиентского сервиса в отстающих филиалах.`;
  }

  if (q.includes("прогноз")) {
    return `AI-прогноз: при сохранении текущего темпа общий прогресс достигнет 100% к концу 2028 года, с риском смещения в Мангистау на 2-3 месяца при текущей нехватке бригад и материалов.`;
  }

  return `Не нашёл точного ответа на этот вопрос в демо-данных. Попробуйте спросить о конкретном филиале, материалах, сроках или проблемных зонах — например: «${SUGGESTED_PROMPTS[Math.floor(Math.random() * SUGGESTED_PROMPTS.length)]}»`;
}
