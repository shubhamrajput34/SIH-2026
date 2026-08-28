'use client';

import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { PATHWAY, type Stage } from '@/data/pathway';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

/**
 * The end-to-end mechanism, stage by stage.
 *
 * The problem statement lists ten activities the mechanism must cover, and this
 * is the page that has to show all ten rather than assert coverage. So it is a
 * ledger, not a diagram: every row names the PS activity it implements, what
 * the department does, what the startup gets, and the standard template the
 * stage issues.
 *
 * Both sides are on every row on purpose. A mechanism that works for the
 * department and not for the startup produces empty challenges, and one that
 * works for the startup and not for the department never gets adopted — the
 * failure this pathway exists to fix is between the two, so neither column can
 * be dropped for brevity.
 */
export function StageLedger() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState<Stage['id'] | null>(PATHWAY[0].id);

  useGSAP(
    () => {
      if (!ref.current || reduced) return;
      gsap.from('[data-stage-row]', {
        autoAlpha: 0,
        y: 18,
        duration: 0.6,
        stagger: 0.05,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      });
    },
    { scope: ref, dependencies: [reduced] },
  );

  return (
    <ol ref={ref} className="border-t border-chalk/15">
      {PATHWAY.map((stage) => {
        const expanded = open === stage.id;

        return (
          <li key={stage.id} data-stage-row className="border-b border-chalk/12">
            <button
              type="button"
              data-cursor="open"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : stage.id)}
              className="group flex w-full items-baseline gap-6 py-5 text-left sm:gap-10"
            >
              <span
                className={cn(
                  'w-8 shrink-0 font-mono text-meta uppercase',
                  stage.isOurs ? 'text-signal' : 'text-chalk/40',
                )}
              >
                {stage.index}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-display text-display-xs font-extrabold uppercase text-chalk">
                  {stage.label}
                </span>
                <span className="mt-1 block font-mono text-meta uppercase text-chalk/45">
                  {stage.psActivity}
                </span>
              </span>

              {stage.isOurs ? (
                <span className="hidden shrink-0 font-mono text-meta uppercase text-signal sm:block">
                  Our addition
                </span>
              ) : null}

              <span
                aria-hidden="true"
                className={cn(
                  'shrink-0 font-mono text-meta text-chalk/40 transition-transform duration-500',
                  expanded ? 'rotate-45' : 'rotate-0',
                )}
              >
                +
              </span>
            </button>

            {expanded ? (
              <div className="grid gap-x-10 gap-y-6 pb-8 pl-0 sm:pl-[4.5rem] md:grid-cols-2">
                <div>
                  <span className="font-mono text-meta uppercase text-chalk/45">
                    The department
                  </span>
                  <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-chalk/80">
                    {stage.government}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-meta uppercase text-chalk/45">The startup</span>
                  <p className="mt-2 max-w-[46ch] text-sm leading-relaxed text-chalk/80">
                    {stage.startup}
                  </p>
                </div>

                {stage.template ? (
                  <div className="md:col-span-2">
                    <span className="font-mono text-meta uppercase text-signal">
                      Template issued
                    </span>
                    <p className="mt-2 text-sm text-chalk">{stage.template}</p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
