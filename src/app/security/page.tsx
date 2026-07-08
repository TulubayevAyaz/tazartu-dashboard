"use client";

import { ShieldCheck, KeyRound, History, Lock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ROLE_ACCESS, AUDIT_LOG, SECURITY_BADGES } from "@/lib/data/security";

export default function SecurityPage() {
  return (
    <div>
      <PageHeader title="Безопасность" subtitle="Ролевая модель доступа, аутентификация и журнал аудита платформы." />

      <Card className="mb-5">
        <div className="flex flex-wrap gap-2">
          {SECURITY_BADGES.map((b) => (
            <Badge key={b} tone="success">
              <ShieldCheck size={12} /> {b}
            </Badge>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card title="Ролевая модель доступа (RBAC)" subtitle="Доступ ограничен ролью и регионом ОДТ">
          <div className="space-y-3">
            {ROLE_ACCESS.map((r) => (
              <div key={r.role} className="rounded-[12px] border border-border p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-[13.5px] font-semibold">{r.role}</div>
                  <Badge tone="brand">{r.scope}</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {r.sections.map((s) => (
                    <span key={s} className="rounded-full bg-surface-2 px-2.5 py-1 text-[11.5px] text-muted">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Вход в систему" subtitle="Демонстрация формы SSO-аутентификации">
          <div className="rounded-[16px] border border-border p-6 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-white mb-3">
              <Lock size={20} />
            </div>
            <div className="text-[14px] font-semibold mb-1">Единый вход (SSO)</div>
            <p className="text-[12.5px] text-muted mb-4 max-w-xs">
              Аутентификация через корпоративный Active Directory / LDAP. Доступ только из внутренней сети АО «Казахтелеком».
            </p>
            <button className="w-full max-w-xs rounded-full bg-gradient-to-r from-brand to-brand-2 text-white py-2.5 text-[13px] font-medium flex items-center justify-center gap-2">
              <KeyRound size={15} /> Войти через корпоративный SSO
            </button>
            <div className="text-[11.5px] text-muted mt-3">
              Демо-доступ: используйте переключатель роли в правом верхнем углу профиля.
            </div>
          </div>
        </Card>
      </div>

      <Card title="Журнал аудита" subtitle="Действия пользователей в системе">
        <div className="space-y-2">
          {AUDIT_LOG.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-[10px] px-2.5 py-2 hover:bg-surface-2/60 transition-colors">
              <History size={14} className="text-muted shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium truncate">{a.action}</div>
                <div className="text-[12px] text-muted">{a.user}</div>
              </div>
              <div className="text-[11.5px] text-muted shrink-0">
                {new Date(a.time).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
