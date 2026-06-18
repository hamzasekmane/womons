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
          <div className="flex flex-col items-center gap-16 pb-12">
            
            {/* Load Previous */}
            {hasPreviousPage && (
              <PreviousLink className="group relative overflow-hidden rounded-full border border-gray-200 bg-white px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-black hover:bg-black hover:text-white">
                {isLoading ? (
                  <span className="flex w-full items-center justify-center tracking-[0.3em] animate-pulse">
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-4">
                    <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">↑</span>
                    Previous Page
                  </span>
                )}
              </PreviousLink>
            )}

            {/* Resources Grid */}
            {resourcesClassName ? (
              <div
                aria-label={ariaLabel}
                className={`w-full ${resourcesClassName}`}
                role={ariaLabel ? 'region' : undefined}
              >
                {resourcesMarkup}
              </div>
            ) : (
              resourcesMarkup
            )}

            {/* Load More */}
            {hasNextPage && (
              <NextLink className="group relative overflow-hidden rounded-full bg-black px-12 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:bg-gray-900 hover:shadow-2xl">
                {isLoading ? (
                  <span className="flex w-full items-center justify-center tracking-[0.3em] animate-pulse">
                    Loading...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-4 transition-all duration-500 group-hover:tracking-[0.25em]">
                    Discover More
                    <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-1">↓</span>
                  </span>
                )}
              </NextLink>
            )}

          </div>
        );
      }}
    </Pagination>
  );
}