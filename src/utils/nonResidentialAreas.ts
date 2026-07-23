// Unlike NYC DCP's NTA2020 ids, the current neighborhood dataset (see README "Map data") has
// no id convention that marks parks/cemeteries/airports/uninhabited islands, so this list is
// hand-curated from the 268 generated neighborhood names in src/data/neighborhoods.ts. These
// areas are shown on the map but excluded from click-to-track and stats. If the dataset is
// refreshed, diff the new neighborhoods.ts names against this list and adjust.
export const NON_RESIDENTIAL_IDS = new Set([
  'Alley_Pond_Park',
  'Bronx_Park',
  'Central_Park',
  'Crotona_Park',
  'Cunningham_Park',
  'Ellis_Island',
  'Ferry_Point_Park',
  'Floyd_Bennett_Field',
  'Flushing_Meadows_Corona_Park',
  'Forest_Park',
  'Freshkills_Park',
  'Governors_Island',
  'Great_Kills_Park',
  'Green_Wood_Cemetery',
  'Hart_Island',
  'Hoffman_Island',
  'Jamaica_Bay',
  'John_F_Kennedy_International_Airport',
  'LaGuardia_Airport',
  'Latourette_Park',
  'Liberty_Island',
  'Marine_Park',
  'North_Brother_Island',
  'Pelham_Bay_Park',
  'Pelham_Islands',
  'Prospect_Park',
  'Randall_s_Island',
  'Rikers_Island',
  'South_Brother_Island',
  'Van_Cortlandt_Park',
]);

export function isNonResidentialArea(id: string): boolean {
  return NON_RESIDENTIAL_IDS.has(id);
}
