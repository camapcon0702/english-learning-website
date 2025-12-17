import { redirect } from "next/navigation";

export default function VocabularyManagementPage() {
  // Backward-compat route: we replaced this module with MiniGame management
  redirect("/admin/minigame-management");
}