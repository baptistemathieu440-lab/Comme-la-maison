import { StaffTaskCard } from "@/components/app/StaffTaskCard";
import { EmptyState, PageHeader } from "@/components/app/ui";
import { staffContext } from "@/lib/auth/admin-context";
import { addDays, formatWeekday, todayIso } from "@/lib/dates";

export const metadata = { title: "Aujourd’hui" };

export default async function StaffToday() {
  const { supabase, session } = await staffContext();
  const today = todayIso();
  const [{ data: todayTasks }, { data: late }, { data: tomorrow }] = await Promise.all([
    supabase.from("staff_tasks").select("*").eq("due_date", today).order("window_start", { nullsFirst: false }),
    supabase.from("staff_tasks").select("*").lt("due_date", today).in("status", ["todo", "in_progress"]).order("due_date"),
    supabase.from("staff_tasks").select("*").eq("due_date", addDays(today, 1)).order("window_start", { nullsFirst: false }),
  ]);
  const firstName = session.fullName.split(" ")[0];

  return (
    <>
      <PageHeader eyebrow={formatWeekday(today)} title={firstName ? `Bonjour ${firstName}` : "Aujourd’hui"} description="Vos tâches du jour. Touchez une tâche pour l’ouvrir." />
      {(late ?? []).length ? (
        <section aria-labelledby="retard" className="flex flex-col gap-3">
          <h2 id="retard" className="font-semibold text-terra-text">En retard ({late?.length})</h2>
          {(late ?? []).map((task) => (
            <StaffTaskCard key={task.id} task={task} showDate />
          ))}
        </section>
      ) : null}
      <section aria-labelledby="jour" className="flex flex-col gap-3">
        <h2 id="jour" className="font-semibold text-maison">Aujourd’hui ({todayTasks?.length ?? 0})</h2>
        {(todayTasks ?? []).length === 0 ? (
          <EmptyState title="Aucune tâche aujourd’hui." />
        ) : (
          (todayTasks ?? []).map((task) => <StaffTaskCard key={task.id} task={task} />)
        )}
      </section>
      <section aria-labelledby="demain" className="flex flex-col gap-3">
        <h2 id="demain" className="font-semibold text-maison">Demain ({tomorrow?.length ?? 0})</h2>
        {(tomorrow ?? []).length === 0 ? (
          <p className="text-small text-ink-soft">Rien de prévu pour demain.</p>
        ) : (
          (tomorrow ?? []).map((task) => <StaffTaskCard key={task.id} task={task} />)
        )}
      </section>
    </>
  );
}
