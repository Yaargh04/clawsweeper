export type RepositoryItemKind = "issue" | "pull_request";
export type RepositoryCloseReason =
  | "implemented_on_main"
  | "cannot_reproduce"
  | "clawhub"
  | "duplicate_or_superseded"
  | "not_actionable_in_repo"
  | "incoherent"
  | "stale_insufficient_info"
  | "none";

export interface RepositoryProfile {
  targetRepo: string;
  slug: string;
  displayName: string;
  checkoutDir: string;
  docsUrl?: string;
  communityUrl?: string;
  promptNote: string;
  applyCloseRules: Partial<Record<RepositoryItemKind, readonly RepositoryCloseReason[]>>;
}

const OPENCLAW_CLOSE_REASONS: readonly RepositoryCloseReason[] = [
  "implemented_on_main",
  "cannot_reproduce",
  "clawhub",
  "duplicate_or_superseded",
  "not_actionable_in_repo",
  "incoherent",
  "stale_insufficient_info",
];

export const DEFAULT_TARGET_REPO = "Yaargh04/clawsweeper";

export const REPOSITORY_PROFILES: readonly RepositoryProfile[] = [
  {
    targetRepo: "Yaargh04/clawsweeper",
    slug: "yaargh04-clawsweeper",
    displayName: "ClawSweeper (Yaargh04)",
    checkoutDir: "clawsweeper",
    promptNote:
      "Self-review of the ClawSweeper fork. Review bot automation, workflow, and documentation changes conservatively. Only propose auto-close for pull requests that are certainly implemented on main; keep issues open for maintainer triage.",
    applyCloseRules: {
      issue: [],
      pull_request: ["implemented_on_main"],
    },
  },
  // Add website repos below as you build them, e.g.:
  // {
  //   targetRepo: "Yaargh04/my-website",
  //   slug: "yaargh04-my-website",
  //   displayName: "My Website",
  //   checkoutDir: "my-website",
  //   promptNote: "Review issues and PRs for a Next.js website. Keep issues open unless clearly implemented. Auto-close PRs that are confirmed merged on main.",
  //   applyCloseRules: {
  //     issue: ["duplicate_or_superseded", "incoherent", "stale_insufficient_info"],
  //     pull_request: ["implemented_on_main", "duplicate_or_superseded"],
  //   },
  // },
];

export function repositoryProfileFor(targetRepo: string): RepositoryProfile {
  const normalized = normalizeRepo(targetRepo);
  const profile = REPOSITORY_PROFILES.find(
    (candidate) => normalizeRepo(candidate.targetRepo) === normalized,
  );
  if (!profile) {
    throw new Error(
      `Unsupported target repo: ${targetRepo}. Known repos: ${REPOSITORY_PROFILES.map((candidate) => candidate.targetRepo).join(", ")}`,
    );
  }
  return profile;
}

export function repositoryProfileForSlug(slug: string): RepositoryProfile | undefined {
  return REPOSITORY_PROFILES.find((candidate) => candidate.slug === slug);
}

export function normalizeRepo(targetRepo: string): string {
  return targetRepo.trim().toLowerCase();
}

export function isAutoCloseAllowed(
  profile: RepositoryProfile,
  kind: RepositoryItemKind,
  reason: RepositoryCloseReason,
): boolean {
  return Boolean(profile.applyCloseRules[kind]?.includes(reason));
}
