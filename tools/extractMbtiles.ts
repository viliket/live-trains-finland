#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

import Database from 'better-sqlite3';

type TileRow = {
  zoom_level: number;
  tile_column: number;
  tile_row: number;
  tile_data: Buffer;
};

type MetadataRow = { name: string; value: string };

function parseArgs(argv: string[]): { input: string; output: string } {
  const args: Record<string, string> = {};
  for (const arg of argv.slice(2)) {
    const match = arg.match(/^--([^=]+)=(.*)$/);
    if (match) args[match[1]] = match[2];
  }
  if (!args.input || !args.output) {
    console.error(
      'Usage: extractMbtiles --input=<file.mbtiles> --output=<dir>',
    );
    process.exit(1);
  }
  return { input: args.input, output: args.output };
}

function extensionFromFormat(format: string | undefined): string {
  switch (format) {
    case 'pbf':
    case 'mvt':
      return 'pbf';
    case 'jpg':
    case 'jpeg':
      return 'jpg';
    case 'webp':
      return 'webp';
    default:
      return 'png';
  }
}

function main(): void {
  const { input, output } = parseArgs(process.argv);

  const db = new Database(input, { readonly: true, fileMustExist: true });
  db.pragma('journal_mode = OFF');

  const metadata = db
    .prepare<[], MetadataRow>('SELECT name, value FROM metadata')
    .all();
  const format = metadata.find((row) => row.name === 'format')?.value;
  const ext = extensionFromFormat(format);

  fs.mkdirSync(output, { recursive: true });

  const tiles = db
    .prepare<
      [],
      TileRow
    >('SELECT zoom_level, tile_column, tile_row, tile_data FROM tiles')
    .all();

  for (const tile of tiles) {
    const { zoom_level: z, tile_column: x, tile_row: tmsY, tile_data } = tile;
    const y = (1 << z) - 1 - tmsY;
    const dir = path.join(output, String(z), String(x));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${y}.${ext}`), tile_data);
  }

  db.close();
  console.log(
    `Extracted ${tiles.length} ${ext} tiles from ${input} to ${output}`,
  );
}

main();
