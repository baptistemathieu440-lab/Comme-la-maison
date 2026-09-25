import { StaffTaskCard } from "@/components/app/StaffTaskCard";
import { EmptyState, PageHeader } from "@/components/app/ui";
import { staffContext } from "@/lib/auth/admin-context";
import { addDays, formatWeekday, todayIso } from "@/lib/dates";

export const metadata = { title: "Planning" };

export default async function StaffPlanning() {
  const { supabase } = await staffContext();
  const today = todayIso();
  const [{ data: upcoming }, { data: recent }] = await Promise.all([
    supabase.from("staff_tasks").select("*").gte("due_date", today).lte("due_date", addDays(today, 21)).order("due_date").order("window_start", { nullsFirst: false }),
    supabase.from("staff_tasks").select("*").lt("due_date", today).in("status", ["done", "validated"]).order("due_date", { ascending: false }).limit(10),
  ]);
  const days = [...new Set((upcoming ?? []).map((t) => t.due_date as string))];

  return (
    <>
      <PageHeader title="Planning" description="Vos tâches des trois prochaines semaines." />
      {days.length === 0 ? (
        <EmptyState title="Aucune tâche prévue." />
      ) : (
        days.map((day) => (
          <section key={day} aria-labelledby={`jour-${day}`} className="flex flex-col gap-3">
            <h2 id={`jour-${day}`} className="font-semibold capitalize text-maison">
              {formatWeekday(day)}
            </h2>
            {(upcoming ?? []).filter((t) => t.due_date === day).map((task) => (
              <StaffTaskCard key={task.id} task={task} />
            ))}
          </section>
        ))
      )}
      {(recent ?? []).length ? (
        <section aria-labelledby="recentes" className="flex flex-col gap-3">
          <h2 id="recentes" className="font-semibold text-ink-soft">Récemment terminées</h2>
          {(recent ?? []).map((task) => (
            <StaffTaskCard key={task.id} task={task} showDate />
          ))}
        </section>
      ) : null}
    </>
  );
}
