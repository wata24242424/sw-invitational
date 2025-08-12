import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { ENV } from './env';
import type { EntryPayload, PairingRow, LeaderboardRow, ResultsRow } from './types';

function auth() {
  const creds = JSON.parse(ENV.SA_KEY);
  const auth = new GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth;
}

function client() {
  return google.sheets({ version: 'v4', auth: auth() });
}

export async function appendEntry(payload: EntryPayload) {
  const sheets = client();
  const values = [[
    payload.name,
    payload.avg,
    payload.hasCar === 'yes' ? 'あり' : 'なし',
    payload.pickup,
    payload.note,
    new Date().toISOString()
  ]];
  await sheets.spreadsheets.values.append({
    spreadsheetId: ENV.SHEET_ID,
    range: `${ENV.SHEET_ENTRIES}!A:F`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}

export async function getAllEntries(): Promise<(string | number)[][]> {
  const sheets = client();
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: ENV.SHEET_ID,
    range: `${ENV.SHEET_ENTRIES}!A:F`,
  });
  return data.values ?? [];
}

export async function getPairings(): Promise<PairingRow[]> {
  const sheets = client();
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: ENV.SHEET_ID,
    range: `${ENV.SHEET_PAIRINGS}!A:D`,
  });
  const rows = data.values ?? [];
  // A: hole (OUT/IN), B: group, C: name, D: hc
  return rows.slice(1).map((r) => ({
    hole: (r[0] as 'OUT' | 'IN') ?? 'OUT',
    group: String(r[1] ?? ''),
    name: String(r[2] ?? ''),
    hc: r[3] ? Number(r[3]) : undefined,
  }));
}

export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  const sheets = client();
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: ENV.SHEET_ID,
    range: `${ENV.SHEET_LEADERBOARD}!A:D`,
  });
  const rows = data.values ?? [];
  // A: name, B: gross, C: net?, D: thru?
  return rows.slice(1).map((r) => ({
    name: String(r[0] ?? ''),
    gross: Number(r[1] ?? 0),
    net: r[2] ? Number(r[2]) : undefined,
    thru: r[3] ? String(r[3]) : undefined,
  }));
}

export async function getResults(): Promise<ResultsRow[]> {
  const sheets = client();
  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: ENV.SHEET_ID,
    range: `${ENV.SHEET_RESULTS}!A:E`,
  });
  const rows = data.values ?? [];
  // A: place, B: name, C: gross, D: net, E: hc
  return rows.slice(1).map((r) => ({
    place: Number(r[0] ?? 0),
    name: String(r[1] ?? ''),
    gross: Number(r[2] ?? 0),
    net: Number(r[3] ?? 0),
    hc: Number(r[4] ?? 0),
  }));
}
