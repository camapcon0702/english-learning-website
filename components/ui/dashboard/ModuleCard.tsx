"use client";

import { useRouter } from "next/navigation";
import React from "react";
import clsx from "clsx";

export interface ModuleCardProps {
    moduleName?: string;
    moduleDescription?: string;
    moduleIcon?: string;
    navigateTo?: string;
    className?: string;
}

export default function ModuleCard({
    moduleName = "Module",
    moduleDescription = "Module description goes here.",
    moduleIcon,
    navigateTo,
    className,
}: ModuleCardProps) {
    const router = useRouter();

    const handleClick = () => {
        if (navigateTo) router.push(navigateTo);
    };

    return (
        <div
            onClick={handleClick}
            role={navigateTo ? "button" : "group"}
            tabIndex={navigateTo ? 0 : -1}
            className={clsx(
                "group w-full select-none rounded-2xl bg-white p-6 lg:p-8 text-left",
                "border border-gray-200/80 shadow-sm",
                "transition-all duration-300 ease-out",
                "hover:border-orange-300 hover:shadow-xl hover:-translate-y-2",
                "hover:bg-gradient-to-br hover:from-white hover:to-orange-50/30",
                navigateTo ? "cursor-pointer" : "cursor-default",
                className
            )}
        >
            <div
                className="
                    relative mb-5 flex items-center justify-center
                    w-20 h-20 rounded-2xl
                    bg-gradient-to-br from-orange-100 via-orange-50 to-amber-50
                    border border-orange-200/50
                    shadow-sm
                    group-hover:shadow-md group-hover:scale-110
                    transition-all duration-300
                "
            >
                {moduleIcon ? (
                    <img
                        src={moduleIcon}
                        alt=""
                        className="
                            w-12 h-12 object-contain
                            pointer-events-none select-none
                            group-hover:scale-110 transition-transform duration-300
                        "
                    />
                ) : (
                    <div className="text-gray-400 text-sm">No Icon</div>
                )}
            </div>

            <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                {moduleName}
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
                {moduleDescription}
            </p>

            {navigateTo && (
                <div className="mt-4 flex items-center text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-semibold mr-2">Bắt đầu học</span>
                    <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}
