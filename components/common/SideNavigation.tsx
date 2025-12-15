"use client";

import React, { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export interface SidebarMenuItem {
    id: string;
    label: string;
    icon?: string | React.ReactNode;
    children?: SidebarMenuItem[];
    onClick?: (item: SidebarMenuItem) => void;
    to?: string;
}

export interface SidebarProps {
    items: SidebarMenuItem[];
    activeId?: string;
    onActiveChange?: (id?: string) => void;
    className?: string;
    allowMultiOpen?: boolean;
}

export function SideNavigation({
    items,
    activeId: controlledActiveId,
    onActiveChange,
    className,
    allowMultiOpen = false,
}: SidebarProps) {
    const [internalActive, setInternalActive] = useState<string | undefined>(controlledActiveId);
    const activeId = controlledActiveId ?? internalActive;
    const router = useRouter();

    const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
    const [collapsed, setCollapsed] = useState<boolean>(() =>
        typeof window !== "undefined"
            ? localStorage.getItem("sidebar-collapsed") === "true"
            : false
    );

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", String(collapsed));
    }, [collapsed]);

    // useEffect(() => {
    //     if (controlledActiveId !== undefined) {
    //         setInternalActive(controlledActiveId);
    //     }
    // }, [controlledActiveId]);

    const handleClick = (item: SidebarMenuItem) => {
        router.push(item.to!);
        setActive(item.id);
    };

    const setActive = (id?: string) => {
        if (controlledActiveId === undefined) setInternalActive(id);
        onActiveChange?.(id);
    };

    const toggleOpen = (id: string) => {
        setOpenMap((prev) => {
            if (allowMultiOpen) {
                return { ...prev, [id]: !prev[id] };
            }
            return prev[id] ? {} : { [id]: true };
        });
    };

    const renderIcon = (icon?: string | React.ReactNode) => {
        if (!icon) {
            return (
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                        d="M4 7h4v4H4zM10 7h4v4h-4zM16 7h4v4h-4zM4 13h4v4H4zM10 13h4v4h-4zM16 13h4v4h-4z"
                        fill="currentColor"
                    />
                </svg>
            );
        }
        if (typeof icon === "string") {
            return <img src={icon} className="h-5 w-5 object-contain" alt="" />;
        }
        return icon;
    };

    const renderItems = (list: SidebarMenuItem[], level = 0) => (
        <ul className={clsx("space-y-2", level > 0 && "ml-3")}>
            {list.map((item) => {
                const hasChildren = item.children?.length;
                const isOpen = !!openMap[item.id];
                const isActive = activeId === item.id;

                return (
                    <li key={item.id}>
                        <button
                            className={clsx(
                                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-white transition",
                                "hover:bg-white/10 hover:-translate-y-0.5",
                                isActive && "bg-white/20 border border-white/30",
                                collapsed && "justify-center px-2"
                            )}
                            onClick={() => {
                                if (hasChildren) toggleOpen(item.id);
                                else {
                                    handleClick(item);
                                    setActive(item.id);
                                }
                            }}
                        >
                            <span className="flex items-center gap-4">
                                <span className="text-white">{renderIcon(item.icon)}</span>
                                {!collapsed && <span className="font-semibold">{item.label}</span>}
                            </span>

                            {!collapsed && hasChildren && (
                                <svg
                                    className={clsx(
                                        "h-4 w-4 transition-transform",
                                        isOpen && "rotate-90"
                                    )}
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5l8 7-8 7V5z" fill="currentColor" />
                                </svg>
                            )}
                        </button>

                        {hasChildren && isOpen && !collapsed && (
                            <div className="mt-2">{renderItems(item.children!, level + 1)}</div>
                        )}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <aside
            className={clsx(
                "relative h-screen bg-orange-400  px-5 py-5 text-white transition-all duration-300",
                collapsed ? "w-[70px] px-2" : "w-[260px]",
                className
            )}
        >
            <button
                className="absolute mt-16 right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 hover:bg-white/20"
                onClick={() => setCollapsed(!collapsed)}
                aria-label="Toggle sidebar"
            >
                {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
            </button>

            <nav className="mt-28">{renderItems(items)}</nav>
        </aside>
    );
}
