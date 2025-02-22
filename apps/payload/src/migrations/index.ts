import * as migration_20250119_115407 from './20250119_115407';
import * as migration_20250119_123550 from './20250119_123550';
import * as migration_20250119_192135 from './20250119_192135';
import * as migration_20250120_171036 from './20250120_171036';
import * as migration_20250121_100529 from './20250121_100529';
import * as migration_20250121_135745 from './20250121_135745';
import * as migration_20250204_182136 from './20250204_182136';
import * as migration_20250222_120457 from './20250222_120457';

export const migrations = [
  {
    up: migration_20250119_115407.up,
    down: migration_20250119_115407.down,
    name: '20250119_115407',
  },
  {
    up: migration_20250119_123550.up,
    down: migration_20250119_123550.down,
    name: '20250119_123550',
  },
  {
    up: migration_20250119_192135.up,
    down: migration_20250119_192135.down,
    name: '20250119_192135',
  },
  {
    up: migration_20250120_171036.up,
    down: migration_20250120_171036.down,
    name: '20250120_171036',
  },
  {
    up: migration_20250121_100529.up,
    down: migration_20250121_100529.down,
    name: '20250121_100529',
  },
  {
    up: migration_20250121_135745.up,
    down: migration_20250121_135745.down,
    name: '20250121_135745',
  },
  {
    up: migration_20250204_182136.up,
    down: migration_20250204_182136.down,
    name: '20250204_182136',
  },
  {
    up: migration_20250222_120457.up,
    down: migration_20250222_120457.down,
    name: '20250222_120457'
  },
];
