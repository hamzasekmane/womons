import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

export function PaginatedResourceSection({
  connection,
  children,
  ariaLabel,
  resourcesClassName,
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink, hasPreviousPage, hasNextPage}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className="flex flex-col gap-10">
            {/* Load Previous */}
            {hasPreviousPage && (
              <div className="flex justify-center">
                <PreviousLink className="inline-flex items-center gap-2 border border-[#1B2A3D]/25 px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#1B2A3D] transition-all hover:border-[#1B2A3D] hover:bg-[#1B2A3D] hover:text-white active:scale-[0.985]">
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#1B2A3D]/30 border-t-[#1B2A3D]" />
                      Loading previous...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                      Load Previous
                    </span>
                  )}
                </PreviousLink>
              </div>
            )}

            {/* Resources Grid */}
            {resourcesClassName ? (
              <div
                aria-label={ariaLabel}
                className={resourcesClassName}
                role={ariaLabel ? 'region' : undefined}
              >
                {resourcesMarkup}
              </div>
            ) : (
              resourcesMarkup
            )}

            {/* Load More */}
            {hasNextPage && (
              <div className="flex justify-center">
                <NextLink className="inline-flex items-center gap-2 bg-[#00000] px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all hover:bg-[#d8d1c6] hover:text-[#1B2A3D] active:scale-[0.985]">
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Loading more...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Load More
                      <svg
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14M5 12l7 7 7-7" />
                      </svg>
                    </span>
                  )}
                </NextLink>
              </div>
            )}
          </div>
        );
      }}
    </Pagination>
  );
}