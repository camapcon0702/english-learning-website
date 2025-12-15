"use client";

import React from "react";
import Image from "next/image";
import clsx from "clsx";
import ModuleCard, { ModuleCardProps } from "./ModuleCard";

export interface ModuleGridProps {
    modules?: ModuleCardProps[];
    className?: string;
    onModuleClick?: (module: ModuleCardProps, index: number) => void;
    gridColumns?: string;
}

const defaultModules: ModuleCardProps[] = [
    {
        moduleName: "Ngữ pháp",
        moduleDescription: "Ngữ pháp cơ bản.",
        moduleIcon: "./images/icon_grammar.png",
        navigateTo: "/grammar"
    },
    {
        moduleName: "Từ vựng",
        moduleDescription: "Học từ vựng theo chủ đề.",
        moduleIcon: "./images/icon_vocabulary.png",
        navigateTo: "/vocabulary"
    },
    {
        moduleName: "Bài tập",
        moduleDescription: "Luyện tập kiến thức đã học.",
        moduleIcon: "./images/icon_exercise.png",
        navigateTo: "/exercise"
    },
    {
        moduleName: "Mini Game",
        moduleDescription: "Trò chơi rèn luyện phản xạ.",
        moduleIcon: "./images/icon_minigame.png",
        navigateTo: "/minigame"
    },
    {
        moduleName: "Flash Card",
        moduleDescription: "Ôn tập với Flash Card.",
        moduleIcon: "./images/icon_flashcard.png",
        navigateTo: "/flashcard"
    },
    {
        moduleName: "Lịch học",
        moduleDescription: "Theo dõi lịch học của bạn.",
        moduleIcon: "./images/icon_calendar.png",
        navigateTo: "/schedule"
    },
];

export default function ModulesGrid({
    modules = defaultModules,
    className,
    onModuleClick,
    gridColumns = "grid-cols-4",
}: ModuleGridProps) {
    const handleClick = (m: ModuleCardProps, idx: number) => {
        onModuleClick?.(m, idx);
    };

    return (
        <section
            className={[
                "w-full bg-transparent",
                className || ""
            ].join(" ")}
            aria-labelledby="module-grid-title"
        >
            <div
                className={clsx(
                    "grid gap-6 lg:gap-8 mx-auto",
                    gridColumns
                )}
                role="list"
                aria-label="Danh sách module"
            >
                {modules.map((m, i) => (
                    <div
                        key={i}
                        role="listitem"
                        tabIndex={0}
                        className="flex justify-center transition-transform duration-200 focus:-translate-y-1"
                        onClick={() => handleClick(m, i)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleClick(m, i);
                            }
                        }}
                    >
                        <ModuleCard
                            moduleName={m.moduleName}
                            moduleDescription={m.moduleDescription}
                            moduleIcon={m.moduleIcon}
                            navigateTo={m.navigateTo}
                        />
                    </div>
                ))}

                {modules.length === 0 && (
                    <div className="text-[#6b7280] text-center py-10 col-span-full">
                        Không có module nào để hiển thị
                    </div>
                )}
            </div>
        </section>
    );
}
