import { improveResume } from "./improveResume.js";
import { reviewCode } from "./reviewCode.js";
import { summarizeText } from "./summarizeText.js";
import { summarizeTicket } from "./summarizeTicket.js";
import { translateToNepali } from "./translateToNepali.js";
import type { TaskHandler, TaskMode } from "../types.js";

export const handlers: Record<TaskMode, TaskHandler> = {
  ticket: summarizeTicket,
  resume: improveResume,
  review: reviewCode,
  translate: translateToNepali,
  summary: summarizeText,
};
