import Link from "next/link";
import { Clock, MapPin, Users } from "lucide-react";

import { formatDayMonth, formatTime } from "@/lib/dates";
import { labelOf, taskStatus, taskType, textOf } from "@/lib/labels";

import { DemoBadge, StatusBadge } from "./ui";

export type StaffTask = {
  id: string | null;
  type: string | null;
  status: string | null;
  property_name: string | null;
  address_line: string | null;
  city: string | null;
  due_date: string | null;
  window_start: string | null;
  window_end: string | null;
  checklist: unknown;
  booking_adults: number | null;
  booking_children: number | null;
  next_check_in: string | null;
  is_demo: boolean | null;
};

/** Carte d'une tâche pour l'agent : lisible d'un coup d'œil sur téléphone. */
export function StaffTaskCard({ task, showDate = false }: { task: StaffTask; showDate?: boolean }) {
  const checklist = (Array.isArray(task.checklist) ? task.checklist : []) as Array<{ done: boolean }>;
  const done = checklist.filter((item) => item.done).length;
  return (
    <Link
      href={`/staff/taches/${task.id}`}
      className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-line bg-surface p-4 shadow-soft hover:border-maison/40"
    >
      <span className="flex flex-wrap items-start justify-between gap-2">
        <span className="font-display text-[1.25rem] font-medium leading-tight text-maison [font-stretch:92%]">
          {textOf(taskType, task.type)} · {task.property_name}
        </span>
        <StatusBadge value={labelOf(taskStatus, task.status)} />
      </span>
      <span className="flex items-center gap-2 text-[0.9375rem] text-ink">
        <MapPin aria-hidden="true" className="size-4 shrink-0 text-ink-soft" />
        {[task.address_line, task.city].filter(Boolean).join(", ") || "Adresse à demander"}
      </span>
      <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <Clock aria-hidden="true" className="size-4" />
          {showDate ? `${formatDayMonth(task.due_date)} · ` : ""}
          {task.window_start ? `${formatTime(task.window_start)} → ${formatTime(task.window_end)}` : "Horaire libre"}
        </span>
        {task.booking_adults !== null ? (
          <span className="inline-flex items-center gap-1.5">
            <Users aria-hidden="true" className="size-4" />
            {(task.booking_adults ?? 0) + (task.booking_children ?? 0)} voyageur(s)
          </span>
        ) : null}
        {task.next_check_in ? <span>Prochaine arrivée : {formatDayMonth(task.next_check_in)}</span> : null}
        {checklist.length ? <span>Liste : {done}/{checklist.length}</span> : null}
        {task.is_demo ? <DemoBadge /> : null}
      </span>
    </Link>
  );
}
