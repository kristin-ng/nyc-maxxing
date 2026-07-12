// NYC DCP's NTA2020 coding convention: the last two digits of the id flag non-residential
// geographies with no population — 71-79 cemeteries, 81-89 other (airports, islands, etc.),
// 91-99 parks. Everything else (01-69) is an ordinary residential NTA.
export function isNonResidentialNta(id: string): boolean {
  const suffix = Number(id.slice(-2));
  return suffix >= 71 && suffix <= 99;
}
