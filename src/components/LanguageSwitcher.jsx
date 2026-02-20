"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname, routing } from "../i18n/routing";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
    const t = useTranslations("LanguageSwitcher");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    function onSelectChange(nextLocale) {
        router.replace(pathname, { locale: nextLocale });
    }

    return (
        <Select value={locale} onValueChange={onSelectChange}>
            <SelectTrigger className="w-[110px] h-9 border-none bg-transparent hover:bg-muted transition-colors focus:ring-0">
                <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder={t("label")} />
                </div>
            </SelectTrigger>
            <SelectContent align="end">
                {routing.locales.map((cur) => (
                    <SelectItem key={cur} value={cur}>
                        {cur === "en" ? "English" : cur === "fr" ? "Français" : "中文"}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
