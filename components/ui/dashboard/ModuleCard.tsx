"use client";

import { useRouter } from "next/navigation";
import React from "react";

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
            className={[
                "w-53 h-50 select-none rounded-2xl bg-white p-5 text-center shadow-[0_8px_20px_rgba(20,30,60,0.08)]",
                "transition-transform duration-200 ease-out hover:-translate-y-2 hover:shadow-[0_18px_38px_rgba(20,30,60,0.12)]",
                navigateTo ? "cursor-pointer" : "cursor-default",
                className || "",
            ].join(" ")}
        >
            <div
                className="
                    relative mb-3 flex items-center justify-center
                    w-21 h-21 mx-auto rounded-2xl
                    bg-linear-to-b from-[#eef2ff] to-[#f3e8ff]
                    shadow-[0_6px_16px_rgba(62,36,106,0.14)]
                    "
            >
                <div
                    className="
                        bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)]
                        w-full h-full flex items-center justify-center
                    "
                >
                    {moduleIcon ? (
                        <img
                            src={moduleIcon}
                            alt=""
                            className="
                                w-[70%] h-[70%] object-contain
                                pointer-events-none select-none
                            "
                        />
                    ) : (
                        <div className="text-gray-400 text-sm">No Icon</div>
                    )}
                </div>
            </div>

            <div className="mb-2 text-base font-semibold text-[#0f2130]">
                {moduleName}
            </div>

            <div className="text-sm font-medium text-[#7f8b98] leading-snug">
                {moduleDescription}
            </div>
        </div>
    );
}
