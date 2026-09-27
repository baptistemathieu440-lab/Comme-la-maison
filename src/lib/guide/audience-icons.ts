import { Baby, Heart, PartyPopper, Smile, User, Users, UsersRound, Wine, type LucideIcon } from "lucide-react";

import type { Audience } from "./taxonomy";

export const audienceIcons: Record<Audience, LucideIcon> = {
  solo: User,
  couple: Heart,
  famille: Users,
  enfants: Baby,
  ados: Smile,
  amis: UsersRound,
  fetards: PartyPopper,
  epicuriens: Wine,
};
