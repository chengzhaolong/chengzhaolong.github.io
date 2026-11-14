/** 试用申请：把 software.yml 的 application 拼成 mailto（主题 + 已列好字段的正文） */
export interface TrialApplication {
  email: string;
  subject: string;
  fields: { k: string; hint?: string }[];
  extra_lines?: string[];
}

/**
 * 生成 mailto 链接：必填项列在正文最前面，可选项跟在一条分隔线下面。
 * 用户点开后只需在冒号后面填值，不用自己记要写什么。
 * 分隔符随语言变（中文全角冒号 / 英文半角冒号加空格）。
 */
export function buildTrialMailto(app: TrialApplication, separator = '：'): string {
  const required = app.fields.map((f) => `${f.k}${separator}`);
  const optional = (app.extra_lines ?? []).map((line) => `${line}${separator}`);
  const body = [...required, '', ...optional].join('\n');
  return `mailto:${app.email}?subject=${encodeURIComponent(app.subject)}&body=${encodeURIComponent(body)}`;
}
